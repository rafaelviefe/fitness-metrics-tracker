export function cn(...classNames: (string | boolean | undefined | null)[]) {
  return classNames.filter(Boolean).join(' ');
}
