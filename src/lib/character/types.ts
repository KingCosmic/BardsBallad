import { Effect } from "@/db/character/schema";

export type Condition = {
  type: string;
  value: any;
  choiceId: number;
  level: number;
};

export type Collected = {
  source: string;
  effect: Effect;
};

export type ProgressionSource = {
  id: string;
  name: string;

  // how progression advances
  track: ProgressionTrack;
};

export type ProgressionTrack =
  | {
      type: "step-based"; // D&D levels, milestones, etc.
      steps: ProgressionStep[];
    }
  | {
      type: "point-based"; // point buy systems
      pool: {
        resource: string; // e.g. "points"
        max: number;
      };
      nodes: ProgressionNode[];
    };

export type ProgressionStep = {
  step: number; // level, tier, etc.

  grants?: Effect[];

  choices?: ChoiceGroup[];
};

export type ProgressionNode = {
  id: string;

  cost?: number;

  requires?: Requirement[];

  grants?: Effect[];

  choices?: ChoiceGroup[];
};

export type ChoiceGroup = {
  id: string;
  label: string;

  select: {
    min: number;
    max: number;
  };

  options: ChoiceOption[];
};

export type ChoiceOption = {
  id: string;
  label: string;

  requires?: Requirement[];

  grants?: Effect[];

  // optional nested progression (important for scaling features)
  progression?: ProgressionTrack;
};

export type Requirement =
  | { type: "step"; sourceId: string; min: number }
  | { type: "selection"; choiceGroupId: string; includes: string }
  | { type: "stat"; path: string; gte: number };
