import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { ExpenseDto } from './dtos/expense.dto';
import { ExpensesService } from './expenses.service';

@Serialize(ExpenseDto)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() body: CreateExpenseDto, @CurrentUser() user: User) {
    return this.expensesService.create(body, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@CurrentUser() user: User) {
    return this.expensesService.findAll(user);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.expensesService.findOne(parseInt(id), user);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() body: CreateExpenseDto,
    @CurrentUser() user: User,
  ) {
    return this.expensesService.update(parseInt(id), body, user);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.expensesService.remove(parseInt(id), user);
  }
}
