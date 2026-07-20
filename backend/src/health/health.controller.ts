import {
	Controller,
	Get,
	ServiceUnavailableException,
  } from '@nestjs/common';
  import { HealthService } from './health.service';
  
  @Controller('health')
  export class HealthController {
	constructor(
	  private readonly healthService: HealthService,
	) {}
  
	@Get()
	async check() {
	  try {
	    await this.healthService.checkDatabase();
	    await this.healthService.checkRedis();
		await this.healthService.checkVault();

	    return {
	      status: 'ok',
	      database: 'up',
	      redis: 'up',
		  vault: 'up',
		};
	  } catch {
	    throw new ServiceUnavailableException({
	      status: 'error',
	      database: 'down',
	      redis: 'down',
	    });
	  }
	}
	
  }