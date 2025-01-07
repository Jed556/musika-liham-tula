import React, { useState, useEffect } from "react";
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { alpha, useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid2";
import { motion, AnimatePresence } from "framer-motion";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export default function Header({ value, darkMode, onThemeChange }) {
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50); // Adjust the scroll threshold as needed
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: theme.zIndex.appBar,
        flexGrow: 1,
      }}
    >
      <motion.div
        initial={{
          top: 0,
          paddingTop: 12,
          width: "100vw",
          borderRadius: 0,
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0)",
          backdropFilter: "none",
          backgroundColor: alpha(theme.palette.background.paper, 0),
        }}
        animate={{
          top: scrolled ? 12 : 0,
          paddingTop: scrolled ? 0 : 12,
          width: scrolled ? "90vw" : "100vw",
          borderRadius: scrolled ? 10 : 0,
          boxShadow: scrolled
            ? "0px 4px 6px rgba(0, 0, 0, 0.1)"
            : "0px 4px 6px rgba(0, 0, 0, 0)",
          backdropFilter: scrolled ? "blur(15px)" : "none",
          backgroundColor: scrolled
            ? alpha(theme.palette.background.paper, 0.5)
            : alpha(theme.palette.background.paper, 1),
        }}
        transition={{
          duration: 0.5,
          type: "spring",
          stiffness: 300,
          damping: scrolled ? 10 : 40,
        }}
        style={{ position: "relative" }}
      >
        <Grid container spacing={0} alignItems="center" columns={16}>
          <Grid item size="auto">
            <Box
              sx={{
                height: "30px",
                width: "30px",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 1,
                marginX: 3,
                marginY: 2,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={value.numeral}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography variant="h6">{value.numeral}</Typography>
                </motion.div>
              </AnimatePresence>
            </Box>
          </Grid>
          <Grid item size="grow">
            <AnimatePresence mode="wait">
              <motion.div
                key={value.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontFamily: "Lineto Circular Black, sans-serif" }}
                >
                  {value.text}
                </Typography>
              </motion.div>
            </AnimatePresence>
          </Grid>
          <Grid item size="auto">
            <Box
              sx={{
                marginX: 3,
                marginY: 2,
              }}
            >
              <IconButton onClick={onThemeChange} color="inherit">
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
}
