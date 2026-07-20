import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createClient } from 'redis';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService,
	private readonly http: HttpService,
  ) {}

  async checkDatabase() {
    await this.prisma.$queryRaw`SELECT 1`;
  }
  async checkRedis() {
    const client = createClient({
      url: process.env.REDIS_URL,
    });

    await client.connect();

    const pong = await client.ping();

    await client.disconnect();

    if (pong !== 'PONG') {
      throw new Error('Redis is down');
    }
   	}
  	async checkVault() {
  	  await firstValueFrom(
  	    this.http.get('http://vault:8200/v1/sys/health')
  	  );
  	}


}