import { IsDate, IsPositive, MaxDate, MaxLength } from 'class-validator';
import { User } from '../users/user.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @MaxLength(191)
  description: string;

  @Column()
  @IsDate()
  @MaxDate(new Date())
  date: Date;

  @Column()
  @IsPositive()
  value: number;

  @ManyToOne(() => User, (user) => user.expenses)
  user: User;
}
