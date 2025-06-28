export interface LeagueLabEvent {
  teamId: number;
  id: string | undefined;
  date: string | undefined;
  time: string | undefined;
  location: string | undefined;
  field: string | undefined;
  opponent: string | undefined;
  homeOrVisitor: string | undefined;
  result: string | undefined;
}
