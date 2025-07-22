import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

interface Props {
  onSubmit: (pseudo: string) => void;
}

const PseudoForm: React.FC<Props> = ({ onSubmit }) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSubmit(value.trim());
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
        <Paper
          elevation={6}
          sx={{
            borderRadius: 4,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            🎮 Bienvenue dans Calcul Clash
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ mb: 3, color: "text.secondary" }}
          >
            Entrez votre pseudo pour commencer
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              label="Votre pseudo"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ backgroundColor: "#6366f1" }}
            >
              🎯 Jouer maintenant
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default PseudoForm;
