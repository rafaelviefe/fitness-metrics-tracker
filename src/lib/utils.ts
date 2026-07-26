export function cn(...classNames: (string | boolean | undefined | null | (string | boolean | undefined | null)[])[]) {
  return classNames
    .flat()
    .filter((item) => typeof item === 'string' && item.trim() !== '')
    .join(' ');
}
