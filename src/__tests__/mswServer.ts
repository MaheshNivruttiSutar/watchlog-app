import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const openLibrarySearchUrl =
  'https://openlibrary.org/search.json';

export const server = setupServer(
  http.get(openLibrarySearchUrl, () =>
    HttpResponse.json({ docs: [] }),
  ),
  http.get('https://openlibrary.org/trending/now.json', () =>
    HttpResponse.json({ works: [] }),
  ),
  http.get('https://api.themoviedb.org/3/movie/popular', () =>
    HttpResponse.json({ results: [] }),
  ),
  http.get('https://api.themoviedb.org/3/search/movie', () =>
    HttpResponse.json({ results: [] }),
  ),
);
