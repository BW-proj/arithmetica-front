import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import type { Player, Problem, GameScore, Game } from "../types";

interface UseSocketParams {
  setSocket: (s: Socket) => void;
  setPlayer: (p: Player) => void;
  setCurrentGame: (g: Game | null) => void;
  setCurrentProblem: (p: Problem | null) => void;
  setGameScore: (
    score:
      | GameScore[]
      | null
      | ((prev: GameScore[] | null) => GameScore[] | null)
  ) => void;
  setTimer: (t: Date | null) => void;
  setMessageEror: (bool: boolean) => void;
  setShowCountdown: (show: boolean) => void;
  setMessageWait: (bool: boolean) => void;
  player?: Player | null;
  setLeaderBoard: (leaderboard: {
    players: { login: string; elo: number; isInGame: boolean }[];
  }) => void;
}

export const useSocket = (
  login: string | null,
  {
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
  }: UseSocketParams
) => {
  useEffect(() => {
    if (!login) return;

    const socket = io("http://localhost:3000", {
      query: { login },
    });

    console.log("Socket created");

    socket.on("PlayerConnected", ({ success, player }) => {
      console.log("Player connected:", player);
      if (success) setPlayer(player);
    });

    socket.on("PlayerUpdated", ({ player }) => setPlayer(player));

    socket.on(
      "GameCreated",
      ({ playersLogins, playersElo, gameUuid, startAt }) => {
        setGameScore(null);
        setShowCountdown(true);
        setCurrentGame({
          uuid: gameUuid,
          playersLogins: playersLogins,
          playersElo: playersElo,
        });
        setTimer(new Date(new Date(startAt).getTime() + 60 * 1000));
      }
    );

    socket.on("GameStart", ({ problem }) => {
      setMessageWait(false);
      setCurrentProblem(problem);
    });

    socket.on("PlayerAnswerResult", ({ success, nextProblem }) => {
      console.log("Player answer result:", { success, nextProblem });
      if (success && nextProblem) {
        console.log("Correct answer, next problem:", nextProblem);
        setCurrentProblem(nextProblem);
      } else if (!success) {
        console.log("Incorrect answer, waiting for next problem");
        setMessageEror(true);
        setTimeout(() => {
          setMessageEror(false);
        }, 3000);
      }
    });

    socket.on("GameUpdated", ({ score }) => {
      console.log("Game updated:", score);
      if (score && typeof score === "object") {
        const updates: Partial<GameScore>[] = Object.values(score);
        setGameScore((prev: GameScore[] | null) => {
          if (!prev) return updates as GameScore[];

          return prev.map((player) => {
            const update = updates.find((u) => u.login === player.login);
            return update ? { ...player, ...update } : player;
          });
        });
      }
    });

    socket.on("GameEnded", (playersEloDiff: GameScore[]) => {
      console.log("Game ended:", playersEloDiff);
      setGameScore(Object.values(playersEloDiff));
      setCurrentGame(null);
      setCurrentProblem(null);
    });

    socket.on(
      "Leaderboard",
      ({
        leaderboard,
      }: {
        leaderboard: {
          players: {
            login: string;
            elo: number;
            isInGame: boolean;
          }[];
        };
      }) => {
        console.log("Leaderboard received:", leaderboard);
        setLeaderBoard(leaderboard);
      }
    );

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, [login]);
};
