import type { NextApiRequest, NextApiResponse } from "next";
import pino from "pino";
import {
  buildIcsEvents,
  fetchAllGames,
  filterGamesByTeam,
  generateIcalContent,
  USER_AGENT,
} from "@/app/api/pwhl/lib";

const logger = pino();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  const teams = getTeamsFromRequest(req);

  const allGames = await fetchAllGames();

  const filteredGames = filterGamesByTeam(allGames, teams);

  const icsEvents = buildIcsEvents(filteredGames);

  logger.info(
    `filtered w '%s' down to %s out of %s total PWHL games from user-agent '%s'`,
    teams,
    filteredGames?.length,
    allGames?.length,
    req.headers[USER_AGENT],
  );

  const outputIcsCalendar = generateIcalContent(teams, icsEvents);

  res
    .status(200)
    .setHeader("Content-Type", "text/calendar")
    .send(outputIcsCalendar);
}

function getTeamsFromRequest(req: NextApiRequest): string[] {
  let teams: string[] = [];
  if (req.query.teams) {
    teams = Array.isArray(req.query.teams)
      ? req.query.teams
      : req.query.teams.split(",");
  }
  teams.sort((a, b) => a.localeCompare(b));
  return teams;
}
