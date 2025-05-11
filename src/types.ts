export type TestType = 'addition' | 'subtraction' | 'multiplication' | 'division';

export interface TestTypeOption {
  label: string;
  value: TestType;
}

export interface DigitOption {
  label: string;
  value: number;
}

export interface Question {
  question: string;
  answer: number;
  timeSpent?: number;  // Time spent on this question in seconds
}

export interface TestConfig {
  testType: TestType;
  digits: number;
  numQuestions: number;
  timeLimit: number;
}
