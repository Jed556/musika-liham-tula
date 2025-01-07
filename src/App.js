import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import { motion, AnimatePresence } from "framer-motion";

import routes from "./routes";
import Header from "./components/Header";
import Footer from "./components/Footer";
import StanzaCard from "./components/StanzaCard";
import useMusic from "./hooks/useMusic";
import useAudioAnalysis from "./hooks/useAudioAnalysis";
import {
  getRoutes,
  handleMusicOnScroll,
  setBackground,
  calculateThresholds,
  updateParticles,
  createBokehEffect,
} from "./utils";
import { data, footerValues } from "./data";
import LoadingScreen from "./components/LoadingScreen";
import "./fonts.css";
import "./background.css";

export default function App() {
  const stanzaRefs = useRef([]);
  const canvasRef = useRef(null);
  const [darkMode, setDarkMode] = useState(false);
  const [headerValue, setHeaderValue] = useState({
    numeral: "I",
    text: "Home",
  });
  const [thresholds, setThresholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState([255, 255, 255]);
  const [backgroundStanza, setBackgroundStanza] = useState(data[0].numeral);

  const audioFiles = useMemo(() => {
    const files = new Map();
    data.forEach((item) => {
      files.set(item.numeral, item.music);
    });
    return files;
  }, []);

  const { playAudio, resumeAudioContext } = useMusic(audioFiles);
  const { averageVolume } = useAudioAnalysis();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
        transitions: {
          duration: {
            standard: 500,
          },
        },
      }),
    [darkMode],
  );

  const handleThemeChange = useCallback(() => {
    setDarkMode((prevMode) => !prevMode);
  }, []);

  const handleContinue = useCallback(() => {
    setLoading(false);
    resumeAudioContext();
    playAudio(data[0].numeral);
  }, [playAudio, resumeAudioContext]);

  useEffect(() => {
    const handleScroll = () => {
      handleMusicOnScroll(stanzaRefs, data, setHeaderValue, playAudio);
      const currentStanza = data.find((item, index) => {
        const card = stanzaRefs.current[index];
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        return card && card.offsetTop <= scrollPosition && card.offsetTop + card.offsetHeight > scrollPosition;
      });
      if (currentStanza) {
        setBackgroundStanza(currentStanza.numeral);
      }
      //console.log("Scroll position:", window.scrollY);
    };

    const handleResize = () => calculateThresholds(stanzaRefs, setThresholds);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Initial calculation of thresholds
    calculateThresholds(stanzaRefs, setThresholds);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [playAudio]);

  useEffect(() => {
    setBackground(darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.body.style.background = `linear-gradient(135deg, rgba(${backgroundColor[0]}, ${backgroundColor[1]}, ${backgroundColor[2]}, 0.5), rgba(${backgroundColor[0]}, ${backgroundColor[1]}, ${backgroundColor[2]}, 0.8))`;
  }, [backgroundColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createBokehEffect(canvas);

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createBokehEffect(canvas); // Recreate bokeh effect on resize
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {loading && (
        <LoadingScreen onContinue={handleContinue} playAudio={playAudio} />
      )}
      {!loading && (
        <>
          <canvas
            ref={canvasRef}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: -1,
            }}
          />
          <AnimatePresence>
            <motion.div
              key={backgroundStanza}
              initial={{ opacity: 0, bottom: -50 }}
              animate={{ opacity: 0.25, bottom: 0 }}
              exit={{ opacity: 0, bottom: 50 }}
              transition={{ duration: 1 }}
              style={{
                position: "fixed",
                left: 0,
                fontSize: "20vw",
                fontFamily: "Archivo Black",
                color: "white",
                zIndex: -1,
                pointerEvents: "none",
              }}
            >
              {backgroundStanza}
            </motion.div>
          </AnimatePresence>
          <Header
            value={headerValue}
            darkMode={darkMode}
            onThemeChange={handleThemeChange}
          />
          <Container sx={{ marginTop: 2, marginBottom: 34 }}>
            <Grid container spacing={2}>
              {data.map((card, index) => (
                <Grid item xs={12} sm={6} md={4}>
                  <StanzaCard
                    key={index}
                    title={card.title}
                    threshold={thresholds[index] || 0}
                    ref={(el) => (stanzaRefs.current[index] = el)}
                    trackUrl={card.url}
                    onColorChange={setBackgroundColor}
                    lines={card.lines}
                  ></StanzaCard>
                </Grid>
              ))}
            </Grid>
          </Container>
          <Footer values={footerValues} />
          <Router>
            <Routes>
              {getRoutes(routes)}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </>
      )
      }
    </ThemeProvider >
  );
}
