import type { NextRequest } from "next/server";
import { USER_AGENT } from "@/app/api/pwhl/lib";

const logger = console;

// cache our own response for 20 minutes
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate
export const revalidate = 1200;

const realUrl =
  "https://cscsports.leaguelab.com/my-schedule-feed/2395630-bd8166fcedd127268408987db277deff";

export async function GET(req: NextRequest) {
  // fetch the schedule events from the source feed
  const resp = await fetch(realUrl, {
    headers: {
      "user-agent": req.headers.get(USER_AGENT) ?? "",
    },
  });

  logger.debug(`fetched schedule feed with status ${resp.status}`);

  return resp;
}
