export interface LeagueLabEvent {
  teamId: number;
  teamName: string;
  gameId?: string;
  leagueId?: string;
  date?: string;
  time?: string;
  location?: string;
  locationId?: string;
  field?: string;
  opponent?: string;
  homeOrVisitor?: string;
  result?: string;
}
