import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { MockType } from '../utils/testing/types';
import { Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { ExpensesService } from './expenses.service';
import { MailService } from '../mail/mail.service';

describe('ExpensesService', () => {
  let service: ExpensesService;
  let repositoryMock: MockType<Repository<Expense>>;
  let mailServiceMock: Partial<MailService>;

  const mockUserObj = {
    id: 1,
    email: 'random@email.com',
    password: '123456',
    expenses: [],
  };
  const mockExpenseObj = {
    id: 1,
    description: 'test',
    date: new Date(),
    value: 10,
    user: mockUserObj,
  };

  const expenseRepositoryMockFactory: () => MockType<Repository<Expense>> =
    jest.fn(() => ({
      findOne: jest.fn((entity) => entity),
      create: jest.fn((entity) => entity),
      save: jest.fn((entity) => entity),
      find: jest.fn((entity) => entity),
      merge: jest.fn((entity) => entity),
      remove: jest.fn((entity) => entity),
    }));

  beforeEach(async () => {
    mailServiceMock = {
      sendUserConfirmation: () => Promise.resolve(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: getRepositoryToken(Expense),
          useFactory: expenseRepositoryMockFactory,
        },
        {
          provide: MailService,
          useValue: mailServiceMock,
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
    const expense = await service.create(mockExpenseObj, mockUserObj);
    expect(expense.description).toEqual(mockExpenseObj.description);
    expect(expense.user).toEqual(mockUserObj);
  });

  it('Should successfully find an expense', async () => {
    repositoryMock.findOne.mockReturnValueOnce({ id: mockExpenseObj.id });
    const expense = await service.findOne(mockExpenseObj.id, mockUserObj);
    expect(expense.id).toEqual(mockExpenseObj.id);
  });

  it('Should return null if expense is not found', async () => {
    repositoryMock.findOne.mockReturnValueOnce(null);
    const expense = await service.findOne(mockExpenseObj.id, mockUserObj);
    expect(expense).toBeNull();
  });
});
