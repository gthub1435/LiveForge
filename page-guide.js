'use strict';
(() => {
  const guide = document.querySelector('.robot-guide');
  const robot = document.getElementById('robot-guide');
  const speech = document.getElementById('robot-speech');
  if (!guide || !robot || !speech) return;
  // Keep the guide outside animated/overflow-clipped section containers.
  document.body.append(guide);
  guide.classList.add('page-companion');
  robot.setAttribute('aria-label', 'Ask Byte to explain this section');
  robot.setAttribute('aria-controls', 'robot-speech');
  robot.setAttribute('aria-expanded', 'false');
  speech.removeAttribute('role');
  speech.hidden = true;
  const heading = document.createElement('strong');
  const explanation = document.createElement('p');
  const close = document.createElement('button');
  close.type = 'button';
  close.textContent = 'Close explanation';
  speech.replaceChildren(heading, explanation, close);
  const label = guide.querySelector('.guide-name');
  if (label) label.textContent = 'BYTE / HELP WITH THIS SECTION';
  const controls = document.createElement('div');
  controls.className = 'byte-controls';
  const minimize = document.createElement('button');
  minimize.type = 'button';
  minimize.textContent = 'Minimize Byte';
  minimize.setAttribute('aria-expanded', 'true');
  controls.append(minimize);
  guide.append(controls);
  const lessons = {
    'workshop-title': [
      'Welcome to the workshop',
      'Live Layout Editor lets you try design changes right in your browser. You can move, resize, recolor, and edit elements. On a live website, changes are temporary. Saving to project files needs a connected local project.',
    ],
    playground: [
      'Try the demo',
      'Press Move, Resize, Recolor, or Layer and watch the sample box change. The CSS list shows what changed. This is only a demonstration: it does not change your own project files.',
    ],
    features: [
      'What the editing tools do',
      'Double-click an element to select it. Right-click for editing tools. Hold Ctrl and click to select more elements. You can also draw a selection box. The CSS panel shows the selected element’s styles.',
    ],
    devtools: [
      'How this compares with Chrome DevTools',
      'This tool makes visual changes easier to try directly on a page. Chrome DevTools is still useful for deeper debugging, such as JavaScript errors and network requests. Our extra workflow is reviewing supported changes and saving them to connected local files.',
    ],
    'source-saving': [
      'Save changes to your code',
      'Connect your localhost website to the correct project folder using the companion. Make an edit, choose Apply changes in code, and review the proposed changes. Confirm to write supported changes to the files. Save open editor files first.',
    ],
    'browser-to-code': [
      'From browser to project file',
      'The steps show the whole process: try an edit, review the proposed source changes, confirm Apply, then let your code editor detect the updated file. If the source cannot be matched safely, saving is blocked.',
    ],
    modes: [
      'Live website or local project?',
      'On a public website, edits stay in your browser and disappear when you reload. On a connected local project, supported edits can be reviewed and saved to source files. A localhost address alone does not connect a project.',
    ],
    install: [
      'Install and get started',
      'Download and extract the ZIP. Open chrome://extensions, turn on Developer mode, choose Load unpacked, and select the extension folder. For local source saving, also follow the included companion setup instructions and connect your project folder.',
    ],
    compatibility: [
      'Which projects are supported?',
      'Preview editing works on many ordinary web pages. Source saving depends on the framework and the code pattern. Some text, shared styles, or generated content cannot be mapped safely. Check the support table before relying on file saving.',
    ],
    roadmap: [
      'What is coming next?',
      'This section separates the current release from planned improvements. Future items are goals, so they may not be available in the download yet. Use the current version’s instructions to see what you can do today.',
    ],
    faq: [
      'Common questions',
      'Open a question to read its answer. The key rule is simple: live website edits are temporary; local file changes need a connected project and a supported source match. No website account is needed to use this download.',
    ],
    download: [
      'Get the extension',
      'Press Download v3.11 to save the plugin ZIP. Extract it before installing. The ZIP includes the extension and setup instructions. Downloading alone does not install it in Chrome or connect your project.',
    ],
  };
  const sections = [...document.querySelectorAll('main section')];
  sections.forEach((section) => {
    if (!section.id)
      section.id = section.classList.contains('faq-section')
        ? 'faq'
        : section.classList.contains('hero')
          ? 'workshop-home'
          : 'modes';
  });
  let active,
    frame = 0,
    stopTimer,
    previousScroll = scrollY;
  const setOpen = (open) => {
    speech.hidden = !open;
    robot.setAttribute('aria-expanded', String(open));
  };
  function update() {
    frame = 0;
    const anchor = innerHeight * 0.38;
    let section = sections[0];
    for (const candidate of sections)
      if (candidate.getBoundingClientRect().top <= anchor) section = candidate;
    if (!section || section === active) return;
    active = section;
    const key = section.classList.contains('hero') ? 'workshop-title' : section.id;
    const lesson = lessons[key] || [
      'Explore this section',
      'Read this section to learn more about the extension. Click the page controls to explore the examples.',
    ];
    heading.textContent = lesson[0];
    explanation.textContent = lesson[1];
    robot.setAttribute('aria-label', 'Ask Byte: ' + lesson[0]);
    if (label) label.textContent = 'BYTE / ' + lesson[0].toUpperCase();
  }
  addEventListener(
    'scroll',
    () => {
      guide.classList.toggle('walking-up', scrollY < previousScroll);
      previousScroll = scrollY;
      guide.classList.add('is-walking');
      clearTimeout(stopTimer);
      stopTimer = setTimeout(() => guide.classList.remove('is-walking'), 180);
      if (!frame) frame = requestAnimationFrame(update);
    },
    { passive: true }
  );
  addEventListener('resize', () => {
    if (!frame) frame = requestAnimationFrame(update);
  });
  robot.addEventListener('click', () => {
    update();
    setOpen(speech.hidden);
  });
  close.addEventListener('click', () => {
    setOpen(false);
    robot.focus();
  });
  minimize.addEventListener('click', () => {
    const small = guide.classList.toggle('byte-minimized');
    minimize.textContent = small ? 'Show Byte' : 'Minimize Byte';
    minimize.setAttribute('aria-expanded', String(!small));
    if (small) setOpen(false);
  });
  guide.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setOpen(false);
      robot.focus();
    }
  });
  update();
})();
