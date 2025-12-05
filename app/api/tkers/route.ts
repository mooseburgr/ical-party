import type { NextRequest } from "next/server";
import { TEXT_CAL, USER_AGENT } from "@/app/api/pwhl/lib";
import { generateIcalContent, getAllScheduleEvents } from "@/app/api/tkers/lib";

const logger = console;

// cache our own response for 20 minutes
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate
export const revalidate = 1200;

export async function GET(req: NextRequest) {
  const events = await getAllScheduleEvents();

  logger.info(
    `fetched %s TKers events for user-agent '%s'`,
    events.length,
    req.headers.get(USER_AGENT),
  );

  return new Response(generateIcalContent(events), {
    headers: {
      "content-type": TEXT_CAL,
      "cache-control": `public, max-age=${revalidate}, must-revalidate`,
    },
  });
}
