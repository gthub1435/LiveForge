// Paste your extension GitHub repository URL here. This updates BOTH links.
const GITHUB_REPOSITORY_URL =
  'https://github.com/gthub1435/live-layout-editor-plugin';

document.querySelectorAll('[data-github-repository]').forEach((link) => {
  link.href = GITHUB_REPOSITORY_URL;
});
