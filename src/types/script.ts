import { BlueprintData } from './blueprint';

export interface Script {
  source: string,
  compiled: string,
  blueprint: BlueprintData,
  isCorrect: boolean
}