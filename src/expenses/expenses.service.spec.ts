import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { MockType } from 'src/utils/testing/types';
import { Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { ExpensesService } from './expenses.service';

const expenseRepositoryMockFactory: () => MockType<Repository<Expense>> =
  jest.fn(() => ({
    findOne: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
    find: jest.fn((entity) => entity),
    merge: jest.fn((entity) => entity),
    remove: jest.fn((entity) => entity),
  }));

describe('ExpensesService', () => {
  let service: ExpensesService;
  let repositoryMock: MockType<Repository<Expense>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: getRepositoryToken(Expense),
          useFactory: expenseRepositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    repositoryMock = module.get(getRepositoryToken(Expense));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should successfully create an expense', async () => {
    const mockExpense = {
      description: 'random',
      date: new Date(),
      value: 10,
    };
    const mockUser = {
      id: 1,
    } as User;
    const expense = await service.create(mockExpense, mockUser);
    expect(expense.description).toEqual(mockExpense.description);
    expect(expense.user).toEqual(mockUser);
  });

  it('Should successfully find an expense', async () => {
    const mockExpenseId = 1;
    const mockUser = {
      id: 1,
    } as User;
    repositoryMock.findOne.mockReturnValueOnce({ id: mockExpenseId });
    const expense = await service.findOne(mockExpenseId, mockUser);
    expect(expense.id).toEqual(mockExpenseId);
  });

  it('Should return null if expense is not found', async () => {
    const mockExpenseId = 1;
    const mockUser = {
      id: 1,
    } as User;
    repositoryMock.findOne.mockReturnValueOnce(null);
    const expense = await service.findOne(mockExpenseId, mockUser);
    expect(expense).toBeNull();
  });
});
