export function cn(...classNames: (string | boolean | undefined | null | (string | boolean | undefined | null)[])[]) {
  return classNames.flat().filter(Boolean).join(' ');
}