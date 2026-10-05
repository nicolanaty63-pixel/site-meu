"use client";

/**
 * Keeps Home's stylesheet in one piece while the maintenance screen shares
 * Home's chrome.
 *
 * Next bundles a route's CSS by which routes use it. The maintenance screen
 * needs only part of Home's CSS (base, nav, footer, cursor); left alone, the
 * bundler cuts Home's single stylesheet into several files and moves that
 * shared part ahead of the rest, which changes Home's cascade order. Listing
 * the whole set here, in Home's order, gives every Home stylesheet the same
 * set of routes, so they stay together and in order: Home loads exactly what
 * it did before, and a closed route loads the file a visitor coming from Home
 * already has cached.
 *
 * Keep this list in step with the stylesheets Home imports (cursor.css and
 * nav.css arrive first, with HomeCursor and HomeNavbar). It is a client
 * module because that is what makes the bundler honour the order below.
 *
 * The order must be the one Home's stylesheet has in the production build.
 * That depends on the folder layout: check it in a checkout whose
 * node_modules sits inside the project root, as on Vercel — not in a
 * worktree that symlinks node_modules from elsewhere.
 */
import "../styles/slide-commit.css";
import "../styles/stepper.css";
import "../styles/carousel.css";
import "../styles/reveal.css";
import "../styles/base.css";
import "../styles/footer.css";
import "../styles/wordmark.css";
import "../styles/hero.css";
import "../styles/stats.css";
import "../styles/services.css";
import "../styles/projects.css";
import "../styles/before-after.css";
import "../styles/process.css";
import "../styles/testimonials.css";
import "../styles/faq.css";
import "../styles/contact.css";

export default function HomeStylesheet() {
  return null;
}
