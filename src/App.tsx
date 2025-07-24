import React, { useState, useContext } from "react";
import { Box, Typography, Paper, Container, IconButton } from "@mui/material";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { motion, AnimatePresence } from "framer-motion";
import { SocketProvider, GameContext } from "./contexts/GameContext";
import PseudoForm from "./components/PseudoForm";
import GameBoard from "./components/GameBoard";
import PreGameCountdown from "./components/PreGameCountDown";
import LobbySection from "./components/LobbySection";
import MatchFoundSection from "./components/MatchFoundSection";
import MatchEndSection from "./components/MatchEndSection";
import LeaderboardDialog from "./components/LeaderBoardDialog";

const App: React.FC = () => {
  const [pseudo, setPseudo] = useState<string | null>(null);
  return (
    <SocketProvider pseudo={pseudo}>
      {!pseudo ? <PseudoForm onSubmit={setPseudo} /> : <GameWithSocket />}
    </SocketProvider>
  );
};

export const GameWithSocket: React.FC = () => {
  const {
    player,
    currentGame,
    currentProblem,
    gameScore,
    timer,
    showCountdown,
    messageWait,
    leaderBoard,
    socket,
    setMessageWait,
    setShowCountdown,
    setTimer,
    messageEror,
  } = useContext(GameContext);

  const [openLeaderboard, setOpenLeaderboard] = useState(false);

  const handleSearchGame = () => {
    socket?.emit("PlayerSearchGame", { uuid: player?.uuid });
    setMessageWait(true);
  };
  const openBoard = () => {
    setOpenLeaderboard(true);
    socket?.emit("Leaderboard");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "transparent",
        background:
          "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
      }}
    >
      <Typography variant="h6" color="white" fontWeight="bold">
        Calcul Clash
      </Typography>
      <IconButton color="inherit" onClick={openBoard}>
        <LeaderboardIcon />
      </IconButton>

      <Container
        maxWidth="sm"
        sx={{
          pt: 12,
          pb: 4,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={
              gameScore
                ? "end"
                : currentGame
                ? currentProblem
                  ? showCountdown
                    ? "countdown"
                    : "game"
                  : "created"
                : messageWait
                ? "waiting"
                : "idle"
            }
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Paper
              elevation={4}
              sx={{
                borderRadius: 4,
                p: 4,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",

                bgcolor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 150,
                  height: 150,
                  bgcolor: "primary.main",
                  opacity: 0.1,
                  transform: "rotate(45deg)",
                }}
              />

              {!currentGame && !gameScore && (
                <LobbySection
                  playerLogin={player?.login || "Joueur"}
                  playerElo={player?.elo || 0}
                  messageWait={messageWait}
                  gameScore={gameScore}
                  onSearchGame={handleSearchGame}
                />
              )}

              {currentGame && !currentProblem && showCountdown && (
                <MatchFoundSection />
              )}

              {currentGame && currentProblem && showCountdown && (
                <PreGameCountdown
                  timer={timer}
                  onComplete={() => setShowCountdown(false)}
                />
              )}

              {currentGame && currentProblem && !showCountdown && (
                <GameBoard
                  problem={currentProblem}
                  timer={timer}
                  messageEror={messageEror}
                  setTimer={setTimer}
                  currentGame={currentGame}
                  gameScore={gameScore}
                />
              )}

              {gameScore && !currentProblem && (
                <MatchEndSection
                  gameScore={gameScore}
                  messageWait={messageWait}
                  onReplay={handleSearchGame}
                />
              )}
            </Paper>
          </motion.div>
        </AnimatePresence>
      </Container>

      <LeaderboardDialog
        open={openLeaderboard}
        onClose={() => setOpenLeaderboard(false)}
        leaderBoard={leaderBoard}
      />
    </Box>
  );
};

export default App;
