import React, { useState, useEffect, forwardRef } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import { motion, AnimatePresence } from "framer-motion";
import Box from "@mui/material/Box";
import { useTheme, alpha } from "@mui/material/styles";
import { getTrackInfo } from "../utils/spotify";
import ColorThief from "colorthief";

const StanzaCard = forwardRef(
  (
    {
      key,
      title,
      align = "center",
      threshold,
      children,
      trackUrl,
      onColorChange,
      lines,
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const [scrolledPast, setScrolledPast] = useState(false);
    const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [transform, setTransform] = useState("");
    const [trackInfo, setTrackInfo] = useState(null);
    const [bubbleVisible, setBubbleVisible] = useState(false);
    const [bubblePosition, setBubblePosition] = useState({ x: 0, y: 0 });
    const theme = useTheme();

    const yMove = 50;
    const tiltMultiplier = 20;

    useEffect(() => {
      const handleScroll = () => {
        const scrollPosition = window.scrollY + window.innerHeight;
        if (scrollPosition > threshold && scrollPosition < threshold + 500) {
          setIsVisible(true);
        } else if (scrollPosition < threshold) {
          setIsVisible(false);
          setScrolledPast(false);
        } else {
          setIsVisible(false);
          setScrolledPast(true);
        }
      };

      handleScroll(); // Check visibility on initial load
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, [threshold]);

    useEffect(() => {
      const fetchTrackInfo = async () => {
        try {
          const info = await getTrackInfo(trackUrl);
          setTrackInfo(info);
        } catch (error) {
          console.error("Error fetching track info:", error);
        }
      };

      fetchTrackInfo();
    }, [trackUrl]);

    useEffect(() => {
      if (trackInfo) {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = trackInfo.album.images[0].url;
        img.onload = () => {
          const colorThief = new ColorThief();
          const dominantColor = colorThief.getColor(img);
          onColorChange(dominantColor);
        };
      }
    }, [trackInfo, onColorChange]);

    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top - yMove * 4;
      setGradientPosition({ x, y });
      setIsHovering(true);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = centerX - x;
      const deltaY = y - centerY;
      const rotateX = (deltaY / centerY) * tiltMultiplier; // Adjust the multiplier for more or less tilt
      const rotateY = (deltaX / centerX) * tiltMultiplier; // Adjust the multiplier for more or less tilt
      setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setTransform("");
    };

    const handleAuthorMouseEnter = () => {
      setBubbleVisible(true);
    };

    const handleAuthorMouseLeave = () => {
      setBubbleVisible(false);
    };

    const handleAuthorMouseMove = (e) => {
      setBubblePosition({ x: e.clientX, y: e.clientY });
    };

    return (
      <AnimatePresence>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <motion.div
            ref={ref}
            initial={{
              opacity: 0,
              //y: scrolledPast ? -yMove : yMove
              scale: 0.5, // Add scale property here
            }}
            animate={{
              // y: isVisible ? 0 : scrolledPast ? -yMove : yMove,
              opacity: 1,
              scale: isVisible ? 1 : 0.5, // Add scale property here
            }}
            exit={{
              opacity: 0,
              // y: scrolledPast ? -yMove : yMove,
              scale: 0.5, // Add scale property here
            }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            style={{
              width: "90vw",
              height: "60vh",
              position: "relative",
              borderRadius: 10,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <Card
              sx={{
                minWidth: 400,
                marginY: 12,
                padding: 5,
                width: "100%",
                height: "100%",
                borderRadius: 10,
                position: "relative",
                zIndex: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.5), // Adjust opacity here
                backdropFilter: "blur(10px)",
                "& .MuiTypography-root": {
                  fontSize: {
                    xs: "1rem", // small screens
                    sm: "1.5rem", // medium screens
                    md: "2rem", // large screens
                    lg: "2.5rem", // extra large screens
                  },
                },
                transform: transform,
                transition: "transform 0.1s ease-out",
                boxShadow: isHovering
                  ? "0px 8px 12px rgba(0, 0, 0, 0.2)"
                  : "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}
              height="auto"
            >
              <CardContent sx={{ position: "relative", zIndex: 3 }}>
                <Grid container spacing={2} direction="row">
                  <Grid item textAlign="center" size={4}>
                    {trackInfo && (
                      <Grid
                        container
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        size="grow"
                        direction="column"
                      >
                        <Grid textAlign="center" size={12}>
                          <motion.div
                            whileHover={{
                              scale: 1.1,
                              rotateX: 10,
                              rotateY: 10,
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                            style={{
                              width: "100%",
                              height: "100%",
                              marginBottom: 1,
                              perspective: 1000,
                            }}
                          >
                            <Box
                              component="img"
                              src={trackInfo.album.images[0].url}
                              alt={trackInfo.name}
                              sx={{
                                width: "90%",
                                height: "90%",
                                borderRadius: 3,
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                              }}
                            />
                          </motion.div>
                        </Grid>
                        <Grid item textAlign="center" size={12}>
                          <Typography variant="h6" component="div">
                            {trackInfo.name}
                          </Typography>
                        </Grid>
                        <Grid item textAlign="center" size={12}>
                          <Typography
                            component="a"
                            href={trackInfo.artists[0].external_urls.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            onMouseEnter={handleAuthorMouseEnter}
                            onMouseLeave={handleAuthorMouseLeave}
                            onMouseMove={handleAuthorMouseMove}
                            sx={{
                              textDecoration: "none",
                              color: "inherit",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                          >
                            {trackInfo.artists[0].name}
                          </Typography>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                  <Grid
                    container
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    size="grow"
                    textAlign={align}
                    direction="column"
                  >
                    {lines.map((line, lineIndex) => (
                      <Grid item key={lineIndex}>
                        <motion.div
                          key={lineIndex}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: lineIndex * 0.2 }}
                          exit={{ opacity: 0, y: 20 }}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              fontSize: "2rem",
                              fontFamily: "Lineto Circular Black, sans-serif",
                            }}
                            fontSize={10}
                          >
                            {line}
                          </Typography>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </CardContent>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isHovering ? 1 : 0,
                  background: `radial-gradient(circle at ${gradientPosition.x}px ${gradientPosition.y}px, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0))`,
                }}
                transition={{ duration: 0.3 }}
                style={{
                  pointerEvents: "none",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 1,
                }}
              />
            </Card>
          </motion.div>
          <AnimatePresence>
            <Box>
              {bubbleVisible && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0,
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                  }}
                  style={{
                    position: "fixed",
                    top: bubblePosition.y,
                    left: bubblePosition.x,
                    transform: "translate(-50%, -100%)",
                    backgroundColor: "#1DB954",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    pointerEvents: "none",
                    zIndex: 3,
                    whiteSpace: "nowrap",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.3,
                      type: "spring",
                      stiffness: 300,
                      damping: 40,
                    }}
                  >
                    <Typography variant="body2">OPEN SPOTIFY</Typography>
                  </motion.div>
                </motion.div>
              )}
            </Box>
          </AnimatePresence>
        </Box>
      </AnimatePresence>
    );
  },
);

export default StanzaCard;
