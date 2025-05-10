import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UIControls } from '../components/UIControls';

describe('UIControls', () => {
  const onSizeChange = vi.fn();

  beforeEach(() => {
    onSizeChange.mockReset();
  });

  it('renders UI size button with icon', () => {
    render(<UIControls onSizeChange={onSizeChange} />);
    const button = screen.getByRole('button', { name: /UI Size Controls/i });
    expect(button).toBeInTheDocument();
    expect(button.querySelector('.bi-display')).toBeInTheDocument();
  });

  it('shows size options when clicked', () => {
    render(<UIControls onSizeChange={onSizeChange} />);
    fireEvent.click(screen.getByRole('button', { name: /UI Size Controls/i }));
    
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Small' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Normal' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Large' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Extra Large' })).toBeInTheDocument();
  });

  it('calls onSizeChange with correct scale when option is selected', () => {
    render(<UIControls onSizeChange={onSizeChange} />);
    fireEvent.click(screen.getByRole('button', { name: /UI Size Controls/i }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Large' }));
    
    expect(onSizeChange).toHaveBeenCalledWith(1.2);
  });

  it('closes dropdown when clicking outside', () => {
    render(<UIControls onSizeChange={onSizeChange} />);
    fireEvent.click(screen.getByRole('button', { name: /UI Size Controls/i }));
    fireEvent.mouseDown(document.body);
    
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes dropdown when escape key is pressed', () => {
    render(<UIControls onSizeChange={onSizeChange} />);
    fireEvent.click(screen.getByRole('button', { name: /UI Size Controls/i }));
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('resets to default size when reset option is clicked', () => {
    render(<UIControls onSizeChange={onSizeChange} />);
    fireEvent.click(screen.getByRole('button', { name: /UI Size Controls/i }));
    fireEvent.click(screen.getByRole('menuitem', { name: /Reset to Default/i }));
    
    expect(onSizeChange).toHaveBeenCalledWith(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
