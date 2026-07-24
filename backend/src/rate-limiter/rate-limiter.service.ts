import { Injectable, OnModuleInit } from "@nestjs/common";
import { createClient } from 'redis';

@Injectable()
export class RateLimiterService implements OnModuleInit {
    private client = createClient({ url: process.env.REDIS_URL});
    
    async onModuleInit() {
        await this.client.connect();
    }
    
    async checkLimit(key: string, maxAttempts: number, windowSeconds: number): Promise<boolean> {
        const attempts = await this.client.incr(key);

        if (attempts === 1) {
            await this.client.expire(key, windowSeconds);
        }

        return attempts <= maxAttempts;
    }

    async resetLimit(key: string) : Promise<void> {
        await this.client.del(key);
    }
}