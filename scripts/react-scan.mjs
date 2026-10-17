// npm run scan [url]  — open the local dev site in Chrome with react-scan on it.
//
// react-scan (https://react-scan.com) highlights every React render as it
// happens and shows render counts per component: the tool for finding
// components that re-render on every animation frame or while scrolling.
//
// It is injected into the page by this script, from the dev dependency, so
// nothing react-scan related is part of the site or its builds. Start the dev
// server first (`npm run dev`), then run this; close the browser window to
// stop.
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { chromium } from "playwright-core";

const url = process.argv[2] || "http://localhost:3000";
const require = createRequire(import.meta.url);
const reactScan = readFileSync(require.resolve("react-scan/dist/auto.global.js"), "utf8");

// The dev machine's own browser: Chrome, or Edge, whichever is installed.
async function launch() {
  for (const channel of ["chrome", "msedge"]) {
    try {
      return await chromium.launch({ channel, headless: false });
    } catch {
      /* try the next one */
    }
  }
  throw new Error("Neither Google Chrome nor Microsoft Edge was found.");
}

const browser = await launch();
const context = await browser.newContext({ viewport: null });
// Runs before the page's own scripts, so react-scan sees React start up.
await context.addInitScript(
  `${reactScan}\nwindow.reactScan({ enabled: true, log: false, showToolbar: true, trackUnnecessaryRenders: true });`,
);
const page = await context.newPage();
await page.goto(url);
console.log(`react-scan is on at ${url}`);
console.log("Renders flash on the page; the toolbar (bottom right) lists render counts per component.");
console.log("Close the browser window to stop.");
await new Promise((resolve) => browser.on("disconnected", resolve));
