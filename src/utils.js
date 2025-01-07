import { Route } from "react-router-dom";

export const getRoutes = (allRoutes) =>
  allRoutes.map((route) => {
    if (route.collapse) {
      return getRoutes(route.collapse);
    }

    if (route.route) {
      return (
        <Route
          exact
          path={route.route}
          element={route.component}
          key={route.key}
        />
      );
    }

    return null;
  });

export const handleMusicOnScroll = (stanzaRefs, data, setHeaderValue, playAudio) => {
  let currentPlaying = null;
  const scrollPosition = window.scrollY + window.innerHeight / 2;
  for (let i = 0; i < stanzaRefs.current.length; i++) {
    const card = stanzaRefs.current[i];
    if (
      card &&
      card.offsetTop <= scrollPosition &&
      card.offsetTop + card.offsetHeight > scrollPosition
    ) {
      setHeaderValue({ numeral: data[i].numeral, text: data[i].title });
      if (currentPlaying !== data[i].numeral) {
        console.log(`Switching to music: ${data[i].music}`);
        playAudio(data[i].numeral);
        currentPlaying = data[i].numeral;
        break;
      } else if (currentPlaying === data[i].numeral) {
        break;
      }
    }
  }
};

export const setBackground = (darkMode) => {
  const generateRandomColor = (lightness) => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return adjustColorLightness(color, lightness);
  };

  const adjustColorLightness = (color, lightness) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const newR = Math.min(255, Math.max(0, r + lightness));
    const newG = Math.min(255, Math.max(0, g + lightness));
    const newB = Math.min(255, Math.max(0, b + lightness));
    return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
  };

  const lightness = darkMode ? -80 : 80;
  const colors = Array.from({ length: 5 }, () =>
    generateRandomColor(lightness),
  );
  document.body.style.background = `linear-gradient(135deg, ${colors.join(", ")})`;
  document.body.style.backgroundSize = "400% 400%";
  document.body.style.animation = "gradientAnimation 15s ease infinite";
  document.body.style.opacity = "1"; // Set the opacity to make the colors less harsh
};

export const calculateThresholds = (stanzaRefs, setThresholds) => {
  const newThresholds = stanzaRefs.current.map((ref) => ref.offsetTop + ref.offsetHeight);
  console.log("Calculated thresholds:", newThresholds);
  setThresholds(newThresholds);
};

export const updateParticles = (canvasRef) => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  const particles = [];

  const createParticles = () => {
    for (let i = 0; i < 50; i++) {
      // Reduce the number of particles
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        maxRadius: Math.random() * 20 + 10,
        speed: Math.random() * 0.5 + 0.5,
        alpha: 1,
      });
    }
  };

  const updateParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle) => {
      particle.radius += particle.speed;
      particle.alpha -= 0.01;

      if (particle.alpha <= 0) {
        particle.x = Math.random() * canvas.width;
        particle.y = Math.random() * canvas.height;
        particle.radius = Math.random() * 2 + 1;
        particle.maxRadius = Math.random() * 20 + 10;
        particle.speed = Math.random() * 0.5 + 0.5;
        particle.alpha = 1;
      }

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(updateParticles);
  };

  createParticles();
  updateParticles();

  const handleResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  window.addEventListener("resize", handleResize);
  handleResize();

  return () => {
    window.removeEventListener("resize", handleResize);
  };
};
