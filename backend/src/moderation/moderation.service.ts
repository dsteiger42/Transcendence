import { Inject, Injectable } from '@nestjs/common';
import type { ModerationEngine } from './engines/moderation-engine.interface';
import { MODERATION_ENGINE } from './engines/moderation-engine.token';
import type { ModerationResult } from './moderation.types';

@Injectable()
export class ModerationService {
  constructor(
    @Inject(MODERATION_ENGINE)
    private readonly moderationEngine: ModerationEngine,
  ) {}

  analyzeText(text: string): ModerationResult {
    return this.moderationEngine.analyzeText(text);
  }
}
