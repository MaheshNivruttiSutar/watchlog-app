export const en = {
  app: {
    name: 'WatchLog',
    tagline: 'Premium Tracking',
  },
  nav: {
    main: 'Main',
    dashboard: 'Dashboard',
    search: 'Search',
    watchlist: 'Watchlist',
  },
  auth: {
    logIn: 'Log in',
    logOut: 'Log out',
  },
  theme: {
    label: 'Theme',
    switchToLight: 'Switch to light theme',
    switchToDark: 'Switch to dark theme',
  },
  language: {
    label: 'Language',
    switcher: 'Interface language',
    en: 'English',
    hi: 'Hindi',
  },
  dashboard: {
    title: 'System Overview',
    subtitle: 'A snapshot of your WatchLog activity.',
    totalItems: 'Total items',
    itemBreakdown: '{{movies}} movies · {{books}} books',
    completed: 'Completed',
    percentComplete: '{{rate}} percent complete',
    percentDone: '{{rate}}% done',
    inProgress: 'In progress',
    inProgressHint: 'Watching or reading now',
    avgRating: 'Avg rating',
    basedOnRatings: 'Based on your ratings',
    noRatings: 'No ratings yet',
    recentlyAdded: 'Recently added',
    viewAll: 'View all',
    empty: 'Nothing on your list yet.',
    searchAndAdd: 'Search and add media',
  },
  common: {
    loading: 'Loading…',
    cancel: 'Cancel',
    remove: 'Remove',
    noCover: 'No cover',
  },
  media: {
    movie: 'Movie',
    book: 'Book',
    movies: 'Movies',
    books: 'Books',
  },
  status: {
    all: 'All',
    want: 'Want',
    wantToWatch: 'Want to watch',
    wantToRead: 'Want to read',
    watching: 'Watching',
    reading: 'Reading',
    done: 'Done',
  },
  list: {
    title: 'Your Watchlist',
    subtitle:
      "Track what you want, what you're into, and what you've finished.",
    filterByType: 'Filter by type',
    filterByStatus: 'Filter by status',
    empty: 'No items match these filters.',
  },
  search: {
    title: 'Discover your next obsession.',
    subtitle:
      'Search across movies and books, then add titles to your watchlist.',
    placeholder: 'Titles, authors, directors...',
    inputLabel: 'Search titles, authors, or directors',
    clear: 'Clear search',
    mediaType: 'Search media type',
    submit: 'Search',
    submitting: 'Searching...',
    results: 'Search results',
    popular: 'Popular right now',
    noResults: 'No results found. Try a different search.',
    noPopular:
      'No popular titles available right now. Search for something new.',
    addToWatchlist: 'Add to Watchlist',
  },
  login: {
    title: 'Login',
    alreadyLoggedIn: 'You are already logged in.',
    instructions:
      'Fake login for Stage 3 — use an email and password from local storage (e.g. arjunsharma@demo.com / 123).',
    email: 'Email',
    emailPlaceholder: 'Enter your email',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    invalidCredentials: 'Invalid email or password',
    submit: 'Log in',
  },
  notFound: {
    title: 'Page not found',
    description: 'The page you are looking for does not exist.',
    dashboard: 'Go to Dashboard',
    watchlist: 'Open Watchlist',
  },
  detail: {
    loading: 'Loading…',
    notFound: 'Item not found.',
    backToList: 'Back to list',
    directedBy: 'Directed by {{creator}}',
    writtenBy: 'Written by {{creator}}',
    factsLabel: 'Item details',
    status: 'Status',
    rating: 'Rating',
    ratingValue: '{{rating}} / 5',
    notRated: 'Not rated yet',
    simulateFailure: 'Simulate server failure',
    ratingReverted: 'Rating was reverted. The server rejected the save.',
    director: 'Director',
    author: 'Author',
    releaseYear: 'Release year',
    publishYear: 'Publish year',
    dateAdded: 'Date added',
    removeTitle: 'Remove from watchlist?',
    removeDescription: '“{{title}}” will be removed from your watchlist.',
    removeFromWatchlist: 'Remove from watchlist',
  },
  card: {
    open: 'Open {{title}}',
    remove: 'Remove {{title}}',
  },
  rating: {
    groupLabel: 'Rating from 1 to 5 stars',
    oneStar: '1 star',
    multipleStars: '{{count}} stars',
  },
  errors: {
    network: 'A network error occurred. Check your connection and try again.',
    tmdbNotConfigured: 'Movie search is not configured.',
    searchFailed: 'Something went wrong. Please try again.',
  },
} as const;

type StringTree<T> = {
  [K in keyof T]: T[K] extends string ? string : StringTree<T[K]>;
};

/** Same keys as English; values may be any locale string. */
export type Translations = StringTree<typeof en>;
