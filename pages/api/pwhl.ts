import type { NextApiRequest, NextApiResponse } from "next";
import * as ics from "ts-ics";
import pino from "pino";

const logger = pino();

const everyGameId = Array.from({ length: 999 }, (_, i) => i + 1).join(",");
const allGamesIcalUrl = `https://lscluster.hockeytech.com/components/calendar/ical_add_games.php?client_code=pwhl&game_ids=${everyGameId}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  const teams = Array.isArray(req.query.teams)
    ? req.query.teams
    : [req.query.teams];

  const allGamesResponse = await fetch(allGamesIcalUrl);

  const allGamesCalendar = ics.parseIcsCalendar(await allGamesResponse.text());

  logger.info(`found ${allGamesCalendar.events?.length} total PWHL games`);

  // filter for teams
  const filteredGames = allGamesCalendar.events?.filter((game) => {
    for (const team of teams) {
      if (game.summary.includes(team || "")) {
        return true;
      }
    }
    return false;
  });

  logger.info(
    `filtered with '${teams}' down to ${filteredGames?.length} games`,
  );
  const filteredGamesCalendar = { ...allGamesCalendar, events: filteredGames };
  const outputIcsCalendar = ics.generateIcsCalendar(filteredGamesCalendar);

  res.status(200).send(outputIcsCalendar);
}
