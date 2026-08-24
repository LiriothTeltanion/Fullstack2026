# NOVA / Blue Obsidian visual system

## Direction

Use a refined dark technical identity with subtle retrofuturist, music, and gaming character. The result should feel authored and recruiter-readable, not like a generic purple AI dashboard.

## Tokens

- Foundation: obsidian, near-black navy, and layered deep blue.
- Primary accent: cobalt/electric blue.
- Secondary accent: restrained dark violet.
- Status colors: high-contrast green, amber, red, and cyan with text/icon reinforcement; color alone never carries meaning.
- Typography: readable system or repository-safe fonts; monospace only for code/data.
- Spacing: consistent rhythm, generous touch targets, and narrow readable prose columns.

## Interaction and accessibility

- Semantic elements before ARIA; real buttons/links for actions.
- Visible keyboard focus and logical focus order.
- Minimum useful target size of about 44 by 44 CSS pixels for touch controls where practical.
- Support zoom, narrow screens, LTR/RTL direction, and long EN/ES/HE strings.
- Provide loading, empty, error, offline, and success states.
- Respect `prefers-reduced-motion`; reduced mode removes nonessential transforms and loops.
- Avoid flashes, fast parallax, background motion behind reading text, and auto-playing audio.

## Documentation assets

- Root README: at most one polished hero animation plus compact status visuals.
- Week README: consistent header/status component.
- Featured project: one real screenshot/GIF/SVG sequence when it adds evidence.
- Use GIF only for short, real, verified product behavior. Because an embedded
  GIF cannot reliably honor a reader's reduced-motion preference, keep it out of
  the root README, provide a static poster/description, and prefer an accessible
  linked recording when motion is essential.
- Small exercise: static identity unless motion teaches something.
- Use local, attributed assets and deterministic filenames. Identical inputs must not create new hash variants.
- GitHub README assets must not require executable JavaScript.

## Verification

For any visual change, inspect the actual browser/render at desktop and narrow widths, keyboard navigation, visible focus, contrast, text clipping, asset links, and reduced motion. A source-code review alone is not visual verification.
