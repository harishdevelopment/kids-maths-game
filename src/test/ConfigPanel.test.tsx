import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfigPanel } from '../components/ConfigPanel';
import { TEST_TYPES, DIGIT_OPTIONS } from '../constants';
import type { TestConfig } from '../types';

describe('ConfigPanel', () => {
  const defaultConfig: TestConfig = {
    testType: 'addition' as const,
    digits: 2,
    numQuestions: 10,
    timeLimit: 60,
  };

  const defaultProps = {
    config: defaultConfig,
    onConfigChange: vi.fn(),
    onStartTest: vi.fn(),
  };

  it('renders all configuration options', () => {
    render(<ConfigPanel {...defaultProps} />);
    
    expect(screen.getByLabelText(/Test Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of Digits/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of Questions/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Time Limit/i)).toBeInTheDocument();
    expect(screen.getByText('Start Test')).toBeInTheDocument();
  });

  it('displays all test types', () => {
    render(<ConfigPanel {...defaultProps} />);
    const select = screen.getByLabelText(/Test Type/i);
    
    TEST_TYPES.forEach(type => {
      expect(select).toContainHTML(type.label);
    });
  });

  it('displays all digit options', () => {
    render(<ConfigPanel {...defaultProps} />);
    const select = screen.getByLabelText(/Number of Digits/i);
    
    DIGIT_OPTIONS.forEach(option => {
      expect(select).toContainHTML(option.label);
    });
  });

  it('calls onConfigChange when test type changes', () => {
    render(<ConfigPanel {...defaultProps} />);
    const select = screen.getByLabelText(/Test Type/i);
    
    fireEvent.change(select, { target: { value: 'multiplication' } });
    expect(defaultProps.onConfigChange).toHaveBeenCalledWith('testType', 'multiplication');
  });

  it('calls onStartTest when start button is clicked', () => {
    render(<ConfigPanel {...defaultProps} />);
    const button = screen.getByText('Start Test');
    
    fireEvent.click(button);
    expect(defaultProps.onStartTest).toHaveBeenCalled();
  });
});
