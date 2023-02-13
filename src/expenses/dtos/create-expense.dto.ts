import {
  IsDate,
  IsPositive,
  IsString,
  MaxDate,
  MaxLength,
} from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  @MaxLength(191)
  description: string;

  @IsDate()
  @MaxDate(new Date())
  date: Date;

  @IsPositive()
  value: number;
}
