// confetti.js  (drop-in replacement)
const Confetti = (() => {
  let canvas, ctx;
  let particles = [];
  let rafId = 0;
  const dpr = Math.max(1, window.devicePixelRatio || 1);

  function init() {
    canvas = document.getElementById("confetti");
    if (!canvas) return false; // page might not have the canvas

    ctx = canvas.getContext("2d");
    resize();                         // set correct size + scale for retina
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    draw();
    return true;
  }

  function resize() {
    if (!canvas || !ctx) return;
    const w = innerWidth;
    const h = innerHeight;

    // CSS size
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    // Actual pixel buffer (retina-safe)
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);

    // Draw in CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function onVisibility() {
    if (document.hidden) {
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    } else {
      if (!rafId) draw();
    }
  }

  function burst(x, y, count = 120) {
    // x,y are in CSS pixels; drawing is scaled to match
    for (let i = 0; i < count; i++) {
      particles.push({
        x, y,
        vx: (Math.random() * 2 - 1) * 6,
        vy: (Math.random() * 2 - 1) * 6 - Math.random() * 4,
        g: 0.12 + Math.random() * 0.1,
        life: 60 + Math.random() * 40,
        color: `hsl(${Math.random() * 360}, 90%, 60%)`,
        size: 2 + Math.random() * 3,
      });
    }
  }

  function draw() {
    if (!canvas || !ctx) return;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.clearRect(0, 0, w, h);

    particles.forEach(p => {
      p.life -= 1;
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;

      ctx.globalAlpha = Math.max(p.life / 100, 0);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    particles = particles.filter(p => p.life > 0);
    rafId = requestAnimationFrame(draw);
  }

  // Try now; if DOM not ready, wait for it.
  if (!init()) {
    window.addEventListener("DOMContentLoaded", init, { once: true });
  }

  return { burst, resize };
})();
