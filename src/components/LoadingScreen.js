import React, { useState, useEffect } from "react";
import { Button, Typography, Box, LinearProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { data } from "../data";

const LoadingScreen = ({ onContinue, playAudio }) => {
  const theme = useTheme();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 3000); // Show button after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    playAudio(data[0].numeral);
    onContinue();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        zIndex: 9999,
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
        Loading
      </Typography>
      <LinearProgress
        color="primary"
        sx={{ width: "80%", mb: 2, marginX: 20, marginY: 5 }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showButton ? 1 : 0 }}
        transition={{ duration: 1 }}
        style={{ mt: 2 }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleContinue}
          sx={{ mt: 2 }}
        >
          Continue
        </Button>
      </motion.div>
    </Box>
  );
};

export default LoadingScreen;
