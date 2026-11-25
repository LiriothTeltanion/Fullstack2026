// Small helpers kept out of the components so they are easy to test

// Google Books gives "2008", "2008-05" or "2008-05-14"; the first four
// characters are always the year, and books with no date count as 0
export function publishedYear(volumeInfo) {
  const year = Number.parseInt(volumeInfo.publishedDate?.slice(0, 4) ?? "", 10);
  return Number.isNaN(year) ? 0 : year;
}

// Keep only books whose title or authors contain the filter text, then sort
// them from newest to oldest
export function filterAndSortBooks(books, filterText) {
  const needle = filterText.trim().toLowerCase();
  return books
    .filter(book => {
      if (!needle) return true;
      const { title = "", authors = [] } = book.volumeInfo;
      return [title, ...authors].some(text => text.toLowerCase().includes(needle));
    })
    .sort((a, b) => publishedYear(b.volumeInfo) - publishedYear(a.volumeInfo));
}
