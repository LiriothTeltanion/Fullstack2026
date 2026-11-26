# Emoji greeting interface

The browser form uses native radio inputs for emoji selection, shared validation and a same-origin `POST /greeting` request. Names and replies are rendered as plain text. Editing or resetting cancels the current request so a late response cannot overwrite a newer interaction. All assets are local; no third-party API is needed.
