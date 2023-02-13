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
  const mockUser = {
    id: 1,
    email: 'random@email.com',
    password: 'randomPassword',
  };

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
    const user = await service.create(mockUser.email, mockUser.password);
    expect(user.email).toEqual(mockUser.email);
  });

  it('Should successfully find an user', async () => {
    repositoryMock.findOne.mockReturnValueOnce({ id: mockUser.id });
    const user = await service.findOne(mockUser.id);
    expect(user.id).toEqual(mockUser.id);
  });

  it('Should return null if user is not found', async () => {
    repositoryMock.findOne.mockReturnValueOnce(null);
    const user = await service.findOne(mockUser.id);
    expect(user).toBeNull();
  });

  it('Should successfully find an user by email', async () => {
    repositoryMock.find.mockReturnValueOnce([{ email: mockUser.email }]);
    const user = await service.find(mockUser.email);
    expect(user[0].email).toEqual(mockUser.email);
  });
});
