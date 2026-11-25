# External post data

`dataService.js` exports `fetchPosts()`. Axios requests JSONPlaceholder's posts with a five-second timeout and returns the response array. An Axios-compatible client can be supplied by tests. The blog and book exercises keep their separate arrays in memory.
