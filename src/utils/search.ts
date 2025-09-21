export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function createSearchTokens(text: string): string[] {
  return normalizeText(text)
    .split(" ")
    .filter((token) => token.length > 0);
}

export function searchMatch(searchTerm: string, targetText: string): boolean {
  const searchTokens = createSearchTokens(searchTerm);
  const normalizedTarget = normalizeText(targetText);

  return searchTokens.every((token) => normalizedTarget.includes(token));
}
