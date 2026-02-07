type ParsedFeedItem = {
  title: string;
  url: string;
  summary?: string;
  publishedAt: Date;
};

export type ParsedFeed = {
  title?: string;
  siteUrl?: string;
  items: ParsedFeedItem[];
};

type DiscoverResult = {
  requestedUrl: string;
  rssUrl: string;
  siteUrl?: string;
  feedXml: string;
};

const RSS_CONTENT_TYPES = [
  "application/rss+xml",
  "application/atom+xml",
  "application/xml",
  "text/xml"
];

export async function discoverAndFetchFeed(inputUrl: string): Promise<DiscoverResult> {
  const requestedUrl = normalizeUrl(inputUrl);
  const initial = await fetchText(requestedUrl);

  if (looksLikeXmlFeed(initial.body, initial.contentType)) {
    return {
      requestedUrl,
      rssUrl: requestedUrl,
      feedXml: initial.body
    };
  }

  const discoveredRssUrl = await discoverRssUrlFromHtml(initial.body, requestedUrl);
  if (!discoveredRssUrl) {
    throw new Error("RSS/Atom 링크를 찾을 수 없습니다.");
  }

  const feedResponse = await fetchText(discoveredRssUrl);
  if (!looksLikeXmlFeed(feedResponse.body, feedResponse.contentType)) {
    throw new Error("발견된 RSS URL이 유효한 XML 피드가 아닙니다.");
  }

  return {
    requestedUrl,
    rssUrl: discoveredRssUrl,
    feedXml: feedResponse.body
  };
}

export function parseFeed(xml: string): ParsedFeed {
  const items = xml.includes("<item") ? parseRssItems(xml) : parseAtomItems(xml);
  const title = cleanupText(getTagContent(xml, "title"));

  return {
    title: title || undefined,
    siteUrl: parseFeedSiteUrl(xml),
    items
  };
}

function parseRssItems(xml: string): ParsedFeedItem[] {
  const itemBlocks = getBlocks(xml, "item");
  return normalizeItems(
    itemBlocks.map((itemXml) => {
      const title = cleanupText(getTagContent(itemXml, "title")) || "Untitled";
      const rawLink = cleanupText(getTagContent(itemXml, "link"));
      const publishedRaw =
        cleanupText(getTagContent(itemXml, "pubDate")) ||
        cleanupText(getTagContent(itemXml, "dc:date"));
      const summary =
        cleanupText(getTagContent(itemXml, "description")) ||
        cleanupText(getTagContent(itemXml, "content:encoded")) ||
        undefined;

      return {
        title,
        url: rawLink || "",
        summary,
        publishedAt: parseDateOrNow(publishedRaw)
      };
    })
  );
}

function parseAtomItems(xml: string): ParsedFeedItem[] {
  const entryBlocks = getBlocks(xml, "entry");
  return normalizeItems(
    entryBlocks.map((entryXml) => {
      const title = cleanupText(getTagContent(entryXml, "title")) || "Untitled";
      const link =
        extractHrefFromLink(entryXml, "alternate") ||
        extractHrefFromLink(entryXml) ||
        cleanupText(getTagContent(entryXml, "id")) ||
        "";
      const publishedRaw =
        cleanupText(getTagContent(entryXml, "published")) ||
        cleanupText(getTagContent(entryXml, "updated"));
      const summary =
        cleanupText(getTagContent(entryXml, "summary")) ||
        cleanupText(getTagContent(entryXml, "content")) ||
        undefined;

      return {
        title,
        url: link,
        summary,
        publishedAt: parseDateOrNow(publishedRaw)
      };
    })
  );
}

function normalizeItems(items: ParsedFeedItem[]): ParsedFeedItem[] {
  const seenUrls = new Set<string>();
  const result: ParsedFeedItem[] = [];

  for (const item of items) {
    if (!item.url) {
      continue;
    }

    const normalizedUrl = normalizeUrlOrEmpty(item.url);
    if (!normalizedUrl || seenUrls.has(normalizedUrl)) {
      continue;
    }

    seenUrls.add(normalizedUrl);
    result.push({
      ...item,
      url: normalizedUrl
    });
  }

  return result;
}

function parseFeedSiteUrl(xml: string): string | undefined {
  const rssLink = cleanupText(getTagContent(xml, "link"));
  if (rssLink && rssLink.startsWith("http")) {
    return rssLink;
  }

  const atomAlternate = extractHrefFromLink(xml, "alternate");
  return atomAlternate || undefined;
}

async function discoverRssUrlFromHtml(html: string, baseUrl: string): Promise<string | null> {
  const linkTagRegex = /<link\b[^>]*>/gi;
  const linkTags = html.match(linkTagRegex) ?? [];

  for (const tag of linkTags) {
    const rel = (extractAttribute(tag, "rel") || "").toLowerCase();
    const type = (extractAttribute(tag, "type") || "").toLowerCase();
    const href = extractAttribute(tag, "href");

    if (!href) {
      continue;
    }

    const isAlternate = rel.includes("alternate");
    const isRssType =
      type.includes("rss") || type.includes("atom") || type.includes("xml");

    if (isAlternate && isRssType) {
      return resolveUrl(baseUrl, href);
    }

    if (isAlternate && (href.toLowerCase().includes("rss") || href.toLowerCase().includes("atom"))) {
      return resolveUrl(baseUrl, href);
    }
  }

  const fallbackFeedUrl = await discoverFallbackFeedUrl(baseUrl);
  if (fallbackFeedUrl) {
    return fallbackFeedUrl;
  }

  return null;
}

async function discoverFallbackFeedUrl(baseUrl: string): Promise<string | null> {
  const parsed = new URL(baseUrl);
  const candidates = [
    new URL("/rss", parsed.origin).toString(),
    new URL("/feed", parsed.origin).toString(),
    new URL("/atom.xml", parsed.origin).toString(),
    new URL("/index.xml", parsed.origin).toString()
  ];

  for (const candidate of candidates) {
    const isFeed = await isReachableFeed(candidate);
    if (isFeed) {
      return candidate;
    }
  }

  return null;
}

async function isReachableFeed(url: string): Promise<boolean> {
  try {
    const response = await fetchText(url);
    return looksLikeXmlFeed(response.body, response.contentType);
  } catch {
    return false;
  }
}

function extractHrefFromLink(xml: string, rel?: string): string | null {
  const linkTagRegex = /<link\b[^>]*>/gi;
  const linkTags = xml.match(linkTagRegex) ?? [];

  for (const tag of linkTags) {
    const relValue = (extractAttribute(tag, "rel") || "").toLowerCase();
    if (rel && relValue !== rel.toLowerCase()) {
      continue;
    }

    const href = extractAttribute(tag, "href");
    if (href) {
      return normalizeUrlOrEmpty(href) || href;
    }
  }

  return null;
}

function extractAttribute(tag: string, attr: string): string | null {
  const regex = new RegExp(`${attr}\\s*=\\s*["']([^"']+)["']`, "i");
  const match = tag.match(regex);
  return match?.[1] ?? null;
}

function getBlocks(xml: string, tagName: string): string[] {
  const regex = new RegExp(`<${escapeRegex(tagName)}\\b[^>]*>([\\s\\S]*?)<\\/${escapeRegex(tagName)}>`, "gi");
  return Array.from(xml.matchAll(regex)).map((match) => match[1] || "");
}

function getTagContent(xml: string, tagName: string): string {
  const regex = new RegExp(`<${escapeRegex(tagName)}\\b[^>]*>([\\s\\S]*?)<\\/${escapeRegex(tagName)}>`, "i");
  const match = xml.match(regex);
  return match?.[1] ?? "";
}

function cleanupText(value: string): string {
  if (!value) {
    return "";
  }

  const withoutCdata = value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  const withoutTags = withoutCdata.replace(/<[^>]+>/g, " ");
  const decoded = decodeHtmlEntities(withoutTags);
  return decoded.replace(/\s+/g, " ").trim();
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function parseDateOrNow(input?: string): Date {
  if (!input) {
    return new Date();
  }

  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }

  return parsed;
}

function looksLikeXmlFeed(body: string, contentType: string | null): boolean {
  if (!body) {
    return false;
  }

  if (contentType) {
    const lowered = contentType.toLowerCase();
    if (RSS_CONTENT_TYPES.some((type) => lowered.includes(type))) {
      return true;
    }
  }

  const trimmed = body.trim().toLowerCase();
  return trimmed.startsWith("<?xml") || trimmed.includes("<rss") || trimmed.includes("<feed");
}

async function fetchText(url: string): Promise<{ body: string; contentType: string | null }> {
  const response = await fetch(url, {
    headers: {
      "user-agent": "DailyReadBot/0.1 (+https://dailyread.local)"
    }
  });

  if (!response.ok) {
    throw new Error(`피드 요청 실패: ${response.status} ${response.statusText}`);
  }

  return {
    body: await response.text(),
    contentType: response.headers.get("content-type")
  };
}

function normalizeUrl(url: string): string {
  const parsed = new URL(url.trim());
  return parsed.toString();
}

function normalizeUrlOrEmpty(url: string): string {
  try {
    return normalizeUrl(url);
  } catch {
    return "";
  }
}

function resolveUrl(base: string, maybeRelative: string): string {
  return new URL(maybeRelative, base).toString();
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
