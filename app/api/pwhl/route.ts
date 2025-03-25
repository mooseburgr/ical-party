import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import pino from "pino";
import {
  TEXT_CAL,
  USER_AGENT,
  buildIcsEvents,
  fetchAllGames,
  filterGamesByTeam,
  generateIcalContent,
  getTeamsFromRequest,
} from "./lib";

const logger = pino();

// cache our own response for 2 minutes
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate
export const revalidate = 120;

export async function GET(req: NextRequest) {
  const teams = getTeamsFromRequest(req);

  const allGames = await fetchAllGames();

  const filteredGames = filterGamesByTeam(allGames, teams);

  const icsEvents = buildIcsEvents(filteredGames);

  logger.info(
    `filtered w '%s' down to %s out of %s total PWHL games from user-agent '%s'`,
    teams,
    filteredGames?.length,
    allGames?.length,
    (await headers()).get(USER_AGENT),
  );

  const outputIcsCalendar = generateIcalContent(teams, icsEvents);

  return new Response(outputIcsCalendar, {
    headers: {
      "content-type": TEXT_CAL,
      "cache-control": `public, max-age=${revalidate}, must-revalidate`,
    },
  });
}
