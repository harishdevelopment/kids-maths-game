interface NumberPadProps {
  inputValue: string;
  onNumberClick: (value: string) => void;
  onEnter: () => void;
}

export function NumberPad({ inputValue, onNumberClick, onEnter }: NumberPadProps) {
  const handleBackspace = () => onNumberClick(inputValue.slice(0, -1));
  
  return (
    <div className="number-pad">
      <div className="pad-row">
        {[1,2,3].map(n => (
          <button 
            key={n} 
            className="btn btn-lg btn-primary pad-btn" 
            onClick={() => onNumberClick(inputValue + n)}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="pad-row">
        {[4,5,6].map(n => (
          <button 
            key={n} 
            className="btn btn-lg btn-primary pad-btn" 
            onClick={() => onNumberClick(inputValue + n)}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="pad-row">
        {[7,8,9].map(n => (
          <button 
            key={n} 
            className="btn btn-lg btn-primary pad-btn" 
            onClick={() => onNumberClick(inputValue + n)}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="pad-row">
        <button 
          className="btn btn-lg btn-secondary pad-btn" 
          onClick={handleBackspace}
        >
          ⌫
        </button>
        <button 
          className="btn btn-lg btn-primary pad-btn" 
          onClick={() => onNumberClick(inputValue + '0')}
        >
          0
        </button>
        <button 
          className="btn btn-lg btn-success pad-btn enter-btn" 
          onClick={onEnter}
        >
          Enter
        </button>
      </div>
    </div>
  );
}
