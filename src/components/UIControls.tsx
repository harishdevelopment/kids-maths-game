import { useState, useRef, useEffect } from 'react';

interface UIControlsProps {
  onSizeChange: (scale: number) => void;
}

export function UIControls({ onSizeChange }: UIControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sizeOptions = [
    { label: 'Small', scale: 0.8 },
    { label: 'Normal', scale: 1 },
    { label: 'Large', scale: 1.2 },
    { label: 'Extra Large', scale: 1.4 }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div 
      className="ui-controls dropdown"
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      <button 
        className="btn btn-outline-secondary d-flex align-items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="UI Size Controls"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <i className="bi bi-display" aria-hidden="true"></i>
        <span>UI Size</span>
      </button>
      {isOpen && (
        <div 
          className="dropdown-menu show" 
          role="menu"
          aria-label="UI size options"
        >
          {sizeOptions.map(option => (
            <button
              key={option.label}
              className="dropdown-item"
              role="menuitem"
              onClick={() => {
                onSizeChange(option.scale);
                setIsOpen(false);
              }}
              tabIndex={isOpen ? 0 : -1}
            >
              <i 
                className={`bi bi-${option.scale === 1 ? 'check' : 'circle'} me-2`}
                aria-hidden="true"
              ></i>
              {option.label}
            </button>
          ))}
          <div className="dropdown-divider"></div>
          <button
            className="dropdown-item text-primary"
            role="menuitem"
            onClick={() => {
              onSizeChange(1);
              setIsOpen(false);
            }}
            tabIndex={isOpen ? 0 : -1}
          >
            <i className="bi bi-arrow-counterclockwise me-2" aria-hidden="true"></i>
            Reset to Default
          </button>
        </div>
      )}
    </div>
  );
}
