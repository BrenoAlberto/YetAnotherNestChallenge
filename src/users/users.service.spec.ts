import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType } from '../utils/testing/types';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

const userRepositoryMockFactory: () => MockType<Repository<User>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
    find: jest.fn((entity) => entity),
  }),
);

describe('UsersService', () => {
  let service: UsersService;
  let repositoryMock: MockType<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: userRepositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repositoryMock = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should successfully create an user', async () => {
    const mockUser = { email: 'random@email.com' };
    const user = await service.create(mockUser.email, 'password');
    expect(user.email).toEqual(mockUser.email);
  });

  it('Should successfully find an user', async () => {
    const mockUserId = 1;
    repositoryMock.findOne.mockReturnValueOnce({ id: mockUserId });
    const user = await service.findOne(mockUserId);
    expect(user.id).toEqual(mockUserId);
  });

  it('Should return null if user is not found', async () => {
    const mockUserId = 1;
    repositoryMock.findOne.mockReturnValueOnce(null);
    const user = await service.findOne(mockUserId);
    expect(user).toBeNull();
  });

  it('Should successfully find an user by email', async () => {
    const mockUserEmail = 'random@email.com';
    repositoryMock.find.mockReturnValueOnce([{ email: mockUserEmail }]);
    const user = await service.find(mockUserEmail);
    expect(user[0].email).toEqual(mockUserEmail);
  });
});
