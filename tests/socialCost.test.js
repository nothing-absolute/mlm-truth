import { describe, it, expect } from 'vitest';
import { calcSocialCost } from '../src/logic.js';

describe('calcSocialCost', () => {
  it('computes basic social cost metrics', () => {
    const result = calcSocialCost({ close: 10, acquaint: 40, months: 12, msgs: 5 });
    expect(result.total).toBe(50);
    expect(result.closePitched).toBe(7); // round(10 * 0.72) = 7
    expect(result.acquaintPitched).toBe(25); // round(40 * 0.62) = 25
    expect(result.pitched).toBe(32);
    expect(result.lostClose).toBe(3); // round(7 * 0.42) = 3
    expect(result.totalMsgs).toBe(60);
    expect(result.awkward).toBe(18); // round(12 * 1.5) = 18
    expect(result.estNetLoss).toBe(3360); // 12 * 280
  });

  it('closePitched never exceeds close count', () => {
    const result = calcSocialCost({ close: 1, acquaint: 100, months: 6, msgs: 10 });
    expect(result.closePitched).toBeLessThanOrEqual(1);
  });

  it('acquaintPitched never exceeds acquaint count', () => {
    const result = calcSocialCost({ close: 5, acquaint: 2, months: 6, msgs: 10 });
    expect(result.acquaintPitched).toBeLessThanOrEqual(2);
  });

  it('handles zero close friends', () => {
    const result = calcSocialCost({ close: 0, acquaint: 50, months: 6, msgs: 3 });
    expect(result.closePitched).toBe(0);
    expect(result.lostClose).toBe(0);
    expect(result.total).toBe(50);
  });

  it('handles zero acquaintances', () => {
    const result = calcSocialCost({ close: 15, acquaint: 0, months: 24, msgs: 8 });
    expect(result.acquaintPitched).toBe(0);
    expect(result.total).toBe(15);
  });

  it('scales messages linearly with months', () => {
    const r1 = calcSocialCost({ close: 5, acquaint: 20, months: 6, msgs: 10 });
    const r2 = calcSocialCost({ close: 5, acquaint: 20, months: 12, msgs: 10 });
    expect(r2.totalMsgs).toBe(r1.totalMsgs * 2);
  });

  it('net loss scales with months at $280/mo', () => {
    const result = calcSocialCost({ close: 5, acquaint: 20, months: 24, msgs: 5 });
    expect(result.estNetLoss).toBe(24 * 280);
  });
});
