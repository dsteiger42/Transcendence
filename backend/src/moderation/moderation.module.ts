import { Module } from '@nestjs/common';
import { ModerationController } from './moderation.controller';
import { ModerationService } from './moderation.service';
import { RuleBasedModerationEngine } from './engines/rule-based-moderation.engine';
import { MODERATION_ENGINE } from './engines/moderation-engine.token';

@Module({
  providers: [
    ModerationService,
    {
      provide: MODERATION_ENGINE,
      useClass: RuleBasedModerationEngine,
    },
  ],
  controllers: [ModerationController],
  exports: [ModerationService],
})
export class ModerationModule {}
