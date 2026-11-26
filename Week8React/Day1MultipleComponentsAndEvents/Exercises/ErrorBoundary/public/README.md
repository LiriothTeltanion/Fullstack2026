# Local fallback image feed

`images.json` is a read-only HTTP JSON feed served by Vite and by the production static site. The app normally requests the public Lorem Picsum API. If that API or its image resources fail, this feed supplies two original SVG illustrations and the UI explicitly labels the fallback. It is also used as deterministic image content in offline browser tests. See [image provenance](images/README.md).
