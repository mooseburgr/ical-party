import type { NextRequest } from "next/server";

const logger = console;

// cache our own response for 20 minutes
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate
export const revalidate = 1200;

export async function GET(req: NextRequest) {
  // fetch the schedule events from passed URL param
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return new Response("No URL provided", { status: 204 });
  }

  const resp = await fetch(url);

  logger.debug(`proxied URL feed ${url} with status ${resp.status}`);

  return resp;
}
