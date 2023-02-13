import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filtered = users.filter((user) => user.email === email);
        return Promise.resolve(filtered);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('Should successfully create an user with encrypted password', async () => {
    const user = await service.signup('random@email.com', 'password');
    expect(user.password).not.toEqual('password');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('Signup should throw if email is already in use', async () => {
    await service.signup('random@email.com', 'password');
    await expect(
      service.signup('random@email.com', 'password'),
    ).rejects.toThrow(BadRequestException);
  });

  it('Signin should throw if user is not registered', async () => {
    await expect(
      service.signin('random@email.com', 'password'),
    ).rejects.toThrow(NotFoundException);
  });

  it('Signin should throw if an invalid password is provided', async () => {
    await service.signup('random@email.com', 'password');
    await expect(
      service.signin('random@email.com', 'wrongPassword'),
    ).rejects.toThrow(BadRequestException);
  });

  it('Signin should return a user if correct password is provided', async () => {
    await service.signup('random@email.com', 'password');
    const user = await service.signin('random@email.com', 'password');
    expect(user).toBeDefined();
  });
});
