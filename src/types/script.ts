import { Instruction } from '@bardsballad/verse';

export interface Script {
  source: string,
  compiled: string | Instruction[],
  isCorrect: boolean
}