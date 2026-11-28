import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { createClient } from 'redis';

@Injectable()
export class RateLimiterService implements OnModuleInit {
    private readonly logger = new Logger(RateLimiterService.name);
    private client = createClient({ url: process.env.REDIS_URL});

    // Automatically called by NestJS when the module is initialized
    async onModuleInit() {
        // Attach an error handler BEFORE connecting.
        // The node_redis client emits 'error' events on connection failures and
        // reconnection attempts. Without this handler, any error after the
        // initial connect() (e.g. Redis going down) would be an unhandled
        // EventEmitter exception and crash the Node.js process.
        this.client.on('error', (err: Error) =>
            this.logger.error(`Redis client error: ${err.message}`),
        );

        await this.client.connect();        // Establishes the connection to Redis
    }
    
    // Checks whether a key has exceeded its request limit within a time window
    async checkLimit(key: string, maxAttempts: number, windowSeconds: number): Promise<boolean> {

        const attempts = await this.client.incr(key);         // Redis INCR: atomically increments the counter (creates it with value 1 if absent)

        if (attempts === 1) {       // First request: starts the time window
            await this.client.expire(key, windowSeconds);       // Redis EXPIRE: sets the key's expiration time in seconds
        }

        return attempts <= maxAttempts;       // true: request allowed; false: limit exceeded
    }

    // Resets the rate limit for a specific key
    async resetLimit(key: string) : Promise<void> {
        await this.client.del(key);       // Redis DEL: removes the key and its counter
    }
}