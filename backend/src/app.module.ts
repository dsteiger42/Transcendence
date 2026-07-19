import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ForumModule } from './forum/forum.module';
import { ModerationModule } from './moderation/moderation.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ForumModule,
    ModerationModule,
	AuthModule,
	HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
