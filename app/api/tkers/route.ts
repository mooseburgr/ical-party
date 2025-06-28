import * as cheerio from "cheerio";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import pino from "pino";
import { TEXT_CAL } from "@/app/api/pwhl/lib";
import { getScheduleForTeamId, teamIds } from "@/app/api/tkers/lib";

const logger = pino();

// cache our own response for 10 minutes
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate
export const revalidate = 600;

export async function GET(req: NextRequest) {
  const result = await getScheduleForTeamId(teamIds[0]);

  return new Response(JSON.stringify(result), {
    headers: {
      "content-type": TEXT_CAL,
      "cache-control": `public, max-age=${revalidate}, must-revalidate`,
    },
  });
}
