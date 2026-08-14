export type ClassNameValue = string | boolean | undefined | null | ClassNameValue[];

export function cn(...classNames: Array<any>): string {
  return classNames
    .flat(Infinity) 
    .filter((item) => typeof item === 'string' && item.trim() !== '')
    .join(' ');
}
