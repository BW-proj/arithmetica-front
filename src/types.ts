export const PlayerStatus = {
  SEARCHING: "searching",
  PLAYING: "playing",
  CONNECTED: "connected",
} as const;

export type PlayerStatus = (typeof PlayerStatus)[keyof typeof PlayerStatus];

export interface Player {
  uuid: string;
  login: string;
  elo?: number;
  status: PlayerStatus;
}

export interface GameScore {
  login: string;
  elo: number;
  score: number;
}

export interface Problem {
  uuid: string;
  title: string;
  description: string;
  difficulty: number;
}

export interface Game {
  uuid: string;
  playersLogins: [string, string]; // Player logins
  playersElo: [number, number];
}
