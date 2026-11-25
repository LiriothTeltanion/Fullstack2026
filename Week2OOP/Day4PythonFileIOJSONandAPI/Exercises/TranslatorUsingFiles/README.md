# 🌍 Exercise - Translator Using Files and Modules

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

A command-line file translator. It reads English UTF-8 text and writes Japanese into a new UTF-8 `.txt` file.

## ▶️ How to run

Use Python 3.10 or newer. From this folder:

```bash
python -m pip install -r requirements.txt
python translator.py example.txt example.ja.txt
```

The destination must be a new filename. Existing files and the source are protected. Files must use the `.txt` extension. A missing input file, unreadable UTF-8 or unavailable service produces a clear error.

## Translation provider

The program uses `deep-translator` with its GoogleTranslator backend. It requires Internet access and sends the file's text to that service. Use non-sensitive text. Provider availability and rate limits can interrupt a run. The included sample is original public practice text.

The code completes translation before creating the output. It keeps line breaks and divides long lines into requests below 4,500 characters. Splits in unusually long lines may reduce translation context.

[Provider module documentation](https://deep-translator.readthedocs.io/en/latest/usage.html)

## What I can explain

- Reading and writing UTF-8, including Japanese characters.
- Passing a function to separate file handling from the translation service.
- Exclusive file creation to protect an existing destination.
- Reporting file errors separately from provider failures.

Created 2026-11-25, Asia/Jerusalem.

## Local translation option

With Ollama running locally and a model already installed, use:

```bash
python translator.py example.txt example.local.ja.txt --backend ollama --model gemma4:e4b-it-qat
```

This backend uses only the local service at 127.0.0.1:11434. It needs no pip package. The selected model must be installed separately. Model output still requires review for translation quality. Missing models, a stopped local service and truncated responses report a failure before creating the output.

The Google provider returned TooManyRequests during the first live verification on 2026-11-25. File handling and provider-failure protection have separate automated tests.

Live local verification on 2026-11-25 completed successfully with the two-line English sample and gemma4:e4b-it-qat. The output contained two Japanese lines, and the original input remained intact.
