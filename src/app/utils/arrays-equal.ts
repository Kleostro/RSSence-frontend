export const arraysEqual = (a: number[], b: number[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((item) => b.includes(item));
};
