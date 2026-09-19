void import('./bootstrap').catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  throw new Error(`Host shell failed to start: ${message}`);
});
