import type { Question } from '../types';
import { checkAnswer } from '../utils/math';

interface ScorePanelProps {
  questions: Question[];
  userAnswers: string[];
  score: number;
  timeTaken: number;
  onReset: () => void;
  timeExpired?: boolean;
}

export function ScorePanel({ questions, userAnswers, score, timeTaken, onReset, timeExpired }: ScorePanelProps) {
  const scorePercentage = Math.round((score / questions.length) * 100);
  const answeredCount = userAnswers.filter(answer => answer.trim() !== '').length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="score-panel card shadow-sm p-4">
      <h2 className="card-title text-center mb-4">
        {timeExpired ? "Time Expired! 🕒" : "Test Complete! 🎉"}
      </h2>
      <div className="score-summary mb-3">
        <p className="score-percentage h3">
          Your score: 
          <span className={`fw-bold ${score === questions.length ? 'text-success' : 'text-primary'}`}> 
            {scorePercentage}%
          </span>
        </p>
        <p className="score-details text-muted">
          (<span className="fw-bold">Total: {questions.length}</span>, 
          <span className="text-success fw-bold">Correct: {score}</span>, 
          <span className="text-danger fw-bold">Wrong: {answeredCount - score}</span>
          {unansweredCount > 0 && 
            <span className="text-warning fw-bold">, Unanswered: {unansweredCount}</span>
          })
        </p>
        <p className="score-time text-info">
          <i className="bi bi-clock"></i> Time taken: {timeTaken} seconds
        </p>
      </div>
      <h4 className="mt-4 mb-3">Review Your Answers:</h4>
      <div className="review-list list-group">
        {questions.map((q, i) => {
          const userAnswer = userAnswers[i];
          const isAnswered = userAnswer.trim() !== '';
          const isCorrect = checkAnswer(userAnswer, q.answer);
          
          return (
            <div key={i} className={`review-item list-group-item ${
              !isAnswered ? 'list-group-item-warning' : 
              isCorrect ? 'list-group-item-success' : 
              'list-group-item-danger'
            }`}> 
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1 review-q">Q{i+1}: {q.question}</h5>
                <small>
                  <span className={`badge ${
                    !isAnswered ? 'bg-warning' : 
                    isCorrect ? 'bg-success' : 
                    'bg-danger'
                  }`}> 
                    {!isAnswered ? 'Unanswered' : isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </small>
              </div>
              <p className="mb-1 review-a">
                Your answer: {userAnswer || '-'}
                <span className="ms-3 text-muted">
                  <i className="bi bi-clock"></i> {q.timeSpent || 0}s
                </span>
              </p>
            </div>
          );
        })}
      </div>
      <button onClick={onReset} className="btn btn-lg btn-primary w-100 mt-4">
        Try Again
      </button>
    </div>
  );
}