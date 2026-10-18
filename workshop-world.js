'use strict';
(() => {
  const stages = [
    {
      title: '01 / Edit on the page',
      detail:
        'Move an element or change its appearance. The browser preview updates; the original project file is still unchanged.',
      browser: 'Preview staged · file unchanged',
      file: 'File on disk: unchanged',
      code: '<h1 style="color: #ffffff">\n  Your next idea.\n</h1>',
    },
    {
      title: '02 / Review the proposed source changes',
      detail:
        'Click Apply changes in code. The companion resolves supported elements and presents the proposed changes for review. No file has been written yet.',
      browser: 'Review the proposed changes',
      file: 'Review pending · no disk write',
      code: '- color: #ffffff;\n+ color: #b491ff;\n+ translate: 24px 16px;',
    },
    {
      title: '03 / Confirm Apply',
      detail:
        'After confirmation, the companion checks for conflicts and writes supported edits to the original project files. Unsupported or ambiguous targets block saving.',
      browser: 'Apply confirmed · companion writes files',
      file: 'Supported changes written to disk',
      code: '<h1 style="color: #b491ff;\n  translate: 24px 16px">\n  Your next idea.\n</h1>',
    },
    {
      title: '04 / Your editor detects the updated file',
      detail:
        'VS Code, Cursor, or another editor detects the changes on disk. A dev server with hot reload may refresh the page. Save editor buffers before applying browser edits.',
      browser: 'Preview → reviewed source change',
      file: 'Editor detects updated source',
      code: '<h1 style="color: #b491ff;\n  translate: 24px 16px">\n  Your next idea.\n</h1>',
    },
  ];
  let active = 0;
  function showStage(index) {
    active = index;
    const stage = stages[index];
    document.getElementById('journey-title').textContent = stage.title;
    document.getElementById('journey-detail').textContent = stage.detail;
    document.getElementById('journey-browser-status').textContent = stage.browser;
    document.getElementById('journey-file-status').textContent = stage.file;
    document.getElementById('journey-code').textContent = stage.code;
    document.getElementById('journey-screen').dataset.stage = index;
    document
      .getElementById('journey-screen')
      .setAttribute('aria-labelledby', 'journey-tab-' + index);
    document
      .querySelectorAll('[data-journey]')
      .forEach((button) =>
        button.setAttribute('aria-selected', String(Number(button.dataset.journey) === index))
      );
  }
  document.querySelectorAll('[data-journey]').forEach((button) => {
    button.addEventListener('click', () => showStage(Number(button.dataset.journey)));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next =
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? 3
            : (active + (event.key === 'ArrowRight' ? 1 : 3)) % 4;
      showStage(next);
      document.getElementById('journey-tab-' + next).focus();
    });
  });
  showStage(0);
})();
