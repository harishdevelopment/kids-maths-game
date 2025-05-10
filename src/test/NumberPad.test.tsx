import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NumberPad } from '../components/NumberPad';

describe('NumberPad', () => {
  const defaultProps = {
    inputValue: '',
    onNumberClick: vi.fn(),
    onEnter: vi.fn(),
  };

  it('renders all number buttons', () => {
    render(<NumberPad {...defaultProps} />);
    
    // Check numbers 0-9
    for (let i = 0; i <= 9; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
    
    // Check special buttons
    expect(screen.getByText('⌫')).toBeInTheDocument();
    expect(screen.getByText('Enter')).toBeInTheDocument();
  });

  it('calls onNumberClick with correct value when number buttons are clicked', () => {
    render(<NumberPad {...defaultProps} />);
    
    fireEvent.click(screen.getByText('5'));
    expect(defaultProps.onNumberClick).toHaveBeenCalledWith('5');
  });

  it('calls onEnter when enter button is clicked', () => {
    render(<NumberPad {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Enter'));
    expect(defaultProps.onEnter).toHaveBeenCalled();
  });

  it('handles backspace correctly', () => {
    const props = {
      ...defaultProps,
      inputValue: '123',
    };
    
    render(<NumberPad {...props} />);
    fireEvent.click(screen.getByText('⌫'));
    expect(defaultProps.onNumberClick).toHaveBeenCalledWith('12');
  });
});
