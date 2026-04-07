import type { NextRequest } from "next/server";
import { USER_AGENT } from "@/app/api/pwhl/lib";

const logger = console;

// cache our own response for 20 minutes
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate
export const revalidate = 1200;

export async function GET(req: NextRequest) {
  // fetch the schedule events from passed URL param
  const url = req.nextUrl.searchParams.get("url") ?? "";
  const resp = await fetch(url, {
    headers: {
      "user-agent": req.headers.get(USER_AGENT) ?? "",
    },
  });

  logger.debug(`proxied URL feed ${url} with status ${resp.status}`);

  return resp;
}
