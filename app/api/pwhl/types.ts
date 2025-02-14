export interface HockeyTechResponse {
  SiteKit: SiteKit;
}

export interface SiteKit {
  Parameters: Parameters;
  Schedule: Game[];
  Copyright: Copyright;
}

export interface Parameters {
  feed: string;
  view: string;
  key: string;
  fmt: string;
  client_code: string;
  lang: string;
  lang_id: number;
  league_id: string;
  season_id: string;
}

export interface Game {
  id: string;
  game_id: string;
  season_id: string;
  quick_score: string;
  date_played: string;
  date: string;
  date_with_day: string;
  date_time_played: string;
  GameDateISO8601: string;
  home_team: string;
  visiting_team: string;
  home_goal_count: string;
  visiting_goal_count: string;
  period: string;
  overtime: string;
  schedule_time: string;
  schedule_notes: string;
  game_clock: string;
  timezone: string;
  game_number: string;
  shootout: string;
  attendance: string;
  status: string;
  location: string;
  game_status: string;
  intermission: string;
  game_type: string;
  game_letter: string;
  if_necessary: string;
  period_trans: string;
  started: string;
  final: string;
  tickets_url: string;
  home_audio_url: string;
  visiting_audio_url: string;
  home_team_name: string;
  home_team_code: string;
  home_team_nickname: string;
  home_team_city: string;
  home_team_division_long: string;
  home_team_division_short: string;
  visiting_team_name: string;
  visiting_team_code: string;
  visiting_team_nickname: string;
  visiting_team_city: string;
  visiting_team_division_long: string;
  visiting_team_division_short: string;
  notes_text: string;
  use_shootouts: string;
  venue_name: string;
  venue_url: string;
  venue_location: string;
  last_modified: string;
  flo_core_event_id: string;
  flo_live_event_id: string;
  htv_game_id: string;
  client_code: string;
  scheduled_time: string;
  broadcasters: Broadcasters;
  mobile_calendar: string;
}

export interface Broadcasters {
  home_video?: HomeVideo[];
  home_video_fr?: HomeVideoFr[];
  visiting_video?: VisitingVideo[];
}

export interface HomeVideo {
  broadcaster_id: string;
  name: string;
  logo_url: string;
  url: string;
}

export interface HomeVideoFr {
  broadcaster_id: string;
  name: string;
  logo_url: string;
  url: string;
}

export interface VisitingVideo {
  broadcaster_id: string;
  name: string;
  logo_url: string;
  url: string;
}

export interface Copyright {
  required_copyright: string;
  required_link: string;
  powered_by: string;
  powered_by_url: string;
}
