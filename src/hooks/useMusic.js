import { useState, useEffect } from "react";

const useMusic = (audioFiles) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioKey, setCurrentAudioKey] = useState(null);
  const [audioInstances, setAudioInstances] = useState(new Map());
  const [audioContext, setAudioContext] = useState(null);
  const [gainNode, setGainNode] = useState(null);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const gain = context.createGain();
    gain.gain.setValueAtTime(1, context.currentTime);
    setAudioContext(context);
    setGainNode(gain);

    const resumeAudioContext = () => {
      if (context.state === "suspended") {
        context.resume();
      }
      setUserInteracted(true);
    };

    document.addEventListener("click", resumeAudioContext);
    document.addEventListener("keydown", resumeAudioContext);

    return () => {
      document.removeEventListener("click", resumeAudioContext);
      document.removeEventListener("keydown", resumeAudioContext);
    };
  }, []);

  useEffect(() => {
    if (!audioFiles || !audioContext || !gainNode) return;

    const instances = new Map();
    audioFiles.forEach((audioFile, key) => {
      const audio = new Audio(audioFile);
      audio.preload = "auto";
      const source = audioContext.createMediaElementSource(audio);
      source.connect(gainNode).connect(audioContext.destination);
      instances.set(key, audio);
    });
    setAudioInstances(instances);
  }, [audioFiles, audioContext, gainNode]);

  const fadeOut = (audio, duration = 1.5) => {
    if (gainNode) {
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + duration,
      );
      setTimeout(() => {
        audio.pause();
        gainNode.gain.setValueAtTime(1, audioContext.currentTime);
      }, duration * 1000);
    }
  };

  const fadeIn = (audio, duration = 1.5) => {
    if (gainNode) {
      gainNode.gain.setValueAtTime(0.01, audioContext.currentTime);
      audio.play();
      gainNode.gain.exponentialRampToValueAtTime(
        1,
        audioContext.currentTime + duration,
      );
    }
  };

  const playAudio = (key) => {
    if (!audioContext) {
      console.error("AudioContext is not initialized");
      return;
    }

    if (!userInteracted) {
      console.warn("User has not interacted with the document yet.");
      return;
    }

    if (currentAudioKey !== key) {
      if (currentAudioKey && audioInstances.has(currentAudioKey)) {
        const currentAudio = audioInstances.get(currentAudioKey);
        fadeOut(currentAudio, 1.5);
      }

      if (audioInstances.has(key)) {
        const newAudio = audioInstances.get(key);
        setTimeout(() => fadeIn(newAudio, 1.5), 500);
      }

      setCurrentAudioKey(key);
      setIsPlaying(true);
    } else if (currentAudioKey === key && !isPlaying) {
      const currentAudio = audioInstances.get(key);
      fadeIn(currentAudio, 1.5);
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (currentAudioKey && audioInstances.has(currentAudioKey)) {
      const currentAudio = audioInstances.get(currentAudioKey);
      fadeOut(currentAudio, 1.5);
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else if (currentAudioKey && audioInstances.has(currentAudioKey)) {
      const currentAudio = audioInstances.get(currentAudioKey);
      fadeIn(currentAudio, 1.5);
      setIsPlaying(true);
    }
  };

  const resumeAudioContext = () => {
    if (audioContext && audioContext.state === "suspended") {
      audioContext.resume();
      setUserInteracted(true);
    }
  };

  return {
    isPlaying,
    playAudio,
    pauseAudio,
    togglePlayPause,
    resumeAudioContext,
  };
};

export default useMusic;
