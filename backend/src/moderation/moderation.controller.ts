import { Body, Controller, Post } from '@nestjs/common';
import { AnalyzeTextDto } from './dto/analyze-text.dto';
import { ModerationService } from './moderation.service';

@Controller('forum/moderation')
export class ModerationController {
  constructor(
    private readonly moderationService: ModerationService,
  ) {}

  @Post('analyze')
  analyzeText(@Body() analyzeTextDto: AnalyzeTextDto) {
    return this.moderationService.analyzeText(
      analyzeTextDto.text,
    );
  }
}
