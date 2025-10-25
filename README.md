# ShopinistaMeta Canva App

This repository contains the static bundle for the **ShopinistaMeta Canva App**.
Upload these files to GitHub Pages and configure the Canva Developer Portal
to point to the `main.js` bundle URL.

## Files
- `main.js` - Main script (registered as edit_design:render)
- `manifest.json` - App manifest sample
- `translations.json` - Translations (en-US)
- `index.html` - Simple landing page for the repo
- `README.md` - This file

## Usage
1. Push this repository to GitHub.
2. Enable GitHub Pages on the `main` branch (root folder).
3. Configure your Canva Developer app activities to point to:
   `https://<youruser>.github.io/<repo-name>/main.js`
4. In Canva Developer, add permission scopes:
   - canva:design:content (read/write)
   - canva:asset:private (read/write)
   - canva:brandkit (read)
5. Test via "Preview in Canva" inside a design (not just the portal).
