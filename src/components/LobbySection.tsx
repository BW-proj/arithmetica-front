import React from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import type { GameScore } from "../types";

interface LobbySectionProps {
  messageWait: boolean;
  playerLogin: string;
  playerElo: number;
  gameScore?: GameScore[] | null;
  onSearchGame: () => void;
}

const LobbySection: React.FC<LobbySectionProps> = ({
  messageWait,
  playerLogin,
  playerElo,
  gameScore,
  onSearchGame,
}) => {
  return (
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
                {playerLogin}
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
                animation: messageWait ? "pulse 1.5s infinite" : "none",
              }}
            >
              🏅 ELO:{" "}
              {gameScore
                ? gameScore.find((p) => p.login === playerLogin)?.elo ??
                  playerElo
                : playerElo}
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
            background: "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            textTransform: "uppercase",
            animation: "pulse 2s infinite",
            "&:hover": {
              background:
                "linear-gradient(to right, #4f46e5, #9333ea, #db2777)",
            },
          }}
          onClick={onSearchGame}
        >
          🔍 Rechercher une partie
        </Button>
      )}

      {messageWait && (
        <Box mt={3} textAlign="center">
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
  );
};

export default LobbySection;
