# Form tests

Run `npm test` from this exercise folder. Node tests cover prefix matching, case/whitespace, empty/no-match input, diacritics, immutable country data and the retained sign-up validation. They do not mount React. The class combobox is also checked in a real browser for arrows, selection, Escape, Tab/blur, pointer input, clearing and small viewports; browser evidence is kept privately rather than claiming these Node tests cover rendering. All inputs are synthetic; no requests or account registrations are made.
