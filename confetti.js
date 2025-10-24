const Confetti = (() => {
  const canvas = document.getElementById("confetti");
  if (!canvas) return {}; // skip if page doesn't have a canvas

  const ctx = canvas.getContext("2d");
  let particles = [];

  function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function burst(x, y, count = 120) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x, y,
        vx: (Math.random() * 2 - 1) * 6,
        vy: (Math.random() * 2 - 1) * 6 - Math.random() * 4,
        g: 0.12 + Math.random() * 0.1,
        life: 60 + Math.random() * 40,
        color: `hsl(${Math.random() * 360},90%,60%)`,
        size: 2 + Math.random() * 3,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    requestAnimationFrame(draw);
  }
  draw();

  return { burst };
})();
