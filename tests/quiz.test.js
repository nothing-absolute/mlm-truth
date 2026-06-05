import { describe, it, expect } from 'vitest';
import { quizData, scoreQuizAnswer, computeQuizFinalMessage } from '../src/logic.js';

describe('quizData', () => {
  it('has 7 questions', () => {
    expect(quizData).toHaveLength(7);
  });

  it('each question has required fields', () => {
    quizData.forEach(q => {
      expect(q).toHaveProperty('company');
      expect(q).toHaveProperty('type');
      expect(q).toHaveProperty('options');
      expect(q).toHaveProperty('correct');
      expect(q.options).toHaveLength(4);
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(4);
    });
  });
});

describe('scoreQuizAnswer', () => {
  it('returns correct=true when the right answer is selected', () => {
    quizData.forEach((q, i) => {
      const result = scoreQuizAnswer(i, q.correct);
      expect(result.correct).toBe(true);
      expect(result.correctAnswer).toBe(q.correct);
    });
  });

  it('returns correct=false for wrong answers', () => {
    const result = scoreQuizAnswer(0, 0); // correct answer for q0 is 2
    expect(result.correct).toBe(false);
    expect(result.correctAnswer).toBe(2);
  });

  it('returns null for out-of-bounds question index', () => {
    expect(scoreQuizAnswer(99, 0)).toBeNull();
    expect(scoreQuizAnswer(-1, 0)).toBeNull();
  });
});

describe('computeQuizFinalMessage', () => {
  it('returns high-score message for 80%+', () => {
    const { pct, msg } = computeQuizFinalMessage(6, 7);
    expect(pct).toBe(86);
    expect(msg).toContain('see through the machine');
  });

  it('returns mid-score message for 50-79%', () => {
    const { pct, msg } = computeQuizFinalMessage(4, 7);
    expect(pct).toBe(57);
    expect(msg).toContain('starting to see it');
  });

  it('returns low-score message for below 50%', () => {
    const { pct, msg } = computeQuizFinalMessage(2, 7);
    expect(pct).toBe(29);
    expect(msg).toContain('designed to be hard to see');
  });

  it('handles perfect score', () => {
    const { pct, msg } = computeQuizFinalMessage(7, 7);
    expect(pct).toBe(100);
    expect(msg).toContain('see through the machine');
  });

  it('handles zero score', () => {
    const { pct, msg } = computeQuizFinalMessage(0, 7);
    expect(pct).toBe(0);
    expect(msg).toContain('designed to be hard to see');
  });

  it('boundary: exactly 50%', () => {
    const { pct, msg } = computeQuizFinalMessage(5, 10);
    expect(pct).toBe(50);
    expect(msg).toContain('starting to see it');
  });

  it('boundary: exactly 80%', () => {
    const { pct, msg } = computeQuizFinalMessage(8, 10);
    expect(pct).toBe(80);
    expect(msg).toContain('see through the machine');
  });
});
