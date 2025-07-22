import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onComplete: () => void;
  timer: Date | null;
}

const PreGameCountdown: React.FC<Props> = ({ onComplete, timer }) => {
  const [count, setCount] = useState<number | null>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!timer) return;

    const updateCountdown = () => {
      const now = new Date();
      const sixtySecondsBeforeTimer = new Date(timer.getTime() - 60 * 1000);
      const diffMs = sixtySecondsBeforeTimer.getTime() - now.getTime();
      const secondsRemaining = Math.max(0, Math.ceil(diffMs / 1000));
      setCount(secondsRemaining);
      setKey((k) => k + 1);

      if (secondsRemaining <= 0) {
        onComplete();
      }
    };

    // Update immediately
    updateCountdown();

    // Then every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [timer, onComplete]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height={200}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h2"
            fontWeight="bold"
            color="primary"
            sx={{ textShadow: "1px 1px 4px rgba(0,0,0,0.4)" }}
          >
            {count !== null ? count : ""}
          </Typography>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default PreGameCountdown;
