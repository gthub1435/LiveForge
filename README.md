# Live Layout Editor — Website source

Complete static website: HTML, CSS, JavaScript, logo, illustrated installation guide,
interactive demo, and the v3.11 extension download.

## No login required

There is no authentication, account system, backend, API key, or ChatGPT dependency
in this website. The earlier ChatGPT login screen belonged to the private preview
hosting, not this code. This export excludes that hosting configuration.

## Open immediately

Extract this ZIP, then open index.html in Chrome.
On Windows, START-WEBSITE.cmd opens it for you.
Keep app.js, style.css and assets alongside index.html.
No npm install, Node.js, or build step is required to view this website.
(The extension companion has its own requirements, explained on the page.)

## Run on localhost (optional)

If Python is installed, open a terminal in this folder and run:

    python -m http.server 8080

Then open http://localhost:8080.

## Publish from GitHub to Vercel

1. Create a GitHub repository and upload the CONTENTS of this folder.
   index.html should be in the repository root.
2. In Vercel, choose Add New Project and import that repository.
3. Choose Framework Preset: Other.
4. Root Directory: repository root. Build Command: leave unset.
5. Output Directory: . (the repository root).
6. Deploy and use the production URL.
7. If Vercel deployment protection is enabled, disable login protection for the
   public production deployment in the project's deployment protection settings.
   Hosting-level access controls are separate from this website's code.

Visitors do not need a GitHub, Vercel or ChatGPT account when hosted publicly.
Your own account is needed to manage the deployment.

## Edit the website

index.html — page content, sections, links and SVG icons
style.css — layout, responsive styling and animations
app.js — interactive demo, installation guide, cursor and motion controls
assets/logo.png — logo
live-layout-editor-plugin.zip — downloadable extension package
HOW-TO-USE.txt — extension usage instructions

Set your GitHub repository URL in repository.js. Both GitHub buttons use that
single setting. See SET-GITHUB-LINK.txt for instructions.

The Google Fonts import is optional and requires internet access; fallback fonts
are provided. No font request requires login. Installation pictures are HTML/CSS
illustrations, not browser screenshots. The demo never changes project files.

## Pixel workshop edition

Original generated pixel-art scene and robot guide, CSS character bob/greeting,
ambient pixel particles, pointer parallax, square cursor halo, dimmable lights,
and rotating terminal tips. Robot tips work by mouse, touch and keyboard.
Reduced motion pauses decorative animation. No login or backend was added.

## Complete workshop edition

Pixel art now continues beyond the hero: selection workbench, source lab, release
portal, installation mission checkpoints, quest roadmap and robot knowledge base.

The Why this tool? section compares the visual workflow with Chrome DevTools
without claiming to replace debugging or claiming DevTools cannot save files.
The browser-to-code walkthrough has four selectable checkpoints and explicitly
distinguishes preview, review, confirmed Apply, and editor file detection.

Additional files: workshop-world.css and workshop-world.js are required.
Artwork provenance and generation prompts are in ASSET-PROMPTS.txt.

Validation: JavaScript syntax, DOM interaction checks, stylesheet parsing,
HTML structure/links/assets and ZIP integrity. A rendered browser visual review
was unavailable in the build environment.
