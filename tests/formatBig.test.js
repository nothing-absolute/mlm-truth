import { describe, it, expect } from 'vitest';
import { formatBig } from '../src/logic.js';

describe('formatBig', () => {
  it('returns raw number string for values below 1000', () => {
    expect(formatBig(0)).toBe('0');
    expect(formatBig(1)).toBe('1');
    expect(formatBig(999)).toBe('999');
    expect(formatBig(500)).toBe('500');
  });

  it('rounds small values to nearest integer', () => {
    expect(formatBig(4.7)).toBe('5');
    expect(formatBig(4.2)).toBe('4');
  });

  it('formats thousands with K suffix', () => {
    expect(formatBig(1000)).toBe('1.0K');
    expect(formatBig(1500)).toBe('1.5K');
    expect(formatBig(999999)).toBe('1000.0K');
    expect(formatBig(54321)).toBe('54.3K');
  });

  it('formats millions with M suffix', () => {
    expect(formatBig(1000000)).toBe('1.0M');
    expect(formatBig(2500000)).toBe('2.5M');
    expect(formatBig(999999999)).toBe('1000.0M');
  });

  it('formats billions with B suffix', () => {
    expect(formatBig(1e9)).toBe('1.0B');
    expect(formatBig(8e9)).toBe('8.0B');
    expect(formatBig(7.5e9)).toBe('7.5B');
  });

  it('formats trillions with T suffix', () => {
    expect(formatBig(1e12)).toBe('1.0T');
    expect(formatBig(3.7e12)).toBe('3.7T');
  });
});
