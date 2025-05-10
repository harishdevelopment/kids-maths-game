import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScorePanel } from '../components/ScorePanel';

describe('ScorePanel', () => {
  const defaultProps = {
    questions: [
      { question: '1 + 1', answer: 2 },
      { question: '2 + 2', answer: 4 },
      { question: '3 + 3', answer: 6 },
    ],
    userAnswers: ['2', '3', ''],
    score: 1,
    timeTaken: 30,
    onReset: vi.fn(),
  };

  it('displays score summary correctly with unanswered questions', () => {
    render(<ScorePanel {...defaultProps} />);
    
    const scoreElement = screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'span' && content.includes('33%');
    });
    expect(scoreElement).toBeInTheDocument();
    
    expect(screen.getByText((content) => content.includes('Correct: 1'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('Wrong: 1'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('Unanswered: 1'))).toBeInTheDocument();
  });

  it('displays questions and their status correctly', () => {
    render(<ScorePanel {...defaultProps} />);
    
    // First question - correct
    expect(screen.getByText('Q1: 1 + 1')).toBeInTheDocument();
    expect(screen.getAllByText('Correct')[0]).toBeInTheDocument();
    
    // Second question - incorrect
    expect(screen.getByText('Q2: 2 + 2')).toBeInTheDocument();
    expect(screen.getByText('Incorrect')).toBeInTheDocument();
    
    // Third question - unanswered
    expect(screen.getByText('Q3: 3 + 3')).toBeInTheDocument();
    expect(screen.getByText('Unanswered')).toBeInTheDocument();
  });

  it('displays "Time Expired!" when test time is up', () => {
    render(<ScorePanel {...defaultProps} timeExpired={true} />);
    expect(screen.getByText('Time Expired! 🕒')).toBeInTheDocument();
  });

  it('displays "Test Complete!" when test is finished normally', () => {
    render(<ScorePanel {...defaultProps} timeExpired={false} />);
    expect(screen.getByText('Test Complete! 🎉')).toBeInTheDocument();
  });

  it('displays try again button', () => {
    render(<ScorePanel {...defaultProps} />);
    const tryAgainButton = screen.getByText('Try Again');
    expect(tryAgainButton).toHaveClass('btn', 'btn-primary');
  });
});
