/* js/hero3d.js — Three.js ocean particles for hero section */

(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.set(0, 0, 5);

  // Resize
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // ——— Wave mesh (ocean surface) ———
  const waveGeo = new THREE.PlaneGeometry(20, 20, 80, 80);
  const waveMat = new THREE.MeshBasicMaterial({
    color: 0x0a2a50,
    wireframe: true,
    transparent: true,
    opacity: 0.18,
  });
  const waveMesh = new THREE.Mesh(waveGeo, waveMat);
  waveMesh.rotation.x = -Math.PI / 3;
  waveMesh.position.y = -2;
  scene.add(waveMesh);

  // ——— Particles ———
  const COUNT = 1800;
  const positions = new Float32Array(COUNT * 3);
  const speeds    = new Float32Array(COUNT);
  const phases    = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 18;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    speeds[i]  = 0.2 + Math.random() * 0.5;
    phases[i]  = Math.random() * Math.PI * 2;
  }

  const ptGeo = new THREE.BufferGeometry();
  ptGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const ptMat = new THREE.PointsMaterial({
    color: 0x00c9ff,
    size: 0.04,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(ptGeo, ptMat);
  scene.add(points);

  // ——— Floating fish dots (warmer color) ———
  const fishCount = 80;
  const fishPos   = new Float32Array(fishCount * 3);
  for (let i = 0; i < fishCount; i++) {
    fishPos[i * 3]     = (Math.random() - 0.5) * 14;
    fishPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
    fishPos[i * 3 + 2] = (Math.random() - 0.5) * 4;
  }
  const fishGeo = new THREE.BufferGeometry();
  fishGeo.setAttribute('position', new THREE.BufferAttribute(fishPos, 3));
  const fishMat = new THREE.PointsMaterial({
    color: 0xff8c42,
    size: 0.1,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
  });
  const fishPoints = new THREE.Points(fishGeo, fishMat);
  scene.add(fishPoints);

  // ——— Mouse parallax ———
  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ——— Animation loop ———
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.008;

    // Wave vertices
    const posAttr = waveGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      posAttr.setZ(i,
        Math.sin(x * 0.5 + t) * 0.3 +
        Math.sin(y * 0.4 + t * 1.3) * 0.2
      );
    }
    posAttr.needsUpdate = true;
    waveGeo.computeVertexNormals();

    // Particle drift
    const pa = ptGeo.attributes.position;
    for (let i = 0; i < COUNT; i++) {
      let y = pa.getY(i);
      y += speeds[i] * 0.003;
      if (y > 6) y = -6;
      pa.setY(i, y);
      pa.setX(i, pa.getX(i) + Math.sin(t * speeds[i] + phases[i]) * 0.002);
    }
    pa.needsUpdate = true;

    // Fish drift
    const fa = fishGeo.attributes.position;
    for (let i = 0; i < fishCount; i++) {
      let x = fa.getX(i);
      x += 0.008 * (0.5 + (i % 3) * 0.3);
      if (x > 8) x = -8;
      fa.setX(i, x);
      fa.setY(i, fa.getY(i) + Math.sin(t * 0.6 + i) * 0.003);
    }
    fa.needsUpdate = true;

    // Camera parallax
    camera.position.x += (mx * 0.4 - camera.position.x) * 0.04;
    camera.position.y += (-my * 0.25 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();
})();
