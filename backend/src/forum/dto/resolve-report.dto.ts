import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class ResolveReportDto {
  @IsString()
  @IsIn(['dismiss', 'remove'])
  action: string;

  @IsInt()
  moderatorId: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
