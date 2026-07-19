import { ModerationResult } from '../moderation.types';

export interface ModerationEngine {
  analyzeText(text: string): ModerationResult;
}
