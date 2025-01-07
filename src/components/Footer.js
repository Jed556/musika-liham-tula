import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import { motion } from "framer-motion";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import useMusic from "../hooks/useMusic";

export default function Footer({ values }) {
  const { isPlaying, togglePlayPause } = useMusic();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ position: "fixed", bottom: 0, width: "100%", zIndex: 1300 }} // Set a high z-index
    >
      <Box
        sx={{
          p: 2,
          textAlign: "center",
          borderTop: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={12} sm="auto" textAlign="center">
            <Typography variant="body2" color="textSecondary">
              Isinumite kay
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontWeight: "bold" }}
            >
              {values.submitTo}
            </Typography>
          </Grid>
          <Grid item xs={12} sm="auto" textAlign="center">
            {/* <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                backgroundColor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <PauseIcon sx={{ color: "primary.contrastText" }} />
              ) : (
                <PlayArrowIcon sx={{ color: "primary.contrastText" }} />
              )}
            </Box> */}
          </Grid>
          <Grid item xs={12} sm="auto" textAlign="right">
            <Typography variant="body2" color="textSecondary">
              Made with{" "}
              <FavoriteIcon
                fontSize="inherit"
                sx={{ fontSize: "1rem", verticalAlign: "top" }}
              />{" "}
              by
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontWeight: "bold" }}
            >
              {values.madeBy}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
}
