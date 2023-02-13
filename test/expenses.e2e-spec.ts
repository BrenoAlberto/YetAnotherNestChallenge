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
  let cookie: string[];

  const setCookie = async () => {
    const res = await request(app.getHttpServer())
      .post('/users/signup')
      .send(mockUser)
      .expect(201);

    cookie = res.get('Set-Cookie');
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await setCookie();
  });

  it('/expenses (POST) - success', async () => {
    return await request(app.getHttpServer())
      .post('/expenses')
      .send(mockExpense)
      .set('Cookie', cookie)
      .expect(201);
  });

  it('/expenses (POST) - fail user not loggedin', async () => {
    return await request(app.getHttpServer())
      .post('/expenses')
      .send(mockExpense)
      .expect(403);
  });

  it("/expenses (POST) - fail - missing 'value'", async () => {
    return await request(app.getHttpServer())
      .post('/expenses')
      .send({ ...mockExpense, value: undefined })
      .set('Cookie', cookie)
      .expect(400);
  });

  it("/expenses (POST) - fail - negative 'value'", async () => {
    return await request(app.getHttpServer())
      .post('/expenses')
      .send({ ...mockExpense, value: -1 })
      .set('Cookie', cookie)
      .expect(400);
  });

  it("/expenses (POST) - fail - missing 'description'", async () => {
    return await request(app.getHttpServer())
      .post('/expenses')
      .send({ ...mockExpense, description: undefined })
      .set('Cookie', cookie)
      .expect(400);
  });

  it("/expenses (POST) - fail - longer than 191 'description'", async () => {
    await request(app.getHttpServer())
      .post('/expenses')
      .send({ ...mockExpense, description: 'a'.repeat(192) })
      .set('Cookie', cookie)
      .expect(400);
  });

  it("/expenses (POST) - fail - missing 'date'", async () => {
    return await request(app.getHttpServer())
      .post('/expenses')
      .send({ ...mockExpense, date: undefined })
      .set('Cookie', cookie)
      .expect(400);
  });

  it("/expenses (POST) - fail - future 'date'", async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    return await request(app.getHttpServer())
      .post('/expenses')
      .send({ ...mockExpense, date: futureDate })
      .set('Cookie', cookie)
      .expect(400);
  });
});
