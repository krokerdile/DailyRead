import Fastify from "fastify";
import cors from "@fastify/cors";
import { env } from "./config/env.js";
import { prisma } from "./db/client.js";
import { createEmailSender } from "./email/provider.js";
import { registerHealthRoute } from "./routes/health.js";
import { registerBlogRoutes } from "./routes/blogs.js";
import { registerSubscriptionRoutes } from "./routes/subscriptions.js";
import { startRssRefreshScheduler } from "./rss/scheduler.js";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: true
});

await registerHealthRoute(app);
await registerSubscriptionRoutes(app);
await registerBlogRoutes(app);

const emailSender = createEmailSender();
app.decorate("emailSender", emailSender);
app.decorate("prisma", prisma);

const rssScheduler =
  env.RSS_REFRESH_SCHEDULER_ENABLED === "true"
    ? startRssRefreshScheduler({
        prisma,
        logger: app.log,
        intervalMinutes: env.RSS_REFRESH_INTERVAL_MINUTES,
        limit: env.RSS_REFRESH_BATCH_LIMIT,
        runOnStart: env.RSS_REFRESH_RUN_ON_START === "true"
      })
    : null;

app.addHook("onClose", async () => {
  rssScheduler?.stop();
  await prisma.$disconnect();
});

await app.listen({ port: env.PORT, host: "0.0.0.0" });
