import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { Expense } from './expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense) private readonly repository: Repository<Expense>,
  ) {}

  async create(expenseDto: CreateExpenseDto, user: User) {
    const expense = this.repository.create(expenseDto);
    expense.user = user;
    return this.repository.save(expense);
  }

  async findAll(user: User) {
    return this.repository.find({ where: { user } });
  }

  async findOne(id: number, user: User) {
    if (!id) return null;
    return this.repository.findOne({ where: { id, user } });
  }

  async update(id: number, expenseDto: CreateExpenseDto, user: User) {
    const expense = await this.findOne(id, user);
    if (!expense) return null;
    this.repository.merge(expense, expenseDto);
    return this.repository.save(expense);
  }

  async remove(id: number, user: User) {
    const expense = await this.findOne(id, user);
    if (!expense) return null;
    return this.repository.remove(expense);
  }
}
