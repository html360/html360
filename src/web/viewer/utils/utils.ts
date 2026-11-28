export const generateId = (): string => {
  const datePart = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 6);

  return `${datePart}-${randomPart}`;
};
