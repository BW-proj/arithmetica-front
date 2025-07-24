import React from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import type { GameScore } from "../types";

interface MatchEndSectionProps {
  gameScore: GameScore[];
  messageWait: boolean;
  onReplay: () => void;
}

const MatchEndSection: React.FC<MatchEndSectionProps> = ({
  gameScore,
  messageWait,
  onReplay,
}) => (
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
        background: "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        textTransform: "uppercase",
        animation: "pulse 2s infinite",
        "&:hover": {
          background: "linear-gradient(to right, #4f46e5, #9333ea, #db2777)",
        },
      }}
      onClick={onReplay}
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
);

export default MatchEndSection;
