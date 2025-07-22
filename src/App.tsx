import React, { useState, useContext } from "react";
import PseudoForm from "./components/PseudoForm";
import GameBoard from "./components/GameBoard";
import { SocketProvider, GameContext } from "./contexts/GameContext";
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  CircularProgress,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import GameRouter from "./GameRouter";
import PreGameCountdown from "./components/PreGameCountDown";

const App: React.FC = () => {
  const [pseudo, setPseudo] = useState<string | null>(null);
  const { player } = useContext(GameContext);

  const onSubmit = (pseudo: string) => {
    console.log("Pseudo submitted:", pseudo);
    setPseudo(pseudo);
  };
  console.log("player in App:", player);

  return (
    <SocketProvider pseudo={pseudo}>
      {!pseudo ? <PseudoForm onSubmit={onSubmit} /> : <GameRouter />}
    </SocketProvider>
  );
};

export const GameWithSocket: React.FC<{}> = ({}) => {
  const {
    player,
    currentGame,
    currentProblem,
    gameScore,
    timer,
    setTimer,
    socket,
    messageEror,
    setShowCountdown,
    showCountdown,
    setMessageWait,
    messageWait,
    leaderBoard,
  } = useContext(GameContext);
  const [openLeaderboard, setOpenLeaderboard] = useState(false);

  const handleSearchGame = () => {
    console.log("Emitting PlayerSearchGame with UUID:", player?.uuid);
    socket?.emit("PlayerSearchGame", { uuid: player?.uuid });
    setMessageWait(true);
  };
  const handleOpenLeaderboard = () => {
    setOpenLeaderboard(true);
    socket?.emit("Leaderboard");
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <IconButton onClick={handleOpenLeaderboard} color="primary">
            <LeaderboardIcon />
          </IconButton>
        </Box>

        <Paper
          elevation={6}
          sx={{
            borderRadius: 4,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" sx={{ mb: 3 }}>
            {player?.login}
            {" ELO: "}
            {gameScore
              ? gameScore.find((p) => p.login === player?.login)?.elo ??
                player?.elo
              : player?.elo}
          </Typography>

          {!gameScore && (
            <>
              {!currentGame && (
                <Box
                  sx={{
                    bgcolor: "white",
                    borderRadius: 4,
                    p: 4,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Dégradé en coin */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -40,
                      right: -40,
                      width: 120,
                      height: 120,
                      bgcolor: "primary.main",
                      opacity: 0.2,
                      transform: "rotate(45deg)",
                    }}
                  />
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                    Prêt à jouer ?
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ mb: 4 }}
                  >
                    Clique sur le bouton pour trouver un adversaire
                  </Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearchGame}
                    fullWidth
                    size="large"
                    sx={{
                      py: 1.8,
                      fontSize: "1rem",
                      textTransform: "uppercase",
                      background: "linear-gradient(135deg, #4f46e5, #ec4899)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    🔍 Rechercher une partie
                  </Button>

                  {messageWait && (
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      mt={4}
                      sx={{
                        animation: "pulse 1.5s ease-in-out infinite",
                      }}
                    >
                      <CircularProgress size={32} thickness={4} />
                      <Typography
                        sx={{
                          mt: 2,
                          fontStyle: "italic",
                          color: "text.secondary",
                        }}
                      >
                        Recherche en cours…
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </>
          )}

          {currentGame &&
            currentProblem &&
            (showCountdown ? (
              <PreGameCountdown
                onComplete={() => {
                  setShowCountdown(false);
                }}
                timer={timer}
              />
            ) : (
              <GameBoard
                problem={currentProblem}
                timer={timer}
                setTimer={setTimer}
                messageEror={messageEror}
                currentGame={currentGame}
                gameScore={gameScore}
              />
            ))}

          {gameScore && !currentProblem && (
            <>
              <Typography variant="h4" gutterBottom>
                🎉 Match terminé !
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ mb: 3, color: "text.secondary" }}
              >
                Voici les scores :
              </Typography>
              <Typography sx={{ fontSize: "1.2rem", mb: 1 }}>
                🧑 Joueur 1 {gameScore[0].login} : score {gameScore[0].score} :
                elo {gameScore[0].elo}
              </Typography>
              <Typography sx={{ fontSize: "1.2rem", mb: 3 }}>
                🧑 Joueur 2 {gameScore[1].login} : score {gameScore[1].score} :
                elo {gameScore[1].elo}
              </Typography>
              <Button
                variant="contained"
                color="success"
                onClick={handleSearchGame}
                fullWidth
                size="large"
              >
                🔄 Rejouer
              </Button>
              {messageWait && (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap={1}
                  mt={2}
                >
                  <CircularProgress size={20} color="primary" />
                  <Typography>
                    Veuillez patienter, la recherche d'une partie est en
                    cours...
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Paper>
      </Container>
      <Dialog
        open={openLeaderboard}
        onClose={() => setOpenLeaderboard(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>🏆 Classement des joueurs</DialogTitle>
        <DialogContent>
          {leaderBoard?.players?.length ? (
            <List>
              {leaderBoard.players.map((player, index) => (
                <ListItem key={player.login}>
                  <ListItemText
                    primary={`${index + 1}. ${player.login}`}
                    secondary={`ELO : ${player.elo} ${
                      player.isInGame ? "🟢 En jeu" : "⚪️ Connecté"
                    }`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>Aucun joueur trouvé dans le classement.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default App;
