export const dateAsString = (date: Date): string =>
  date.toISOString().substring(0, "YYYY-MM-DD".length);
