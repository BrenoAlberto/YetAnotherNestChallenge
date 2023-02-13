import {
  IsDate,
  IsPositive,
  IsString,
  MaxDate,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class UpdateExpenseDto {
  @IsString()
  @MaxLength(191)
  @IsOptional()
  description: string;

  @IsDate()
  @MaxDate(new Date())
  @IsOptional()
  date: Date;

  @IsPositive()
  @IsOptional()
  value: number;
}
