import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { buildSync } from "esbuild";

const app = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// Bundle one shared React instance with the actual source components and renderer.
// No copied component implementation, browser network or temporary source rewrite.
const compiled = buildSync({
  stdin: {
    contents: `
      import React from 'react';
      import {renderToStaticMarkup} from 'react-dom/server';
      import BootstrapCard from './src/components/BootstrapCard.jsx';
      import SixPlanetList from './src/components/SixPlanetList.jsx';
      import OriginalExercises from './src/OriginalExercises.jsx';
      import App from './src/App.jsx';
      export const card = props => renderToStaticMarkup(<BootstrapCard {...props}/>);
      export const planets = () => renderToStaticMarkup(<SixPlanetList/>);
      export const original = () => renderToStaticMarkup(<OriginalExercises/>);
      export const app = () => renderToStaticMarkup(<App/>);
    `,
    resolveDir: app,
    loader: "jsx",
  },
  bundle: true,
  platform: "node",
  format: "cjs",
  write: false,
  jsx: "automatic",
}).outputFiles[0].text;
const exports = { exports: {} };
new Function("module", "exports", "require", compiled)(
  exports,
  exports.exports,
  createRequire(import.meta.url)
);
const render = exports.exports;

test("BootstrapCard renders actual props and Bootstrap content classes", () => {
  const html = render.card({
    name: "Ada Lovelace",
    description: "An original profile",
    buttonLabel: "Read Ada",
    buttonUrl: "https://example.com/ada",
    color: "#abc123",
  });
  assert.match(html, /class="card bootstrap-card h-100"/);
  assert.match(html, /class="card-body/);
  assert.match(html, /class="card-title h5">Ada Lovelace/);
  assert.match(html, /class="card-text flex-grow-1">An original profile/);
  assert.match(html, /href="https:\/\/example.com\/ada"/);
  assert.match(html, /Read Ada/);
  assert.match(html, /rel="noopener noreferrer"/);
});
test("missing optional link produces readable text instead of a dead anchor", () => {
  const html = render.card({});
  assert.match(html, /Guest profile/);
  assert.match(html, /No external link provided/);
  assert.doesNotMatch(html, /<a\b/);
});
test("React safely renders ordinary text content without treating it as markup", () => {
  const html = render.card({ name: "Research & Music", description: "A < B and B > C" });
  assert.match(html, /Research &amp; Music/);
  assert.match(html, /A &lt; B and B &gt; C/);
});
test("exercise list has six unique planets in the documented order", () => {
  const html = render.planets();
  assert.equal((html.match(/<li\b/g) || []).length, 6);
  const names = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn"];
  assert.ok(
    names.every((name, index) => index === 0 || html.indexOf(names[index - 1]) < html.indexOf(name))
  );
  assert.doesNotMatch(html, /Uranus|Neptune/);
});
test("original examples preserve three profiles, eight planets and three links", () => {
  const html = render.original();
  assert.equal((html.match(/<article\b/g) || []).length, 3);
  for (const text of [
    "Bob Dylan",
    "Paul McCartney",
    "Ada Lovelace",
    "Uranus",
    "Neptune",
    "GitHub",
    "React docs",
    "Vite docs",
  ])
    assert.ok(html.includes(text), text);
  assert.equal((html.match(/<li\b/g) || []).length, 8);
});
test("real App entrypoint contains the Bootstrap view and collapsed comparison", () => {
  const html = render.app();
  assert.equal((html.match(/card bootstrap-card h-100/g) || []).length, 3);
  assert.match(html, /Six-planet exercise list/);
  assert.match(html, /<details class="original-examples">/);
  assert.doesNotMatch(html, /<details[^>]*\bopen\b/);
});
