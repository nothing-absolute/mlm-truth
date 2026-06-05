import { describe, it, expect } from 'vitest';
import {
  computeWorldData,
  computeSaturationLevel,
  WORLD_POP,
  RECRUIT_FACTOR,
  MAX_LEVELS,
} from '../src/logic.js';

describe('computeWorldData', () => {
  it('returns correct number of levels', () => {
    const data = computeWorldData();
    expect(data).toHaveLength(MAX_LEVELS);
  });

  it('first level has atLevel = RECRUIT_FACTOR', () => {
    const data = computeWorldData();
    expect(data[0].atLevel).toBe(RECRUIT_FACTOR);
    expect(data[0].total).toBe(1 + RECRUIT_FACTOR);
  });

  it('each level multiplies by recruit factor', () => {
    const data = computeWorldData(5, 5);
    expect(data[0].atLevel).toBe(5);
    expect(data[1].atLevel).toBe(25);
    expect(data[2].atLevel).toBe(125);
    expect(data[3].atLevel).toBe(625);
    expect(data[4].atLevel).toBe(3125);
  });

  it('total is cumulative sum including the founder (1)', () => {
    const data = computeWorldData(3, 3);
    // level 1: 3, total = 1+3=4
    // level 2: 9, total = 4+9=13
    // level 3: 27, total = 13+27=40
    expect(data[0].total).toBe(4);
    expect(data[1].total).toBe(13);
    expect(data[2].total).toBe(40);
  });

  it('respects custom recruit factor', () => {
    const data = computeWorldData(2, 4);
    expect(data[0].atLevel).toBe(2);
    expect(data[1].atLevel).toBe(4);
    expect(data[2].atLevel).toBe(8);
    expect(data[3].atLevel).toBe(16);
  });

  it('handles recruit factor of 1 (linear growth)', () => {
    const data = computeWorldData(1, 5);
    data.forEach(d => expect(d.atLevel).toBe(1));
    expect(data[4].total).toBe(6); // 1 founder + 5 levels × 1
  });
});

describe('computeSaturationLevel', () => {
  it('finds the level where total exceeds world population', () => {
    const data = computeWorldData();
    const satLv = computeSaturationLevel(data);
    // With factor 5, saturation happens relatively quickly
    expect(satLv).toBeGreaterThan(0);
    expect(satLv).toBeLessThanOrEqual(MAX_LEVELS);
  });

  it('level before saturation is below world pop', () => {
    const data = computeWorldData();
    const satLv = computeSaturationLevel(data);
    if (satLv > 1) {
      expect(data[satLv - 2].total).toBeLessThan(WORLD_POP);
    }
  });

  it('saturation level total exceeds world pop', () => {
    const data = computeWorldData();
    const satLv = computeSaturationLevel(data);
    expect(data[satLv - 1].total).toBeGreaterThanOrEqual(WORLD_POP);
  });

  it('returns maxLevels when population is never reached', () => {
    const data = computeWorldData(1, 5);
    const satLv = computeSaturationLevel(data, WORLD_POP);
    expect(satLv).toBe(5); // factor=1 never reaches 8B
  });

  it('returns 1 for very large recruit factor', () => {
    const data = computeWorldData(10_000_000_000, 3);
    const satLv = computeSaturationLevel(data, WORLD_POP);
    expect(satLv).toBe(1);
  });
});
