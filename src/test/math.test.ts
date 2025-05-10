import { describe, it, expect } from 'vitest';
import { getRandomNumber, generateQuestion, checkAnswer, calculateScore } from '../utils/math';

describe('Math Utils', () => {
  describe('getRandomNumber', () => {
    it('generates a number with correct number of digits', () => {
      const oneDigit = getRandomNumber(1);
      expect(oneDigit).toBeGreaterThanOrEqual(1);
      expect(oneDigit).toBeLessThanOrEqual(9);

      const twoDigits = getRandomNumber(2);
      expect(twoDigits).toBeGreaterThanOrEqual(10);
      expect(twoDigits).toBeLessThanOrEqual(99);
    });
  });

  describe('generateQuestion', () => {
    it('generates addition questions correctly', () => {
      const question = generateQuestion('addition', 1);
      expect(question.question).toMatch(/^\d+\s\+\s\d+$/);
      const [a, b] = question.question.split(' + ').map(Number);
      expect(question.answer).toBe(a + b);
    });

    it('generates subtraction questions with positive answers', () => {
      const question = generateQuestion('subtraction', 1);
      expect(question.question).toMatch(/^\d+\s-\s\d+$/);
      const [a, b] = question.question.split(' - ').map(Number);
      expect(a).toBeGreaterThanOrEqual(b);
      expect(question.answer).toBe(a - b);
    });

    it('generates multiplication questions correctly', () => {
      const question = generateQuestion('multiplication', 1);
      expect(question.question).toMatch(/^\d+\s×\s\d+$/);
      const [a, b] = question.question.split(' × ').map(Number);
      expect(question.answer).toBe(a * b);
    });

    it('generates division questions with whole number answers', () => {
      const question = generateQuestion('division', 1);
      expect(question.question).toMatch(/^\d+\s÷\s\d+$/);
      const [a, b] = question.question.split(' ÷ ').map(Number);
      expect(b).not.toBe(0);
      expect(question.answer).toBe(a / b);
      expect(Number.isInteger(question.answer)).toBe(true);
    });
  });

  describe('checkAnswer', () => {
    it('correctly validates answers', () => {
      expect(checkAnswer('42', 42)).toBe(true);
      expect(checkAnswer('42.0', 42)).toBe(true);
      expect(checkAnswer('41', 42)).toBe(false);
      expect(checkAnswer('', 42)).toBe(false);
      expect(checkAnswer(' ', 42)).toBe(false);
    });
  });

  describe('calculateScore', () => {
    it('calculates score correctly', () => {
      const questions = [
        { question: '1 + 1', answer: 2 },
        { question: '2 + 2', answer: 4 },
        { question: '3 + 3', answer: 6 },
      ];
      const userAnswers = ['2', '4', '5'];
      expect(calculateScore(userAnswers, questions)).toBe(2);
    });

    it('handles empty answers', () => {
      const questions = [
        { question: '1 + 1', answer: 2 },
        { question: '2 + 2', answer: 4 },
      ];
      const userAnswers = ['2', ''];
      expect(calculateScore(userAnswers, questions)).toBe(1);
    });
  });
});
