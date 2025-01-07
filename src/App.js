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
import { motion, AnimatePresence } from "framer-motion";

import routes from "./routes";
import Header from "./components/Header";
import Footer from "./components/Footer";
import StanzaCard from "./components/StanzaCard";
import useMusic from "./hooks/useMusic";
import useAudioAnalysis from "./hooks/useAudioAnalysis";
import {
  getRoutes,
  handleScroll,
  setBackground,
  calculateThresholds,
  updateParticles,
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

  const optimizedHandleScroll = useCallback(() => {
    handleScroll(stanzaRefs, data, setHeaderValue, playAudio);
  }, [playAudio]);

  useEffect(() => {
    window.addEventListener("scroll", optimizedHandleScroll);
    return () => {
      window.removeEventListener("scroll", optimizedHandleScroll);
    };
  }, [optimizedHandleScroll]);

  useEffect(() => {
    setBackground(darkMode);
  }, [darkMode]);

  useEffect(() => {
    calculateThresholds(stanzaRefs, setThresholds);
    const handleResize = () => calculateThresholds(stanzaRefs, setThresholds);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.background = `linear-gradient(135deg, rgba(${backgroundColor[0]}, ${backgroundColor[1]}, ${backgroundColor[2]}, 0.5), rgba(${backgroundColor[0]}, ${backgroundColor[1]}, ${backgroundColor[2]}, 0.8))`;
  }, [backgroundColor]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {loading && (
        <LoadingScreen onContinue={handleContinue} playAudio={playAudio} />
      )}
      {!loading && (
        <>
          <Header
            value={headerValue}
            darkMode={darkMode}
            onThemeChange={handleThemeChange}
          />
          <Container sx={{ marginTop: -5, marginBottom: 40 }}>
              {data.map((card, index) => (
                <StanzaCard
                  key={index}
                  title={card.title}
                  threshold={thresholds[index] || 0}
                  ref={(el) => (stanzaRefs.current[index] = el)}
                  trackUrl={card.url}
                  onColorChange={setBackgroundColor}
                  lines={card.lines}
                ></StanzaCard>
              ))}
          </Container>
          <Footer values={footerValues} />
          <Router>
            <Routes>
              {getRoutes(routes)}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </>
      )}
    </ThemeProvider>
  );
}