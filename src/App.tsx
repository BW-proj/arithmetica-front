import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { motion, AnimatePresence } from "framer-motion";
import { SocketProvider, GameContext } from "./contexts/GameContext";
import PseudoForm from "./components/PseudoForm";
import GameBoard from "./components/GameBoard";
import PreGameCountdown from "./components/PreGameCountDown";

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
      <Box
        component="header"
        sx={{
          position: "fixed",
          top: 0,
          width: "100%",
          p: 2,
          backdropFilter: "blur(8px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" color="white" fontWeight="bold">
          Calcul Clash
        </Typography>
        <IconButton color="inherit" onClick={openBoard}>
          <LeaderboardIcon />
        </IconButton>
      </Box>

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
              // génère une clé selon l'état pour forcer la transition
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
                <>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{
                      mb: 2,
                      color: "white",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {messageWait ? (
                      "🔍 Recherche en cours…"
                    ) : (
                      <>
                        <Box component="span" sx={{ fontSize: "1.2rem" }}>
                          Bienvenue{" "}
                          <Box
                            component="span"
                            sx={{
                              color: "primary.main",
                              fontWeight: "bold",
                              fontSize: "1.4rem",
                            }}
                          >
                            {player?.login}
                          </Box>
                        </Box>
                        <Box
                          component="span"
                          sx={{
                            mt: 1,
                            fontSize: "1rem",
                            background:
                              "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontWeight: "bold",
                            animation: messageWait
                              ? "pulse 1.5s infinite"
                              : "none",
                          }}
                        >
                          🏅 ELO:{" "}
                          {gameScore
                            ? gameScore.find((p) => p.login === player?.login)
                                ?.elo ?? player?.elo
                            : player?.elo}
                        </Box>
                      </>
                    )}
                  </Typography>

                  {!messageWait && (
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      sx={{
                        py: 1.5,
                        background:
                          "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        textTransform: "uppercase",
                        animation: "pulse 2s infinite",
                        "&:hover": {
                          background:
                            "linear-gradient(to right, #4f46e5, #9333ea, #db2777)",
                        },
                      }}
                      onClick={handleSearchGame}
                    >
                      🔍 Rechercher une partie
                    </Button>
                  )}

                  {messageWait && (
                    <Box mt={3}>
                      <CircularProgress
                        size={64}
                        sx={{
                          color: "secondary.main",
                          mb: 3,
                          animation: "pulse 2s infinite",
                        }}
                      />
                    </Box>
                  )}
                </>
              )}

              {currentGame && !currentProblem && showCountdown && (
                <Box
                  sx={{
                    py: 6,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress
                    size={64}
                    sx={{
                      color: "secondary.main",
                      mb: 3,
                      animation: "pulse 2s infinite",
                    }}
                  />

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      color: "primary.main",
                      animation: "fadeIn 1s ease-in-out",
                      textShadow: "1px 1px 4px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    🎯 Partie trouvée ! Préparation…
                  </Typography>
                </Box>
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
                <>
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      mb: 3,
                      textAlign: "center",
                      color: "primary.main",
                      textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
                    }}
                  >
                    🎉 Match terminé !
                  </Typography>

                  {gameScore.map((p, i) => (
                    <Typography
                      key={p.login}
                      variant="h6"
                      sx={{
                        mb: 1,
                        fontWeight: i === 0 ? "bold" : "normal",
                        textAlign: "center",
                      }}
                    >
                      {i + 1}. {p.login} — 🧠 Score: {p.score} — 🏅 ELO: {p.elo}
                    </Typography>
                  ))}

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                      py: 1.5,
                      background:
                        "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      textTransform: "uppercase",
                      animation: "pulse 2s infinite",
                      "&:hover": {
                        background:
                          "linear-gradient(to right, #4f46e5, #9333ea, #db2777)",
                      },
                    }}
                    onClick={handleSearchGame}
                  >
                    🔄 Rejouer
                  </Button>

                  {messageWait && (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      gap={1}
                      mt={3}
                    >
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={{
                          mb: 2,
                          color: "white",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        🔍 Recherche en cours…
                      </Typography>
                      <CircularProgress
                        size={64}
                        sx={{
                          color: "secondary.main",
                          mb: 3,
                          animation: "pulse 2s infinite",
                        }}
                      />
                    </Box>
                  )}
                </>
              )}
            </Paper>
          </motion.div>
        </AnimatePresence>
      </Container>

      <Dialog
        open={openLeaderboard}
        onClose={() => setOpenLeaderboard(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>🏆 Classement des joueurs</DialogTitle>
        <DialogContent>
          {leaderBoard?.players?.length ? (
            <List>
              {leaderBoard.players.map((p, idx) => (
                <ListItem key={p.login} divider>
                  <ListItemText
                    primary={`${idx + 1}. ${p.login}`}
                    secondary={`ELO: ${p.elo} ${
                      p.isInGame ? "🟢 En jeu" : "⚪️ Connecté"
                    }`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>Aucun joueur dans le classement.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default App;
