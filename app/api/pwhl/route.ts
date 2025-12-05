import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import {
  buildIcsEvents,
  fetchAllGames,
  filterGamesByTeam,
  generateIcalContent,
  getTeamsFromRequest,
  logger,
  TEXT_CAL,
  USER_AGENT,
} from "./lib";

// cache our own response for 5 minutes
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate
export const revalidate = 300;

export async function GET(req: NextRequest) {
  const teams = getTeamsFromRequest(req);

  const allGames = await fetchAllGames();

  const filteredGames = filterGamesByTeam(allGames, teams);

  const icsEvents = buildIcsEvents(filteredGames);

  logger.info(
    `filtered w '${teams}' down to ${filteredGames?.length} out of ${allGames?.length} total PWHL games from user-agent '${(await headers()).get(USER_AGENT)}'`,
  );

  return new Response(generateIcalContent(teams, icsEvents), {
    headers: {
      "content-type": TEXT_CAL,
      "cache-control": `public, max-age=${revalidate}, must-revalidate`,
    },
  });
}
