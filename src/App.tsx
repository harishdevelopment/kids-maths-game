import { useState, useEffect, useRef } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ConfigPanel } from './components/ConfigPanel';
import { NumberPad } from './components/NumberPad';
import { ScorePanel } from './components/ScorePanel';
import { UIControls } from './components/UIControls';
import { generateQuestions } from './utils/math';
import { useDeviceType } from './utils/useDeviceType';
import type { Question, TestType, TestConfig } from './types';

function App() {
  const { isMobile, isTablet } = useDeviceType();
  const [uiScale, setUIScale] = useState(1);
  const [config, setConfig] = useState<TestConfig>({
    testType: 'addition',
    digits: 2,
    numQuestions: 10,
    timeLimit: 60
  });

  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [timer, setTimer] = useState(config.timeLimit);
  const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [timeTaken, setTimeTaken] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  // Refs to hold latest values
  const latestUserAnswersRef = useRef<string[]>([]);
  const latestTimerRef = useRef(timer);
  const latestCurrentRef = useRef(current);
  const latestInputValueRef = useRef(inputValue);
  const runningScoreRef = useRef(0);
  const questionsRef = useRef<Question[]>([]);
  const justNavigatedRef = useRef(false); // Add this ref to track navigation state

  // Keep refs up to date
  useEffect(() => {
    latestTimerRef.current = timer;
  }, [timer]);

  useEffect(() => {
    latestCurrentRef.current = current;
  }, [current]);

  useEffect(() => {
    latestInputValueRef.current = inputValue;
  }, [inputValue]);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  const handleConfigChange = (key: keyof TestConfig, value: number | string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    if (key === 'timeLimit') {
      setTimer(Number(value));
    }
  };

  const startTest = () => {
    const qs = generateQuestions(config.testType as TestType, config.digits, config.numQuestions);

    if (qs.length < config.numQuestions) {
      window.alert(
        `Only ${qs.length} unique questions could be generated for the current settings, so the test will use ${qs.length} questions instead of ${config.numQuestions}.`
      );
    }
    setQuestions(qs);
    questionsRef.current = qs; // Ensure ref is updated immediately
    const initialUserAnswers = Array(config.numQuestions).fill('');
    setUserAnswers(initialUserAnswers);
    latestUserAnswersRef.current = initialUserAnswers;
    runningScoreRef.current = 0;

    setCurrent(0);
    setScore(null);
    setTimer(config.timeLimit);
    setStarted(true);
    setInputValue('');
    setTimeTaken(null);
    setQuestionStartTime(Date.now()); // Initialize the start time when test begins

    if (intervalId) clearInterval(intervalId);

    const id = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(id);
          setIntervalId(null);

          let answersAtTimeout = [...latestUserAnswersRef.current];
          const currentQuestionIndex = latestCurrentRef.current;
          const currentInputValue = latestInputValueRef.current.trim();
          const currentQuestions = questionsRef.current;

          // Only save the answer if there's a valid question and the answer has changed
          if (currentInputValue !== '' && 
              currentQuestionIndex < currentQuestions.length &&
              currentInputValue !== answersAtTimeout[currentQuestionIndex]) {
            answersAtTimeout[currentQuestionIndex] = currentInputValue;
            // Update score if the answer is correct
            if (Number(currentInputValue) === currentQuestions[currentQuestionIndex].answer) {
              runningScoreRef.current++;
            }
          }
          
          finishTest(answersAtTimeout, true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    setIntervalId(id);
  };

  const handleAnswer = (val: string) => {
    // Simple input handling - just update both state and ref
    setInputValue(val);
    latestInputValueRef.current = val;
  };

  const saveCurrentAnswer = () => {
    const currentInputValue = latestInputValueRef.current.trim();
    const currentIndex = latestCurrentRef.current;
    
    // Only save if the answer has changed
    if (currentInputValue !== '' && currentInputValue !== latestUserAnswersRef.current[currentIndex]) {
      const nextUserAnswers = [...latestUserAnswersRef.current];
      nextUserAnswers[currentIndex] = currentInputValue;
      setUserAnswers(nextUserAnswers);
      latestUserAnswersRef.current = nextUserAnswers;
    }
  };

  const updateQuestionTime = () => {
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000); // Convert to seconds
    const updatedQuestions = [...questions];
    updatedQuestions[current] = {
      ...updatedQuestions[current],
      timeSpent: timeSpent
    };
    setQuestions(updatedQuestions);
  };

  const enterAnswer = () => {
    // Save time spent on current question
    updateQuestionTime();
    
    // Save current answer if any
    saveCurrentAnswer();

    // Clear input and move to next question
    setInputValue('');
    if (current < questions.length - 1) {
      const nextIndex = current + 1;
      setCurrent(nextIndex);
      setQuestionStartTime(Date.now());
      // Show previous answer for next question if it exists
      setInputValue(latestUserAnswersRef.current[nextIndex] || '');
    } else {
      // If we're at the last question, finish the test
      const finalAnswers = [...latestUserAnswersRef.current];
      finishTest(finalAnswers, false);
    }
  };

  const handleManualFinish = () => {
    // Save the current answer before finishing
    const currentInputValue = latestInputValueRef.current.trim();
    if (currentInputValue !== '') {
      const nextUserAnswers = [...latestUserAnswersRef.current];
      nextUserAnswers[current] = currentInputValue;
      setUserAnswers(nextUserAnswers);
      latestUserAnswersRef.current = nextUserAnswers;
    }
    
    finishTest(latestUserAnswersRef.current, false);
  };

  const finishTest = (answers: string[], timedOut: boolean) => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    // Get latest questions from ref
    const currentQuestions = questionsRef.current;
    
    // Calculate final score by checking each answer
    const finalScore = answers.reduce((score, answer, index) => {
      if (!currentQuestions[index]) return score; // Guard against missing question
      return score + (answer.trim() !== '' && Number(answer) === currentQuestions[index].answer ? 1 : 0);
    }, 0);

    setScore(finalScore);
    setStarted(false);
    setTimeTaken(timedOut ? config.timeLimit : config.timeLimit - latestTimerRef.current);
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      // Save time spent on current question
      updateQuestionTime();
      
      // Save current answer before navigating
      const currentInputValue = latestInputValueRef.current.trim();
      if (currentInputValue !== '') {
        const nextUserAnswers = [...latestUserAnswersRef.current];
        nextUserAnswers[current] = currentInputValue;
        setUserAnswers(nextUserAnswers);
        latestUserAnswersRef.current = nextUserAnswers;
      }

      // Navigate to new question and restore its previous answer
      setCurrent(index);
      const previousAnswer = latestUserAnswersRef.current[index] || '';
      setInputValue(previousAnswer);
      latestInputValueRef.current = previousAnswer;
      setQuestionStartTime(Date.now());
      justNavigatedRef.current = false; // Don't need navigation flag anymore
    }
  };

  const reset = () => {
    setStarted(false);
    setScore(null);
    setQuestions([]);
    setUserAnswers([]);
    setCurrent(0);
    setTimer(config.timeLimit);
    setInputValue('');
    setQuestionStartTime(Date.now());  // Reset the question start time
    runningScoreRef.current = 0;
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const handleSizeChange = (scale: number) => {
    setUIScale(scale);
    // Save preference to localStorage
    localStorage.setItem('uiScale', String(scale));
  };

  // Load saved UI scale preference
  useEffect(() => {
    const savedScale = localStorage.getItem('uiScale');
    if (savedScale) {
      setUIScale(Number(savedScale));
    }
  }, []);

  return (
    <div className={`maths-app ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}`} 
      style={{
        fontSize: `${1.4 * uiScale}em`,
        padding: `${isMobile ? '1vw' : isTablet ? '1.5vw' : '2vw'}`
      }}>
      <div className="app-header d-flex justify-content-center align-items-center mb-4">
        <h1 style={{ fontSize: '2.2em' }}>Kids Maths Test</h1>
      </div>
      {!started && score === null && (
        <ConfigPanel 
          config={config}
          onConfigChange={handleConfigChange}
          onStartTest={startTest}
        />
      )}
      {started && (
        <div className="test-panel">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="timer">Time : {timer}s</div>
            <button
              className="btn btn-outline-danger"
              onClick={handleManualFinish}
            >
              Finish Test
            </button>
          </div>
          <div className="mb-3">
            <div className="progress">
              <div 
                className="progress-bar" 
                role="progressbar" 
                style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                aria-valuenow={(current + 1)}
                aria-valuemin={0}
                aria-valuemax={questions.length}
              >
                Question {current + 1} of {questions.length}
              </div>
            </div>
          </div>
          <div className="question mb-4">
            <h2>{questions[current].question} = </h2>
            <div className="answer-box">
              <input
                type="text"
                className="answer-input"
                value={inputValue}
                readOnly
                aria-label="Your answer"
              />
            </div>
          </div>
          <NumberPad
            inputValue={inputValue}
            onNumberClick={handleAnswer}
            onEnter={enterAnswer}
          />
          <div className="nav-buttons mt-4 mb-3 d-flex justify-content-between">
            <button 
              className="btn btn-secondary"
              onClick={() => goToQuestion(current - 1)}
              disabled={current === 0}
            >
              <i className="bi bi-arrow-left"></i> Previous
            </button>
            <UIControls onSizeChange={handleSizeChange} />
            <button 
              className="btn btn-secondary"
              onClick={() => goToQuestion(current + 1)}
              disabled={current === questions.length - 1}
            >
              Next <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      )}
      {!started && score !== null && (
        <div className="mb-4">
          <button 
            className="btn btn-lg btn-primary w-100 mt-4"
            onClick={reset}
          >
            Try Again
          </button>
        </div>
      )}
      {score !== null && (
        <ScorePanel
          questions={questions}
          userAnswers={userAnswers}
          score={score}
          timeTaken={timeTaken ?? 0}
          onReset={reset}
          timeExpired={timer === 0}
        />
      )}
    </div>
  );
}

export default App;
