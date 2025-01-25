export function trimData<T extends Record<string, string>>(data: T): Record<string, string> {
  const result: Record<string, string> = {};
  Object.entries(data).forEach(([key, value]) => {
    result[key] = value.trim();
  });

  return result;
}
