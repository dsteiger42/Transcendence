import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AnalyzeTextDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  text: string;
}
