// Drumset Mini Project
// - Plays sounds on key press or pad click
// - Uses data attributes to map keys to samples
// - Tries .wav, then .mp3 so you can use either

const SAMPLES = {
  A: "clap",
  S: "hihat",
  D: "kick",
  F: "openhat",
  G: "boom",
  H: "ride",
  J: "snare",
  K: "tom",
  L: "tink",
};

// Cache of Audio objects so we don't recreate them every hit.
const audioCache = new Map();

function srcFor(sample) {
  // Prefer .wav, fall back to .mp3
  const wav = `sounds/${sample}.wav`;
  const mp3 = `sounds/${sample}.mp3`;
  // We can't check file existence synchronously; try wav first.
  return wav; // If it 404s, browser will ignore; clone falls back to mp3 if preloaded below.
}

// Preload both formats just in case (not strictly required)
function preload() {
  Object.values(SAMPLES).forEach(name => {
    const a1 = new Audio(`sounds/${name}.wav`);
    const a2 = new Audio(`sounds/${name}.mp3`);
    a1.preload = "auto";
    a2.preload = "auto";
    audioCache.set(`${name}.wav`, a1);
    audioCache.set(`${name}.mp3`, a2);
  });
}

function getAudio(sample) {
  // Try wav first then mp3 from cache; if missing, make a new one
  let a = audioCache.get(`${sample}.wav`) || audioCache.get(`${sample}.mp3`);
  if (!a) {
    a = new Audio(srcFor(sample));
  }
  // Use a clone so overlapping hits can play concurrently
  const clone = a.cloneNode(true);
  clone.currentTime = 0;
  return clone;
}

function play(sample) {
  const pad = document.querySelector(`.key[data-sample="${sample}"]`);
  if (pad) {
    pad.classList.add("playing");
    setTimeout(() => pad.classList.remove("playing"), 120);
  }
  const audio = getAudio(sample);
  // Play and swallow errors caused by missing files
  audio.play().catch(() => {});
}

function onKeyDown(e) {
  const key = (e.key || "").toUpperCase();
  const sample = SAMPLES[key];
  if (sample) {
    e.preventDefault();
    play(sample);
  }
}

function onPadClick(e) {
  const btn = e.target.closest(".key");
  if (!btn) return;
  const sample = btn.dataset.sample;
  play(sample);
}

document.addEventListener("keydown", onKeyDown);
document.querySelector(".keys").addEventListener("click", onPadClick);

// Tweak: allow Space/Enter to trigger focused pad for accessibility
document.querySelectorAll(".key").forEach(btn => {
  btn.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      play(btn.dataset.sample);
    }
  });
});

// Optional: Preload on a user gesture to comply with autoplay policies
window.addEventListener(
  "pointerdown",
  function once() {
    preload();
    window.removeEventListener("pointerdown", once, { capture: true });
  },
  { capture: true }
);
