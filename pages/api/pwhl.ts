import type { NextApiRequest, NextApiResponse } from "next";
import * as ics from "ts-ics";
const logger = require("pino")();

const everyGameId = Array.from({ length: 999 }, (_, i) => i + 1).join(",");
const allGamesIcalUrl = `https://lscluster.hockeytech.com/components/calendar/ical_add_games.php?client_code=pwhl&game_ids=${everyGameId}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const teams = Array.isArray(req.query.teams)
    ? req.query.teams
    : [req.query.teams];

  const allGamesResponse = await fetch(allGamesIcalUrl);

  const allGames = ics.parseIcsCalendar(await allGamesResponse.text());

  logger.info(`found ${allGames.events?.length} total PWHL games`);

  // filter for teams
  const filteredGames = allGames.events?.filter((game) => {
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

  const icsCalendar = ics.generateIcsCalendar(allGames);

  res.status(200).send(icsCalendar);
}
