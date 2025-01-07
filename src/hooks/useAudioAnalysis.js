import { useState, useEffect } from "react";

const useAudioAnalysis = (audioContext, gainNode) => {
  const [analyserNode, setAnalyserNode] = useState(null);
  const [averageVolume, setAverageVolume] = useState(0);

  useEffect(() => {
    if (!audioContext || !gainNode) return;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    gainNode.connect(analyser);
    setAnalyserNode(analyser);

    const updateAverageVolume = () => {
      analyser.getByteFrequencyData(dataArray);
      const sum = dataArray.reduce((a, b) => a + b, 0);
      const average = sum / bufferLength;
      setAverageVolume(average);
      requestAnimationFrame(updateAverageVolume);
    };

    updateAverageVolume();

    return () => {
      gainNode.disconnect(analyser);
    };
  }, [audioContext, gainNode]);

  return { analyserNode, averageVolume };
};

export default useAudioAnalysis;
