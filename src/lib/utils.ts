export type ClassNameValue = string | boolean | undefined | null | ClassNameValue[];

export function cn(...classNames: ClassNameValue[]) {
  return classNames
    .flat()
    .filter((item) => typeof item === 'string' && item.trim() !== '')
    .join(' ');
}