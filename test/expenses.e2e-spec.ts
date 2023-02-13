import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ExpensesController (e2e)', () => {
  let app: INestApplication;
  const mockUser = { email: 'random@email.com', password: 'password' };
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const mockExpense = {
    value: 100,
    description: 'test',
    date: yesterday,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/expenses (POST) - success', async () => {
    const res = await request(app.getHttpServer())
      .post('/users/signup')
      .send(mockUser)
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const response = await request(app.getHttpServer())
      .post('/expenses')
      .send(mockExpense)
      .set('Cookie', cookie);

    expect(response.status).toBe(201);
  });
});
