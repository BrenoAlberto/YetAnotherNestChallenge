import { Type } from 'class-transformer';
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

  @Type(() => Date)
  @IsDate()
  @MaxDate(new Date())
  date: Date;

  @IsPositive()
  value: number;
}
