import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { PrismaModule } from '../prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
			PrismaModule,
			HttpModule,
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}