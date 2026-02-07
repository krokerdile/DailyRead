import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { registerAndIngestBlog } from "../rss/ingest.js";

const registerBlogSchema = z.object({
  url: z.string().url(),
  name: z.string().min(1).max(120).optional()
});

export async function registerBlogRoutes(app: FastifyInstance): Promise<void> {
  app.post("/blogs/register", async (request, reply) => {
    const parsed = registerBlogSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send({
        message: "Invalid blog payload",
        issues: parsed.error.issues
      });
    }

    try {
      const result = await registerAndIngestBlog(app.prisma, parsed.data);
      return reply.status(201).send({
        message: "Blog registered and ingested",
        ...result
      });
    } catch (error) {
      request.log.error({ err: error }, "Failed to register blog feed");
      return reply.status(422).send({
        message: "Failed to register blog feed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
}
