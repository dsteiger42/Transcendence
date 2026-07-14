import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
  
  @IsNumber()
  wallet: number;

  @IsString()
  avatar: string;

  wins: number;
  losses: number;
  createdAt: Date;
  updatedAt: Date;

}
