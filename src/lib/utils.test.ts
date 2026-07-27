import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('should combine multiple string class names', () => {
    expect(cn('class1', 'class2', 'class3')).toBe('class1 class2 class3');
  });

  it('should ignore undefined, null, false, and true values', () => {
    // Updated: `true` is now also ignored, as per the new filtering logic.
    expect(cn('base', undefined, 'active', null, false, true, 'modifier')).toBe('base active modifier');
  });

  it('should ignore empty strings and strings with only whitespace', () => {
    expect(cn('first', '', 'second', '  ')).toBe('first second');
  });

  it('should return an empty string if all inputs are falsy, empty, or non-string values', () => {
    expect(cn(undefined, null, false, '', true, [''])).toBe('');
    expect(cn()).toBe('');
  });

  it('should handle a single class name correctly', () => {
    expect(cn('single-class')).toBe('single-class');
  });

  it('should filter out direct boolean true and false values', () => {
    expect(cn('base', true, false, 'modifier')).toBe('base modifier');
  });

  it('should handle mixed valid inputs and conditional rendering (simple booleans)', () => {
    const isActive = true;
    const shouldShow = false;
    // isActive && 'active-class' results in 'active-class' (string), which passes the filter.
    // shouldShow && 'hidden-class' results in false (boolean), which is filtered out.
    expect(cn('default', isActive && 'active-class', shouldShow && 'hidden-class', 'final-class')).toBe('default active-class final-class');
  });

  it('should handle numeric string inputs (although types restrict this typically)', () => {
    expect(cn('w-1/2', 'h-full')).toBe('w-1/2 h-full');
  });

  it('should flatten a single level of arrays and filter out non-string values within them', () => {
    expect(cn('base', ['item-a', null, 'item-b', undefined, false, ''], 'end')).toBe('base item-a item-b end');
  });

  it('should filter out nested arrays as they are not strings after initial flattening', () => {
    // Updated: Deeply nested arrays are now filtered out, as the filter only passes actual strings.
    expect(cn('outer', ['inner-a', ['deep-a', 'deep-b']], 'outer-end')).toBe('outer inner-a outer-end');
  });
});
