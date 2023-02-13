import { Expose } from 'class-transformer';

export class ExpenseDto {
  @Expose()
  id: number;

  @Expose()
  description: string;

  @Expose()
  date: Date;

  @Expose()
  value: number;
}
