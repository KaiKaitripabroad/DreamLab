/* js/wave.js — 2D canvas wave background for event section */

(function () {
  const canvas = document.getElementById('waveCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const waves = [
    { amp: 28, freq: 0.012, speed: 0.018, phase: 0,    color: 'rgba(0, 150, 210, 0.25)' },
    { amp: 20, freq: 0.018, speed: 0.025, phase: 2.1,  color: 'rgba(0, 201, 255, 0.18)' },
    { amp: 14, freq: 0.025, speed: 0.032, phase: 4.3,  color: 'rgba(26, 95, 163, 0.3)'  },
  ];

  let t = 0;

  function draw() {
    requestAnimationFrame(draw);
    t += 1;
    ctx.clearRect(0, 0, W, H);

    waves.forEach((w) => {
      ctx.beginPath();
      ctx.moveTo(0, H);

      for (let x = 0; x <= W; x += 3) {
        const y = H * 0.55
          + Math.sin(x * w.freq + t * w.speed + w.phase) * w.amp
          + Math.sin(x * w.freq * 1.7 + t * w.speed * 0.6) * (w.amp * 0.4);
        ctx.lineTo(x, y);
      }

      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fillStyle = w.color;
      ctx.fill();
    });
  }

  draw();
})();
