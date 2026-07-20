import {
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import type { ModerationEngine } from './moderation-engine.interface';
import type { ModerationResult } from '../moderation.types';

@Injectable()
export class LlmModerationEngine
  implements ModerationEngine
{
  analyzeText(_text: string): ModerationResult {
    throw new NotImplementedException(
      'LLM moderation engine is not implemented yet',
    );
  }
}
