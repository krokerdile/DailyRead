import type { FastifyInstance } from "fastify";
import { z } from "zod";

const subscriptionSchema = z.object({
  email: z.string().email()
});

export async function registerSubscriptionRoutes(app: FastifyInstance): Promise<void> {
  app.post("/subscriptions", async (request, reply) => {
    const parsed = subscriptionSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send({
        message: "Invalid email payload",
        issues: parsed.error.issues
      });
    }

    const subscriber = await app.prisma.subscriber.upsert({
      where: { email: parsed.data.email },
      update: {
        isActive: true
      },
      create: {
        email: parsed.data.email,
        group: {
          connectOrCreate: {
            where: { slug: "system" },
            create: {
              slug: "system",
              name: "System Group",
              isSystem: true
            }
          }
        }
      }
    });

    return reply.status(201).send({
      message: "Subscribed",
      email: subscriber.email,
      subscriberId: subscriber.id
    });
  });
}
