import type { TestTypeOption, DigitOption } from './types';

export const TEST_TYPES: TestTypeOption[] = [
  { label: 'Addition', value: 'addition' },
  { label: 'Subtraction', value: 'subtraction' },
  { label: 'Multiplication', value: 'multiplication' },
  { label: 'Division', value: 'division' },
];

export const DIGIT_OPTIONS: DigitOption[] = [
  { label: 'One-digit', value: 1 },
  { label: 'Two-digit', value: 2 },
  { label: 'Three-digit', value: 3 },
  { label: 'Four-digit', value: 4 },
];
