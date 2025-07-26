import React, { useContext, useState, useEffect, useRef } from "react";
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
  const answerRef = useRef<HTMLInputElement>(null);

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
  useEffect(() => {
    if (messageEror) {
      setAnswer("");
    }
  }, [messageEror]);

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        if (timeLeft > 0) {
          submitAnswer();
          answerRef.current?.focus();
        }
      }}
      maxWidth={480}
      bgcolor="background.paper"
      p={4}
      borderRadius={4}
      boxShadow={4}
      sx={{
        mx: "auto",
        textAlign: "center",
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          mb: 2,
          fontWeight: "bold",
          color: "primary.main",
          textTransform: "uppercase",
        }}
      >
        {currentGame.playersLogins[0]} (🏅{currentGame.playersElo[0]}){"  VS  "}
        {currentGame.playersLogins[1]} (🏅{currentGame.playersElo[1]})
        <br />
        🎯 Score : {gameScore?.[0].score ?? 0} – {gameScore?.[1].score ?? 0}
      </Typography>

      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          mb: 3,
          color: "#4f46e5",
          textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
        }}
      >
        {problem.title}
      </Typography>

      {messageEror && (
        <Typography color="error" sx={{ mb: 2, fontWeight: "medium" }}>
          ❌ Réponse incorrecte, essayez encore !
        </Typography>
      )}

      <TextField
        type="number"
        inputRef={answerRef}
        fullWidth
        value={answer}
        autoFocus
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Votre réponse"
        variant="outlined"
        sx={{
          mb: 2,
          backgroundColor: "#f9fafb",
          borderRadius: 1,
          input: { textAlign: "center", fontWeight: "bold" },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={timeLeft === 0}
        sx={{
          mb: 2,
          py: 1.5,
          fontWeight: "bold",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          "&:hover": {
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          },
        }}
      >
        ✅ Valider
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
    color={timeLeft <= 5 ? "error.main" : "text.secondary"}
    textAlign="right"
    sx={{ fontWeight: "medium" }}
  >
    ⏳ Temps restant : {timeLeft}s
  </Typography>
);

export default GameBoard;
