import type { PrismaClient } from "@prisma/client";
import type { FastifyBaseLogger } from "fastify";
import { refreshRegisteredBlogs } from "./ingest.js";

type SchedulerOptions = {
  prisma: PrismaClient;
  logger: FastifyBaseLogger;
  intervalMinutes: number;
  limit?: number;
  runOnStart?: boolean;
};

export function startRssRefreshScheduler(options: SchedulerOptions): { stop: () => void } {
  let isRunning = false;

  const run = async (trigger: "startup" | "interval"): Promise<void> => {
    if (isRunning) {
      options.logger.warn({ trigger }, "RSS refresh skipped: previous run still in progress");
      return;
    }

    isRunning = true;

    try {
      const result = await refreshRegisteredBlogs(options.prisma, options.limit);
      options.logger.info(
        {
          trigger,
          processedCount: result.processedCount,
          successCount: result.successCount,
          failureCount: result.failureCount,
          createdPostCount: result.createdPostCount
        },
        "RSS refresh completed"
      );
    } catch (error) {
      options.logger.error({ err: error, trigger }, "RSS refresh scheduler failed");
    } finally {
      isRunning = false;
    }
  };

  const timer = setInterval(() => {
    void run("interval");
  }, options.intervalMinutes * 60 * 1000);
  timer.unref();

  if (options.runOnStart) {
    void run("startup");
  }

  return {
    stop: () => clearInterval(timer)
  };
}
