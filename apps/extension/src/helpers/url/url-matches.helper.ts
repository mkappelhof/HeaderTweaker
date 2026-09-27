export const urlMatches = (url: string, patterns: string[]): boolean => {
  return patterns.some((pattern) => {
    const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
    return new RegExp(escaped).test(url);
  });
};
