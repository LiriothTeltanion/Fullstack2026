"""Translate an English UTF-8 text file to a new Japanese text file."""
from __future__ import annotations

import argparse
from pathlib import Path
from typing import Callable

CHUNK_SIZE = 4500


def translate_document(text: str, translate: Callable[[str], str]) -> str:
    """Preserve line breaks while keeping each provider request below its limit."""
    output = []
    for line in text.splitlines(keepends=True):
        content = line.rstrip("\r\n")
        ending = line[len(content):]
        for offset in range(0, len(content), CHUNK_SIZE):
            chunk = content[offset:offset + CHUNK_SIZE]
            output.append(translate(chunk) if chunk.strip() else chunk)
        output.append(ending)
    return "".join(output)


def translate_file(source: Path, destination: Path, translate: Callable[[str], str]) -> None:
    """Finish translation before exclusively creating the requested output file."""
    if source.suffix.lower() != ".txt" or destination.suffix.lower() != ".txt":
        raise ValueError("The input and output must both have a .txt extension.")
    if source.resolve() == destination.resolve():
        raise ValueError("Choose a new output file, separate from the source.")
    if destination.exists():
        raise FileExistsError("The output already exists. Choose a new filename.")
    original = source.read_text(encoding="utf-8-sig")
    translated = translate_document(original, translate)
    # Exclusive creation also protects a file created by another process meanwhile.
    with destination.open("x", encoding="utf-8", newline="") as output:
        output.write(translated)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--backend", choices=["google", "ollama"], default="google")
    parser.add_argument("--model", default="gemma4:e4b-it-qat")
    args = parser.parse_args()
    try:
        if args.backend == "ollama":
            from translation_backends import OllamaTranslator
            backend = OllamaTranslator(args.model)
        else:
            from deep_translator import GoogleTranslator
            backend = GoogleTranslator(source="en", target="ja")
        translate_file(args.source, args.destination, backend.translate)
    except ImportError:
        parser.exit(2, "Install the translator first: python -m pip install -r requirements.txt\n")
    except (OSError, UnicodeError, ValueError) as error:
        parser.exit(2, f"File translation failed: {error}\n")
    except Exception as error:
        parser.exit(1, f"Translation service failed: {type(error).__name__}. No output was created.\n")
    print(f"Japanese translation written to {args.destination}")


if __name__ == "__main__":
    main()
