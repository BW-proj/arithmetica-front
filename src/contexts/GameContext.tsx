import React, { createContext, type ReactNode, useState } from "react";
import { Socket } from "socket.io-client";
import type { Player, Game, Problem, GameScore } from "../types";
import { useSocket } from "../hooks/useSocket";

type GameContextType = {
  socket: Socket | null;
  setSocket: (s: Socket) => void;
  player: Player | null;
  setPlayer: (p: Player) => void;
  currentGame: Game | null;
  setCurrentGame: (g: Game | null) => void;
  currentProblem: Problem | null;
  setCurrentProblem: (p: Problem | null) => void;
  gameScore: GameScore[] | null;
  setGameScore: (score: GameScore[] | null) => void;
  timer: Date | null;
  setTimer: (t: Date | null) => void;
  messageEror: boolean;
  setMessageEror: (bool: boolean) => void;
  setShowCountdown: (show: boolean) => void;
  showCountdown: boolean;
  setMessageWait: (bool: boolean) => void;
  messageWait: boolean;
  leaderBoard: {
    players: { login: string; elo: number; isInGame: boolean }[];
  };
  setLeaderBoard: (leaderboard: {
    players: { login: string; elo: number; isInGame: boolean }[];
  }) => void;
};

export const GameContext = createContext<GameContextType>({
  socket: null,
  setSocket: () => {},
  player: null,
  setPlayer: () => {},
  currentGame: null,
  setCurrentGame: () => {},
  currentProblem: null,
  setCurrentProblem: () => {},
  gameScore: null,
  setTimer: () => {},
  timer: null,
  setGameScore: () => {},
  setMessageEror: () => {},
  messageEror: false,
  setShowCountdown: () => {},
  showCountdown: true,
  setMessageWait: () => {},
  messageWait: false,
  leaderBoard: { players: [] },
  setLeaderBoard: () => {},
});

export const SocketProvider: React.FC<{
  pseudo: string | null;
  children: ReactNode;
}> = ({ pseudo, children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [gameScore, setGameScore] = useState<GameScore[] | null>(null);
  const [timer, setTimer] = useState<Date | null>(null);
  const [messageEror, setMessageEror] = useState<boolean>(false);
  const [messageWait, setMessageWait] = useState<boolean>(false);

  const [showCountdown, setShowCountdown] = useState(true);
  const [leaderBoard, setLeaderBoard] = useState<{
    players: { login: string; elo: number; isInGame: boolean }[];
  }>({ players: [] });

  useSocket(pseudo, {
    setSocket,
    setPlayer,
    setCurrentGame,
    setCurrentProblem,
    setGameScore,
    setTimer,
    setMessageEror,
    setShowCountdown,
    setMessageWait,
    setLeaderBoard,
  });

  return (
    <GameContext.Provider
      value={{
        socket,
        setSocket,
        player,
        setPlayer,
        currentGame,
        setCurrentGame,
        currentProblem,
        setCurrentProblem,
        gameScore,
        setGameScore,
        timer,
        setTimer,
        messageEror,
        setMessageEror,
        setShowCountdown,
        showCountdown,
        setMessageWait,
        messageWait,
        leaderBoard,
        setLeaderBoard,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
