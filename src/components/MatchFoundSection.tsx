import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

type MatchFoundSectionProps = {
  loadingText?: string;
};

const MatchFoundSection: React.FC<MatchFoundSectionProps> = ({
  loadingText = "🎯 Partie trouvée ! Préparation…",
}) => (
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
      {loadingText}
    </Typography>
  </Box>
);

export default MatchFoundSection;
