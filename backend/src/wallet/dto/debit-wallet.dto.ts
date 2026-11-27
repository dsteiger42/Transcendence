import { IsInt, Max, Min } from 'class-validator';

export class DebitWalletDto {
    // Without a maximum, an amount too big for the Int column User.wallet
    // made the server answer 500 instead of 400.
    @IsInt()
    @Min(1)
    @Max(50000)
    amount: number;
}
