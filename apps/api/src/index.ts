import Fastify from "fastify";
import cors from "@fastify/cors";
import { env } from "./config/env.js";
import { prisma } from "./db/client.js";
import { createEmailSender } from "./email/provider.js";
import { registerHealthRoute } from "./routes/health.js";
import { registerSubscriptionRoutes } from "./routes/subscriptions.js";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: true
});

await registerHealthRoute(app);
await registerSubscriptionRoutes(app);

const emailSender = createEmailSender();
app.decorate("emailSender", emailSender);
app.decorate("prisma", prisma);

app.addHook("onClose", async () => {
  await prisma.$disconnect();
});

await app.listen({ port: env.PORT, host: "0.0.0.0" });
