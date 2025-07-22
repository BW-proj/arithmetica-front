import React, { useContext } from "react";
import { GameContext } from "./contexts/GameContext";
import { Box, CircularProgress, Typography } from "@mui/material";
import { GameWithSocket } from "./App";

const GameRouter: React.FC = () => {
  const { player } = useContext(GameContext);

  if (!player) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Connexion...</Typography>
      </Box>
    );
  }

  return <GameWithSocket />;
};

export default GameRouter;
