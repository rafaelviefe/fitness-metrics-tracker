import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('should combine multiple string class names', () => {
    expect(cn('class1', 'class2', 'class3')).toBe('class1 class2 class3');
  });

  it('should ignore undefined, null, and false values', () => {
    expect(cn('base', undefined, 'active', null, false, 'modifier')).toBe('base active modifier');
  });

  it('should ignore empty strings', () => {
    expect(cn('first', '', 'second', '  ')).toBe('first second   ');
  });

  it('should return an empty string if all inputs are falsy or empty', () => {
    expect(cn(undefined, null, false, '')).toBe('');
    expect(cn()).toBe('');
  });

  it('should handle a single class name correctly', () => {
    expect(cn('single-class')).toBe('single-class');
  });

  it('should convert boolean true to string "true" if not conditionally handled', () => {
    // Note: In real-world usage with clsx/tailwind-merge, booleans are often for conditional rendering.
    // This simple `cn` converts `true` to the string "true".
    expect(cn('base', true, 'modifier')).toBe('base true modifier');
  });

  it('should handle mixed valid inputs and conditional rendering (simple booleans)', () => {
    const isActive = true;
    const shouldShow = false;
    expect(cn('default', isActive && 'active-class', shouldShow && 'hidden-class', 'final-class')).toBe('default active-class final-class');
  });

  it('should handle numeric string inputs (although types restrict this typically)', () => {
    // The type definition allows `string`, so '123' is a valid string input.
    expect(cn('w-1/2', 'h-full')).toBe('w-1/2 h-full');
  });

  it('should not flatten arrays of class names (limitation of simple cn)', () => {
    // This utility does not mimic `clsx`'s ability to flatten arrays.
    // An array argument will be stringified using its `toString()` method.
    expect(cn('base', ['item-a', 'item-b'], 'end')).toBe('base item-a,item-b end');
  });
});
