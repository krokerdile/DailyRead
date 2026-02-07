import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { refreshRegisteredBlogs, registerAndIngestBlog } from "../rss/ingest.js";

const registerBlogSchema = z.object({
  url: z.string().url(),
  name: z.string().min(1).max(120).optional()
});

const refreshBlogsSchema = z.object({
  limit: z.number().int().min(1).max(100).optional()
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

  app.post("/blogs/refresh", async (request, reply) => {
    const parsed = refreshBlogsSchema.safeParse(request.body ?? {});

    if (!parsed.success) {
      return reply.status(400).send({
        message: "Invalid refresh payload",
        issues: parsed.error.issues
      });
    }

    try {
      const result = await refreshRegisteredBlogs(app.prisma, parsed.data.limit);
      return reply.status(200).send({
        message: "Blog refresh completed",
        ...result
      });
    } catch (error) {
      request.log.error({ err: error }, "Failed to refresh blogs");
      return reply.status(500).send({
        message: "Failed to refresh blogs",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
}
