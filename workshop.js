'use strict';
(() => {
  const scene = document.querySelector('.pixel-hero');
  const particles = document.getElementById('pixel-particles');
  for (let index = 0; index < 26; index++) {
    const pixel = document.createElement('i');
    pixel.style.left = 35 + ((index * 29) % 63) + '%';
    pixel.style.top = 30 + ((index * 17) % 60) + '%';
    pixel.style.setProperty('--duration', 8 + (index % 9) + 's');
    pixel.style.setProperty('--delay', -(index % 13) + 's');
    particles.append(pixel);
  }
  const lightButton = document.getElementById('ambient-toggle');
  lightButton.addEventListener('click', () => {
    const dimmed = document.body.classList.toggle('lights-dimmed');
    lightButton.setAttribute('aria-pressed', String(dimmed));
    lightButton.innerHTML =
      '<span>☼</span> ' + (dimmed ? 'Brighten workshop lights' : 'Dim workshop lights');
  });
  function renderParallax() {
    parallaxFrame = 0;
    if (
      document.documentElement.classList.contains('no-motion') ||
      matchMedia('(prefers-reduced-motion: reduce)').matches ||
      innerWidth < 801
    ) {
      scene.style.setProperty('--scene-x', '0px');
      scene.style.setProperty('--scene-y', '0px');
      return;
    }
    scene.style.setProperty('--scene-x', pointerX + 'px');
    scene.style.setProperty('--scene-y', pointerY + 'px');
  }
  scene.addEventListener(
    'pointermove',
    (event) => {
      const box = scene.getBoundingClientRect();
      pointerX = (event.clientX / innerWidth - 0.5) * -9;
      pointerY = ((event.clientY - box.top) / box.height - 0.5) * -7;
      if (!parallaxFrame) parallaxFrame = requestAnimationFrame(renderParallax);
    },
    { passive: true }
  );
  scene.addEventListener('pointerleave', () => {
    pointerX = pointerY = 0;
    renderParallax();
  });
  document.getElementById('motion-toggle').addEventListener('click', renderParallax);
  const messages = [
    'Ready when you are. Select. Tweak. Create.',
    'Connected localhost? Review before Apply.',
    'Live website? Preview. Reload. Repeat.',
    'Your browser is a canvas. Your code stays yours.',
  ];
  let messageIndex = 0;
  setInterval(() => {
    if (
      document.hidden ||
      document.documentElement.classList.contains('no-motion') ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    messageIndex = (messageIndex + 1) % messages.length;
    document.getElementById('terminal-message').textContent = messages[messageIndex];
  }, 6500);
})();
