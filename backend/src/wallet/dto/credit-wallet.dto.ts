import { IsInt, Max, Min } from 'class-validator';

export class CreditWalletDto {
    // Same limits as the "Add funds" window (frontend/src/api/wallet.js).
    // Without a maximum, an amount too big for the Int column User.wallet
    // made the server answer 500 instead of 400.
    @IsInt()
    @Min(10)
    @Max(50000)
    amount: number;
}
