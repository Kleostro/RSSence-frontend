type TemplateValues<T extends string = string> = Record<T, boolean | number | string>;

export const stringTemplate = <T extends string = string>(template: string, values: TemplateValues<T>): string =>
  template.replace(/\{\{(\w+)\}\}/g, (match, key: keyof TemplateValues<T>) => {
    if (Object.hasOwn(values, key)) {
      return String(values[key]);
    }
    return match;
  });
