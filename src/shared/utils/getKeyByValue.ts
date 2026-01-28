export const getKeyByValue = (obj: Record<string, string>, value: string) =>
  Object.entries(obj).find(([, v]) => v === value)?.[0];
