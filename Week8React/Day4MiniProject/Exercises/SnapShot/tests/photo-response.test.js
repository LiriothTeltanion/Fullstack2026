import assert from "node:assert/strict";
import test from "node:test";
import { searchPhotos } from "../src/api/pexels.js";

const photo = {
  id: 42,
  url: "https://www.pexels.com/photo/synthetic-42/",
  photographer: "Synthetic Photographer",
  alt: "Synthetic landscape",
  src: { medium: "https://images.pexels.com/photos/42/synthetic.jpg" },
};

function respond(t, payload) {
  return t.mock.method(
    globalThis,
    "fetch",
    async () => new Response(JSON.stringify(payload), { status: 200 })
  );
}

test("normal photo responses retain rendered fields and the encoded search", async t => {
  const request = respond(t, { photos: [photo] });
  assert.deepEqual(await searchPhotos("café %2F"), [photo]);
  const url = new URL(request.mock.calls[0].arguments[0]);
  assert.equal(url.origin, "https://api.pexels.com");
  assert.equal(url.pathname, "/v1/search");
  assert.equal(url.searchParams.get("query"), "café %2F");
  assert.equal(url.searchParams.get("per_page"), "24");
});

test("an actual empty collection remains a successful empty result", async t => {
  respond(t, { photos: [] });
  assert.deepEqual(await searchPhotos("empty"), []);
});

test("missing and invalid photo arrays produce a useful response error", async t => {
  const request = respond(t, null);
  for (const payload of [null, {}, [], { photos: null }, { photos: {} }, { photos: "wrong" }]) {
    request.mock.mockImplementation(async () => new Response(JSON.stringify(payload)));
    await assert.rejects(searchPhotos("invalid"), /invalid photo collection.*Try another search/);
  }
});

test("nonempty collections without usable image records differ from an empty result", async t => {
  respond(t, {
    photos: [null, {}, { src: null }, { src: {} }, { src: { medium: " " } }],
  });
  await assert.rejects(searchPhotos("broken"), /no usable photo records.*Try another search/);
});

test("mixed collections preserve their valid photos in order", async t => {
  const second = { ...photo, id: 43, alt: "Second synthetic image" };
  respond(t, { photos: [null, photo, { id: 9 }, second] });
  assert.deepEqual(await searchPhotos("mixed"), [photo, second]);
});

test("missing or malformed optional metadata keeps a usable image", async t => {
  const image = { src: { medium: photo.src.medium } };
  respond(t, {
    photos: [image, { ...image, id: {}, photographer: {}, alt: {}, url: {} }],
  });
  const photos = await searchPhotos("metadata");
  assert.equal(photos.length, 2);
  for (const result of photos) {
    assert.equal(typeof result.id, "string");
    assert.equal(result.src.medium, photo.src.medium);
    assert.equal(result.url, photo.src.medium);
    assert.equal(result.photographer, "");
    assert.equal(result.alt, "");
  }
  assert.notEqual(photos[0].id, photos[1].id);
});

test("image and optional link URLs are absolute web URLs", async t => {
  respond(t, {
    photos: [
      { ...photo, src: { medium: "not a url" } },
      { ...photo, src: { medium: "/relative-fixture.jpg" } },
      { ...photo, url: "not a url" },
      { ...photo, id: 43, src: { medium: "http://images.example.invalid/fixture.jpg" } },
    ],
  });
  const photos = await searchPhotos("web-links");
  assert.equal(photos.length, 2);
  assert.equal(photos[0].url, photo.src.medium);
  assert.equal(photos[1].src.medium, "http://images.example.invalid/fixture.jpg");
});

test("unreadable JSON is reported as an actionable provider error", async t => {
  t.mock.method(globalThis, "fetch", async () => new Response("unreadable fixture"));
  await assert.rejects(searchPhotos("invalid-json"), /unreadable photo data.*Try another search/);
});

test("HTTP failures retain the existing status error", async t => {
  t.mock.method(globalThis, "fetch", async () => new Response("", { status: 503 }));
  await assert.rejects(searchPhotos("http-error"), /Pexels answered with status 503/);
});

test("network failures remain available to the gallery error state", async t => {
  t.mock.method(globalThis, "fetch", async () => {
    throw new Error("Synthetic network failure");
  });
  await assert.rejects(searchPhotos("network-error"), /Synthetic network failure/);
});
