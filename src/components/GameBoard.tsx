import React, { useContext, useState, useEffect } from "react";
import { GameContext } from "../contexts/GameContext";
import type { Game, GameScore, Problem } from "../types";
import { Box, Typography, TextField, Button } from "@mui/material";

interface Props {
  problem: Problem;
  timer: Date | null;
  setTimer: (t: Date | null) => void;
  messageEror: boolean;
  currentGame: Game;
  gameScore?: GameScore[] | null;
}

const GameBoard: React.FC<Props> = ({
  problem,
  timer,
  setTimer,
  messageEror,
  currentGame,
  gameScore,
}) => {
  const { socket, player } = useContext(GameContext);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    setAnswer("");
  }, [problem]);

  useEffect(() => {
    if (!timer) {
      setTimeLeft(0);
      return;
    }
    console.log("Timer set to:", timer);
    console.log("Current time:", new Date());
    const updateTimeLeft = () => {
      const diff = Math.max(
        0,
        Math.ceil((timer.getTime() - Date.now()) / 1000)
      );
      setTimeLeft(diff);
      if (diff === 0) {
        submitAnswer();
        setTimer(null);
      }
    };

    updateTimeLeft();
    console.log("Time left updated:", timeLeft);
    const intervalId = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(intervalId);
  }, [timer]);

  const submitAnswer = () => {
    if (!socket || !player) return;
    console.log("Submitting answer:", answer);
    socket.emit("PlayerAnswer", { uuid: player.uuid, answer: Number(answer) });
  };
  return (
    <Box
      maxWidth={480}
      bgcolor="background.paper"
      p={4}
      borderRadius={3}
      boxShadow={3}
      sx={{ mx: "auto" }}
    >
      <Typography variant="subtitle1" gutterBottom>
        {currentGame.playersLogins[0]} elo:
        {currentGame.playersElo[0]}
        {" vs "}
        {currentGame.playersLogins[1]} elo:
        {currentGame.playersElo[1]}
        {" | Score: "}
        {gameScore ? gameScore[0].score : 0} -{" "}
        {gameScore ? gameScore[1].score : 0}
      </Typography>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {problem.title}
      </Typography>
      {messageEror && (
        <Typography color="error" mb={2}>
          Réponse incorrecte, essayez à nouveau !
        </Typography>
      )}
      <TextField
        type="number"
        fullWidth
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Votre réponse"
        variant="outlined"
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={submitAnswer}
        disabled={timeLeft === 0}
        sx={{ mb: 2 }}
      >
        Valider
      </Button>

      <Timer timeLeft={timeLeft} />
    </Box>
  );
};

interface TimerProps {
  timeLeft: number;
}

const Timer: React.FC<TimerProps> = ({ timeLeft }) => (
  <Typography
    variant="body2"
    fontFamily="monospace"
    color="text.secondary"
    textAlign="right"
  >
    Temps restant : {timeLeft}s
  </Typography>
);

export default GameBoard;
