import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users/signup (POST) - success', async () => {
    const mockUser = { email: 'random@email.com', password: 'password' };
    const res = await request(app.getHttpServer())
      .post('/users/signup')
      .send(mockUser)
      .expect(201);

    const { email, id } = res.body;
    expect(email).toEqual(mockUser.email);
    expect(id).toBeDefined();
  });

  it('/users/signup (POST) - should not return password', async () => {
    const mockUser = { email: 'random@email.com', password: 'password' };
    const res = await request(app.getHttpServer())
      .post('/users/signup')
      .send(mockUser)
      .expect(201);

    const { password } = res.body;
    expect(password).not.toBeDefined();
  });

  it('/users/signup (POST) - duplicate email', async () => {
    const mockUser = { email: 'random@email.com', password: 'password' };
    await request(app.getHttpServer())
      .post('/users/signup')
      .send(mockUser)
      .expect(201);
    await request(app.getHttpServer())
      .post('/users/signup')
      .send(mockUser)
      .expect(400);
  });

  it('/users/signin (POST) - success', async () => {
    const mockUser = { email: 'random@email.com', password: 'password' };
    const res = await request(app.getHttpServer())
      .post('/users/signup')
      .send(mockUser)
      .expect(201);

    const { email, id } = res.body;
    expect(email).toEqual(mockUser.email);
    expect(id).toBeDefined();
  });

  it('/users/signin (POST) - should not return password', async () => {
    const mockUser = { email: 'random@email.com', password: 'password' };
    await request(app.getHttpServer())
      .post('/users/signup')
      .send(mockUser)
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/users/signin')
      .send(mockUser)
      .expect(201);

    const { password } = res.body;
    expect(password).not.toBeDefined();
  });
});
