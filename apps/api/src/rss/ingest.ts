import type { PrismaClient } from "@prisma/client";
import { RssFetchStatus } from "@prisma/client";
import { discoverAndFetchFeed, parseFeed } from "./feed.js";

export type RegisterBlogInput = {
  url: string;
  name?: string;
};

export type RegisterBlogResult = {
  blogId: string;
  rssUrl: string;
  siteUrl: string;
  blogName: string;
  createdPostCount: number;
};

export async function registerAndIngestBlog(
  prisma: PrismaClient,
  input: RegisterBlogInput
): Promise<RegisterBlogResult> {
  let rssUrl: string | undefined;
  let blogId: string | undefined;

  try {
    const discovered = await discoverAndFetchFeed(input.url);
    rssUrl = discovered.rssUrl;
    const parsedFeed = parseFeed(discovered.feedXml);

    const existingBlog = await prisma.blog.findUnique({
      where: { rssUrl }
    });

    const fallbackSiteUrl = new URL(discovered.requestedUrl).origin;
    const siteUrl = parsedFeed.siteUrl || fallbackSiteUrl;
    const blogName = input.name || parsedFeed.title || siteUrl;

    const blog = existingBlog
      ? await prisma.blog.update({
          where: { id: existingBlog.id },
          data: {
            name: blogName,
            siteUrl,
            lastFetchedAt: new Date()
          }
        })
      : await prisma.blog.create({
          data: {
            name: blogName,
            siteUrl,
            rssUrl,
            lastFetchedAt: new Date()
          }
        });

    blogId = blog.id;

    const postRows = parsedFeed.items.map((item) => ({
      title: item.title,
      url: item.url,
      summary: item.summary,
      publishedAt: item.publishedAt,
      blogId: blog.id
    }));

    const createdPostCount =
      postRows.length > 0
        ? (
            await prisma.post.createMany({
              data: postRows,
              skipDuplicates: true
            })
          ).count
        : 0;

    await prisma.rssFetchLog.create({
      data: {
        requestedUrl: input.url,
        resolvedRssUrl: rssUrl,
        status: RssFetchStatus.SUCCESS,
        itemCount: createdPostCount,
        blogId: blog.id
      }
    });

    return {
      blogId: blog.id,
      rssUrl,
      siteUrl,
      blogName,
      createdPostCount
    };
  } catch (error) {
    await recordFailure(prisma, input.url, rssUrl, blogId, error);
    throw error;
  }
}

async function recordFailure(
  prisma: PrismaClient,
  requestedUrl: string,
  resolvedRssUrl: string | undefined,
  blogId: string | undefined,
  error: unknown
): Promise<void> {
  try {
    await prisma.rssFetchLog.create({
      data: {
        requestedUrl,
        resolvedRssUrl,
        status: RssFetchStatus.FAILED,
        itemCount: 0,
        errorMessage: getErrorMessage(error),
        blogId
      }
    });
  } catch {
    // Logging failure should not hide original ingestion errors.
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Unknown RSS ingestion error";
}
