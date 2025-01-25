/* eslint-disable @typescript-eslint/consistent-type-assertions */
export function trimData<T extends Record<string, string>>(data: T): T {
  const result: T = {} as T;

  Object.entries(data).forEach(([key, value]) => {
    (result as Record<string, string>)[key] = value.trim();
  });

  return result;
}
