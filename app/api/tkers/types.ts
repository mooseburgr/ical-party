export interface LeagueLabEvent {
  teamId: number;
  id?: string;
  date?: string;
  time?: string;
  location?: string;
  field?: string;
  opponent?: string;
  homeOrVisitor?: string;
  result?: string;
}
