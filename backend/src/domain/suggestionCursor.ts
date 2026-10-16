export function shownVariant(variant: number): number {
  return variant > 3 ? variant - 3 : variant;
}

export function isPendingSuggestion(variant: number): boolean {
  return variant > 3;
}

export function storedPendingVariant(shown: number): number {
  return shown + 3;
}
