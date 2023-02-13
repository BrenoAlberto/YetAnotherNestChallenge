import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersServiceMock: Partial<UsersService>;
  let authServiceMock: Partial<AuthService>;

  beforeEach(async () => {
    usersServiceMock = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'random@email.com',
          password: 'password',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          { id: 1, email, password: 'password' } as User,
        ]);
      },
    };
    authServiceMock = {
      signup: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should update session object on signin and return user', async () => {
    const session = { userId: undefined };
    const user = await controller.signin(
      { email: 'random@email.com', password: 'password' },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });

  it('Should update session object on signup and return user', async () => {
    const session = { userId: undefined };
    const user = await controller.createUser(
      { email: 'random@email.com', password: 'password' },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });

  it('Should clear session object on signout', async () => {
    const session = { userId: 1 };
    await controller.signout(session);
    expect(session.userId).toEqual(null);
  });
});
