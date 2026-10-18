'use strict';
const $ = (id) => document.getElementById(id);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let pausedMotion = reducedMotion.matches;
try {
  pausedMotion ||= localStorage.getItem('lle-site-reduce-motion') === 'true';
} catch {}
function applyMotion() {
  document.documentElement.classList.toggle('no-motion', pausedMotion);
  $('motion-toggle').setAttribute('aria-pressed', String(pausedMotion));
  $('motion-toggle').textContent = pausedMotion ? 'Enable motion' : 'Reduce motion';
}
applyMotion();
$('motion-toggle').addEventListener('click', () => {
  pausedMotion = !pausedMotion;
  applyMotion();
  try {
    localStorage.setItem('lle-site-reduce-motion', String(pausedMotion));
  } catch {}
});
if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('js-animate');
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.06 }
  );
  document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));
}
const halo = document.querySelector('.cursor-halo');
let mouseX = -100,
  mouseY = -100,
  haloX = -100,
  haloY = -100,
  hovering = false,
  cursorFrame = 0;
function animateCursor() {
  if (pausedMotion) {
    cursorFrame = 0;
    return;
  }
  haloX += (mouseX - haloX) * 0.16;
  haloY += (mouseY - haloY) * 0.16;
  const radius = hovering ? 22 : 12;
  halo.style.transform = `translate3d(${haloX - radius}px,${haloY - radius}px,0)`;
  if (Math.abs(mouseX - haloX) + Math.abs(mouseY - haloY) > 0.2)
    cursorFrame = requestAnimationFrame(animateCursor);
  else cursorFrame = 0;
}
if (matchMedia('(pointer:fine)').matches) {
  document.addEventListener(
    'pointermove',
    (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      halo.style.opacity = '1';
      if (!cursorFrame && !pausedMotion) cursorFrame = requestAnimationFrame(animateCursor);
    },
    { passive: true }
  );
  document.addEventListener('pointerover', (event) => {
    hovering = !!event.target.closest('a,button,summary');
    halo.classList.toggle('hover', hovering);
  });
  document.addEventListener('pointerout', (event) => {
    if (!event.relatedTarget) halo.style.opacity = '0';
  });
}
function scrollProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  document.querySelector('.reading-progress').style.width =
    (max > 0 ? (scrollY / max) * 100 : 0) + '%';
}
addEventListener('scroll', scrollProgress, { passive: true });
scrollProgress();
const navToggle = document.querySelector('.mobile-nav'),
  nav = document.querySelector('.nav nav');
navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navToggle.textContent = open ? '×' : '☰';
});
nav.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.textContent = '☰';
  })
);
let demo = { mode: 'preview', x: 0, y: 0, width: 320, height: 170, color: '#c5f66b', z: 1 },
  activeTool = '';
const colors = ['#c5f66b', '#b8a0f2', '#8ed9d3', '#f0bc89'];
let colorIndex = 0;
function maxDemoWidth() {
  return Math.max(170, document.querySelector('.demo-stage').clientWidth - 70);
}
function renderDemo() {
  const el = $('sandbox-element');
  el.style.width = Math.min(demo.width, maxDemoWidth()) + 'px';
  el.style.marginLeft = -Math.min(demo.width, maxDemoWidth()) / 2 + 'px';
  el.style.height = demo.height + 'px';
  el.style.translate = `${demo.x}px ${demo.y}px`;
  el.style.backgroundColor = demo.color;
  el.style.boxShadow = demo.z > 1 ? '18px 18px 0 #c5f66b15' : 'none';
  $('dimensions').textContent =
    `${Math.round(Math.min(demo.width, maxDemoWidth()))} × ${demo.height}`;
  const rows = [
    ['translate', `${demo.x}px ${demo.y}px`],
    ['width', Math.round(Math.min(demo.width, maxDemoWidth())) + 'px'],
    ['height', demo.height + 'px'],
    ['background', demo.color],
    ['z-index', String(demo.z)],
  ];
  const related =
    { move: ['translate'], resize: ['width', 'height'], color: ['background'], layer: ['z-index'] }[
      activeTool
    ] || [];
  $('code-rows').replaceChildren(
    ...rows.map(([property, value]) => {
      const row = document.createElement('div');
      row.className = 'code-row' + (related.includes(property) ? ' highlight' : '');
      const key = document.createElement('span'),
        v = document.createElement('b');
      key.textContent = property + ':';
      v.textContent = value + ';';
      row.append(key, v);
      return row;
    })
  );
  $('following').textContent =
    { move: 'position', resize: 'dimensions', color: 'appearance', layer: 'stacking order' }[
      activeTool
    ] || 'selected element';
  const source = demo.mode === 'source';
  $('mode-note').innerHTML =
    '<span class="status-dot"></span>' +
    (source ? 'CONNECTED PROJECT · DEMO' : 'TEMPORARY PREVIEW');
  $('demo-help').textContent = source
    ? 'Illustrative local workflow: stage a change, then review before applying. This demo never reads or writes project files.'
    : 'On live websites, reloading discards your edits. No remote source files are changed.';
  $('demo-apply').disabled = !source;
  $('demo-apply').innerHTML =
    (source ? 'Review changes' : 'Preview only') + ' <svg><use href="#code"/></svg>';
  document.querySelectorAll('[data-mode]').forEach((button) => {
    const active = button.dataset.mode === demo.mode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-tool]').forEach((button) => {
    button.classList.toggle('active', button.dataset.tool === activeTool);
    button.setAttribute('aria-pressed', String(button.dataset.tool === activeTool));
  });
}
function performTool(tool) {
  activeTool = tool;
  if (tool === 'move') {
    demo.x = demo.x === 0 ? 20 : 0;
    demo.y = demo.y === 0 ? -12 : 0;
  }
  if (tool === 'resize') {
    demo.width = demo.width === 320 ? 350 : 320;
    demo.height = demo.height === 170 ? 190 : 170;
  }
  if (tool === 'color') {
    colorIndex = (colorIndex + 1) % colors.length;
    demo.color = colors[colorIndex];
  }
  if (tool === 'layer') demo.z = demo.z === 1 ? 10 : 1;
  renderDemo();
  $('demo-status').textContent = {
    move: 'Position updated. CSS followed.',
    resize: 'Dimensions updated. CSS followed.',
    color: 'A different mood. Same idea.',
    layer: 'Stacking order preview updated.',
  }[tool];
}
document
  .querySelectorAll('[data-tool]')
  .forEach((button) => button.addEventListener('click', () => performTool(button.dataset.tool)));
document.querySelectorAll('[data-mode]').forEach((button) =>
  button.addEventListener('click', () => {
    demo.mode = button.dataset.mode;
    renderDemo();
    $('demo-status').textContent =
      demo.mode === 'source'
        ? 'Localhost workflow · illustrative demo'
        : 'Temporary preview · no remote writes';
  })
);
$('reset-demo').addEventListener('click', () => {
  demo = { mode: demo.mode, x: 0, y: 0, width: 320, height: 170, color: colors[0], z: 1 };
  colorIndex = 0;
  activeTool = '';
  renderDemo();
  $('demo-status').textContent = 'Fresh canvas. Try something new.';
});
addEventListener('resize', renderDemo, { passive: true });
renderDemo();
const review = $('review-dialog');
$('demo-apply').addEventListener('click', () => {
  if (demo.mode !== 'source') return;
  $('review-code').textContent =
    `/* Illustrative diff — demo only */\n.your-idea {\n  translate: ${demo.x}px ${demo.y}px;\n  width: ${Math.round(Math.min(demo.width, maxDemoWidth()))}px;\n  height: ${demo.height}px;\n  background: ${demo.color};\n  z-index: ${demo.z};\n}`;
  review.showModal();
});
$('close-dialog').addEventListener('click', () => review.close());
$('confirm-demo').addEventListener('click', () => {
  review.close();
  $('demo-status').textContent = 'Applied to the demo only. No files were changed.';
});
review.addEventListener('click', (event) => {
  if (event.target === review) {
    const rect = review.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      review.close();
  }
});
const illustrations = {
  download:
    '<div class="illus-window"><div class="illus-bar"><span>Downloads</span><span>↓</span></div><div class="illus-body"><div class="illus-row selected"><span>▣</span><b>live-layout-editor-plugin.zip</b><small>v3.11</small></div><div class="illus-note">Right-click the downloaded ZIP</div><div class="illus-cta">Extract All…</div><p class="illus-note">Keep the extracted folder in a permanent location.</p></div></div>',
  chrome:
    '<div class="illus-window"><div class="illus-bar"><span>chrome://extensions</span><span>Developer mode &nbsp; <i class="illus-switch"></i></span></div><div class="illus-body"><div class="illus-cta">Load unpacked</div><div class="illus-row selected"><span>▱</span><b>live-layout-editor-plugin / extension</b></div><p class="illus-note">Select the extension subfolder, not the ZIP.</p></div></div>',
  companion:
    '<div class="illus-window"><div class="illus-bar"><span>Your extracted package</span><span>WINDOWS</span></div><div class="illus-body"><div class="illus-row"><span>▱</span><b>extension</b></div><div class="illus-row selected"><span>⌘</span><b>INSTALL-COMPANION.cmd</b><small>RUN ONCE</small></div><p class="illus-note">Node.js 20+ installed · Full package extracted</p></div></div>',
  connect:
    '<div class="illus-window"><div class="illus-bar"><span>http://localhost:3000</span><span>YOUR PROJECT</span></div><div class="illus-body"><b>Live Layout Editor / Local project</b><br><div class="illus-cta">Choose project folder…</div><div class="illus-row selected"><span>▱</span><b>D:\\projects\\your-project</b></div><p class="illus-note">Connected to this exact localhost origin.</p></div></div>',
  edit: '<div class="illus-window"><div class="illus-bar"><span>Your page</span><span>VISUAL EDITING</span></div><div class="illus-body"><div class="illus-selected"><span class="handle tl"></span><span class="handle br"></span><span class="illus-big">Your next idea.</span></div><div class="illus-row"><b>Move &nbsp; Resize &nbsp; Color &nbsp; Live CSS</b></div><p class="illus-note">Double-click to select · Right-click for options</p></div></div>',
  apply:
    '<div class="illus-window"><div class="illus-bar"><span>Review source changes</span><span>index.html</span></div><div class="illus-body"><div class="illus-note">− color: #ffffff;</div><div class="illus-row selected"><b>+ color: #c5f66b;</b></div><div class="illus-note">Review the diff before confirming.</div><div class="illus-cta">Apply changes in code ✓</div></div></div>',
  preview:
    '<div class="illus-window"><div class="illus-bar"><span>Live Layout Editor</span><span>LIVE WEBSITE</span></div><div class="illus-body"><div class="illus-big">A new perspective.</div><div class="illus-cta">Preview this website</div><p class="illus-note">No project folder needed. No companion needed.<br>Refresh the webpage to discard the preview.</p></div></div>',
};
const localSteps = [
  {
    title: 'Download & extract',
    detail:
      'Download the v3.11 ZIP below. Use <strong>Extract All</strong> and keep the entire extracted package in a permanent folder. Don’t run the setup script from inside the ZIP.',
    picture: 'download',
  },
  {
    title: 'Load the Chrome extension',
    detail:
      'Open <code>chrome://extensions</code>. Enable <strong>Developer mode</strong>, choose <strong>Load unpacked</strong>, and select the package’s <code>extension</code> subfolder. Pin its icon for easy access.',
    picture: 'chrome',
  },
  {
    title: 'Install the local companion',
    detail:
      'For source saving on Windows, install <strong>Node.js 20+</strong>, then run <code>INSTALL-COMPANION.cmd</code> from the fully extracted package. This installs and registers the companion in your user folder.',
    picture: 'companion',
  },
  {
    title: 'Connect your project folder',
    detail:
      'Start your project’s normal dev or static server and open its localhost page. Click the extension → <strong>Choose project folder</strong>. On the connection page, browse to the original project folder serving that exact hostname and port.',
    picture: 'connect',
  },
  {
    title: 'Start editing visually',
    detail:
      'Return to localhost. Open the extension and choose <strong>Start local project editing</strong>. Double-click an object; right-click for options. Ctrl-click or drag a selection box for multiple objects. Click outside to finish a preview edit.',
    picture: 'edit',
  },
  {
    title: 'Review & apply to code',
    detail:
      'Save all open files in your editor. Click <strong>Apply changes in code</strong>, review the proposed source changes, then confirm. Supported edits update the original files. If a match is ambiguous or a file conflicts, resolve it before applying.',
    picture: 'apply',
  },
];
const previewSteps = [
  localSteps[0],
  localSteps[1],
  {
    title: 'Preview any ordinary webpage',
    detail:
      'Open a regular website and click the extension → <strong>Preview this website</strong>. Double-click to select and right-click for tools. No companion is needed. Export a change report if useful; refresh the page to discard edits.',
    picture: 'preview',
  },
];
let guideMode = 'source',
  guideStep = 0;
function renderGuide() {
  const steps = guideMode === 'source' ? localSteps : previewSteps,
    current = steps[guideStep];
  $('guide-steps').replaceChildren(
    ...steps.map((step, i) => {
      const button = document.createElement('button');
      button.className = 'step-button' + (i === guideStep ? ' active' : '');
      button.setAttribute('aria-current', i === guideStep ? 'step' : 'false');
      button.innerHTML = `<span>${String(i + 1).padStart(2, '0')}</span><b>${step.title}</b><svg><use href="#arrow"/></svg>`;
      button.addEventListener('click', () => {
        guideStep = i;
        renderGuide();
      });
      return button;
    })
  );
  $('guide-picture').innerHTML =
    '<div class="illustration" role="img" aria-label="' +
    current.title +
    ' illustration">' +
    illustrations[current.picture] +
    '</div>';
  $('guide-counter').textContent =
    `STEP ${String(guideStep + 1).padStart(2, '0')} / ${String(steps.length).padStart(2, '0')}`;
  $('guide-title').textContent = current.title;
  $('guide-description').innerHTML = current.detail;
  if ($('setup-progress')) {
    $('setup-progress').textContent = 'CHECKPOINT ' + (guideStep + 1) + ' / ' + steps.length;
    $('setup-meter-fill').style.width = ((guideStep + 1) / steps.length) * 100 + '%';
  }
  $('guide-prev').disabled = guideStep === 0;
  $('guide-next').disabled = guideStep === steps.length - 1;
  $('guide-panel').setAttribute('aria-labelledby', 'guide-' + guideMode);
  document
    .querySelectorAll('[data-guide]')
    .forEach((button) =>
      button.setAttribute('aria-selected', String(button.dataset.guide === guideMode))
    );
  document.querySelector('.install-platform').hidden = guideMode === 'preview';
}
function setGuide(mode) {
  guideMode = mode;
  guideStep = 0;
  renderGuide();
}
document
  .querySelectorAll('[data-guide]')
  .forEach((button) => button.addEventListener('click', () => setGuide(button.dataset.guide)));
document
  .querySelectorAll('[data-guide-link]')
  .forEach((link) => link.addEventListener('click', () => setGuide(link.dataset.guideLink)));
$('guide-prev').addEventListener('click', () => {
  if (guideStep > 0) {
    guideStep--;
    renderGuide();
  }
});
$('guide-next').addEventListener('click', () => {
  const max = (guideMode === 'source' ? localSteps : previewSteps).length - 1;
  if (guideStep < max) {
    guideStep++;
    renderGuide();
  }
});
document.querySelectorAll('[data-guide]').forEach((button) =>
  button.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const mode = guideMode === 'source' ? 'preview' : 'source';
    setGuide(mode);
    $('guide-' + mode).focus();
  })
);
renderGuide();
