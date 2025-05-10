import type { TestType, Question } from '../types';

export function getRandomNumber(digits: number): number {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateQuestion(type: TestType, digits: number): Question {
  let a = getRandomNumber(digits);
  let b = getRandomNumber(digits);
  
  if (type === 'subtraction' && b > a) [a, b] = [b, a];
  if (type === 'division') {
    b = getRandomNumber(digits);
    a = b * getRandomNumber(1);
    if (b === 0) b = 1;
  }

  let question = '';
  let answer = 0;
  
  switch (type) {
    case 'addition':
      question = `${a} + ${b}`;
      answer = a + b;
      break;
    case 'subtraction':
      question = `${a} - ${b}`;
      answer = a - b;
      break;
    case 'multiplication':
      question = `${a} × ${b}`;
      answer = a * b;
      break;
    case 'division':
      question = `${a} ÷ ${b}`;
      answer = a / b;
      break;
  }

  return { question, answer };
}

export function checkAnswer(userInput: string, correctAnswer: number): boolean {
  return userInput.trim() !== '' && Number(userInput) === correctAnswer;
}

export function calculateScore(userAnswers: string[], questions: Question[]): number {
  return questions.reduce((score, question, index) => {
    return score + (checkAnswer(userAnswers[index] || '', question.answer) ? 1 : 0);
  }, 0);
}
