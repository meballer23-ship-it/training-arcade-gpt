# Training Arcade — GPT edition

**[Play the arcade](https://meballer23-ship-it.github.io/training-arcade-gpt/)**

A browser-based reimagining of Endsight Arcade, built with plain JavaScript and no runtime dependencies. Includes Customer Service and Claude Fundamentals courses, six practice areas, four games, and a mixed boss circuit.

- **Signal Bridge:** choose a lane and answer recall questions.
- **Cable Wyrm:** steer a cable to numbered answer packets.
- **Rack Tower:** handle customer-call decisions and place rack modules.
- **Runbook Relay:** put steps in order and avoid decoys.

Learn shows teaching tips, Train adds timing/lives/combos, and Focus removes time pressure. Progress stays in your browser. Sound, calm controls, and JSON progress export are available in Settings.

## Develop

Requires Node.js. No package installation is required.

```sh
npm run build
npm test
npm start
```

The server listens on `http://127.0.0.1:4173`. You can also open `endsight-arcade.html` directly for offline play.

Edit `app.js`, `core.js`, `styles.css`, `template.html`, or the course JSON files, then run `npm run build`. The build generates `dist/index.html`, the standalone HTML file, and root `index.html`. GitHub Pages serves the committed repository root from `main`.

## Checks and scope

Twelve automated tests cover content validity, mixed bosses, spaced mastery, due-item scheduling, save validation, scoring, and simulated run lifecycles. These do not replace visual and touch playtests.

This is a fresh implementation, not a feature-identical port of the original kit. The course JSON files retain the supplied Endsight content and metadata. Layout, vector scenes, application code, build scripts, and tests were created for the GPT edition. Three retained flawed-example atoms are not presented as games.
