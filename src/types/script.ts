import { BlueprintData } from './blueprint';
import { IExecutionTree } from '@nyariv/sandboxjs/dist/node/parser';

export interface Script {
  source: string,
  compiled: string | IExecutionTree,
  blueprint: BlueprintData,
  isCorrect: boolean
}