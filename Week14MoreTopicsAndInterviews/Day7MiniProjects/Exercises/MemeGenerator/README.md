# 🎮 Mini Project - Meme Generator

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/meme-generator-58dea808d6.svg" width="100%" alt="Progress card for Meme Generator">

</div>

A React meme maker. It loads about a hundred popular templates from the free Imgflip API, and I can type top and bottom text, change the size and color, and jump to a random template. The text updates on the image as I type.

## ▶️ How to run

```bash
npm ci
npm run dev
```

Then open `http://localhost:5173`. `npm run build` makes a static `dist/` folder that can go on Netlify or Render.

## 🎯 The challenge

| Component       | What it does                                                                                                                                                                 |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `App`           | Composes the header and editor                                                                                                                                               |
| `MemeGenerator` | Class component; fetches `https://api.imgflip.com/get_memes` in `componentDidMount`, keeps `topText`, `bottomText`, `randomImage`, `allMemeImgs` and style settings in state |
| `Header`        | Function component; title bar, external header reference, original local fallback and Meme Generator paragraph                                                               |
| `MemeForm`      | Controlled inputs: two text fields, a maximum-size slider (20 to 72 px) and a color picker. One `handleChange` updates any field by its `name`                               |
| `MemePreview`   | The image with two `h2` text overlays placed on top with `position: absolute`                                                                                                |

`pickRandomImage()` chooses a random template from the list. The meme text uses Impact in capitals with a four-way black `text-shadow`, the classic meme look.

`MemePreview` keeps the image and the `h2.top` / `h2.bottom` overlays inside a
`div.meme`; its surrounding figure retains the template caption.
The preview reserves a frame even when a photo fails, so captions cannot cover
the form or error notices. The selected text size is an upper bound, also capped
by preview width. Each caption stays within its half of the frame; lower the
maximum size if a long caption is clipped. The page has one contextual heading
for assistive technology, while the header paragraph supplies the visible brand.

## Styles and header assets

`App.jsx` imports the project's own local `App.css`. The
[public teaching stylesheet](https://github.com/devtlv/studentsGitHub/blob/master/JS/Week%209/Day5/Mini%20Projects/React%20Meme%20Generator/App.css)
is linked for comparison and is not bundled or fetched at runtime. This project
does not claim to redistribute that reference sheet.

To use a reference sheet supplied to you for private classroom work, place it at
`.classroom/App.css`, then run `npm run dev:classroom`. That ignored file is served
only by the explicit loopback development mode and loaded before the project's
own styles. The command explains a missing file rather than downloading one.
The resolved classroom configuration binds to `127.0.0.1` and rejects server or
preview host overrides that are outside loopback. Classroom preview is disabled;
use the development command for that mode. Vite keeps its existing file exclusions
and adds `.classroom` to them in every mode. The classroom middleware serves only
the explicit reference stylesheet entry described above.
Normal production builds never load or copy the classroom file; a production
build with `--mode classroom` is deliberately rejected. The public version uses
the project's own stylesheet and does not claim exact reuse of the supplied
reference sheet or course completion based on this private variant.

The header requests the
[PNG All Trollface reference](https://www.pngall.com/wp-content/uploads/2016/05/Trollface.png)
without a referrer. PNG All describes its collection for
[personal or non-commercial projects](https://www.pngall.com/trollface-png/).
No third-party image file is included in this repository. If the header image
fails to load, an [original local SVG](src/assets/header-fallback.svg) replaces it
with descriptive alternative text. Reloading the page retries the reference.

With no network, the editor still accepts text and style changes, reports API
failure and uses the local header fallback. Meme photos remain external: a photo
that is not cached may fail, which is announced separately. The app does not
claim to keep those photos available offline.

The initial `randomImage` is `https://i.imgflip.com/1bij.jpg`. Loading templates preserves it until the **Gen** button is pressed. HTTP errors, invalid/empty collections and network failures leave this image and its editable text available; image load failures are announced separately. The request is aborted on unmount. Generation is disabled until templates are available.

If the template request fails, the **Gen** button changes to **Retry templates**.
Press it to reload the list in place. Both captions, their size and color stay
as you set them. Once loading succeeds, the same button becomes **Gen** again
and keeps keyboard focus. The preview changes when you choose to generate.

## 🧠 What I learned

- One change handler can serve every input when each input's `name` matches a key in the state object
- Class `setState` merges the changed fields while preserving the remaining editor settings
- The range input gives a string, so `fontSize` goes through `Number()` before it reaches the style
- I wrapped the image and texts in their own `.meme-frame` so the caption under the image doesn't push the bottom text up
- Downloading the finished meme would need a canvas, and the Imgflip images may block that, so this version only previews it

## Verification · 2026-11-26

The retry test covers a double click during loading, keyboard focus after
recovery and the edited caption and size on the newly generated template.

The configuration tests use an original CSS fixture in a disposable local project.
They check resolved loopback hosts and file exclusions, reject classroom builds
and previews, and verify the intentional stylesheet middleware through ordinary
development requests.

`npm test` mounts the real components in a DOM environment with API fixtures to verify the initial image remains unchanged after loading, live text/style controls, random generation, error feedback and lifecycle cleanup. `npm run build` creates the production bundle. Imgflip remains an external service; the application reports its failure rather than claiming offline image storage.

Built with AI-assisted tooling; I reviewed, tested and can explain every change.

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 14 Day 7 - Mini-projects - Mini Project
