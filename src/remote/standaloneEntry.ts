// Delay React imports until Webpack has initialized the shared dependency scope.
void import('./standalone').catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  throw new Error(`WatchLog remote failed to start: ${message}`);
});
