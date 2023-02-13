import { User } from '../users/user.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  date: Date;

  @Column()
  value: number;

  @ManyToOne(() => User, (user) => user.expenses)
  user: User;
}
