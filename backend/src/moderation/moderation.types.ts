export type ModerationDecision =
  | 'approved'
  | 'flagged'
  | 'rejected';

export type ModerationResult = {
  decision: ModerationDecision;
  score: number;
  reasons: string[];
};
