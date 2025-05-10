import type { TestConfig } from '../types';
import { TEST_TYPES, DIGIT_OPTIONS } from '../constants';

interface ConfigPanelProps {
  config: TestConfig;
  onConfigChange: (key: keyof TestConfig, value: number | string) => void;
  onStartTest: () => void;
}

export function ConfigPanel({ config, onConfigChange, onStartTest }: ConfigPanelProps) {
  return (
    <div className="config-panel">
      <div>
        <label htmlFor="testType" style={{ fontSize: '1.25em', fontWeight: 600 }}>Test Type: </label>
        <select 
          id="testType"
          value={config.testType} 
          onChange={e => onConfigChange('testType', e.target.value)}
          style={{ fontSize: '1.25em', height: '2.5em', width: '70%', maxWidth: 300 }}
          aria-label="Test Type"
        >
          {TEST_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="digits" style={{ fontSize: '1.25em', fontWeight: 600 }}>Number of Digits: </label>
        <select 
          id="digits"
          value={config.digits} 
          onChange={e => onConfigChange('digits', Number(e.target.value))}
          style={{ fontSize: '1.25em', height: '2.5em', width: '70%', maxWidth: 300 }}
          aria-label="Number of Digits"
        >
          {DIGIT_OPTIONS.map(d => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="numQuestions" style={{ fontSize: '1.25em', fontWeight: 600 }}>Number of Questions: </label>
        <input 
          id="numQuestions"
          type="number" 
          min={1} 
          max={50} 
          value={config.numQuestions} 
          onChange={e => onConfigChange('numQuestions', Number(e.target.value))}
          style={{ fontSize: '1.25em', height: '2.5em', width: '70%', maxWidth: 300, background: '#fff', color: '#222' }}
          aria-label="Number of Questions"
        />
      </div>
      <div>
        <label htmlFor="timeLimit" style={{ fontSize: '1.25em', fontWeight: 600 }}>Time Limit (seconds): </label>
        <input 
          id="timeLimit"
          type="number" 
          min={10} 
          max={600} 
          value={config.timeLimit} 
          onChange={e => onConfigChange('timeLimit', Number(e.target.value))}
          style={{ fontSize: '1.25em', height: '2.5em', width: '70%', maxWidth: 300, background: '#fff', color: '#222' }}
          aria-label="Time Limit in Seconds"
        />
      </div>
      <button onClick={onStartTest}>Start Test</button>
    </div>
  );
}
