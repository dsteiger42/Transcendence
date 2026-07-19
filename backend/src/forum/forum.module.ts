import { Module } from '@nestjs/common';
import { ForumController } from './forum.controller';
import { ForumService } from './forum.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ModerationModule } from '../moderation/moderation.module';

@Module({
  imports: [PrismaModule, ModerationModule],
  controllers: [ForumController],
  providers: [ForumService],
})
export class ForumModule {}
