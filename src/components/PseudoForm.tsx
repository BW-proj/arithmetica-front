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
          elevation={8}
          sx={{
            borderRadius: 6,
            p: 5,
            textAlign: "center",
            backgroundColor: "#1e1e2f",
            color: "white",
            boxShadow: "0px 8px 30px rgba(0,0,0,0.4)",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(to right, #a855f7, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            🎮 Bienvenue dans Calcul Clash
          </Typography>

          <Typography variant="subtitle1" sx={{ mb: 4, color: "#b3b3b3" }}>
            Entrez votre pseudo pour commencer
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              label="Votre pseudo"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              sx={{
                mb: 3,
                input: { color: "white" },
                label: { color: "#ccc" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#6366f1" },
                  "&:hover fieldset": { borderColor: "#a855f7" },
                  "&.Mui-focused fieldset": { borderColor: "#ec4899" },
                },
              }}
              InputLabelProps={{ style: { color: "#bbb" } }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                background:
                  "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
                fontWeight: "bold",
                fontSize: "1rem",
                animation: "pulse 2s infinite",
                color: "white",
                "&:hover": {
                  background:
                    "linear-gradient(to right, #4f46e5, #9333ea, #db2777)",
                },
              }}
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
