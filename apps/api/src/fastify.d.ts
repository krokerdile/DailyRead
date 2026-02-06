import "fastify";
import type { EmailSender } from "@dailyread/email";
import type { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    emailSender: EmailSender;
    prisma: PrismaClient;
  }
}
