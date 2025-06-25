export const arraysEqual = (a: unknown[], b: unknown[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((item) => b.includes(item));
};
