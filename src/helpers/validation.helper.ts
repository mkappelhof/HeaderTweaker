export const cleanupHeaderKey = (input: string | undefined) => {
  if (!input) return '';

  return input.trim().replace(/\s+/g, '-');
};
