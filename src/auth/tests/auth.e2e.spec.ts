import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { DatabaseService } from '../../common/testing/database.service';
import { Connection } from 'mongoose';
import { UserMock } from './user.mock';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dbConnection: Connection

  beforeEach(async () => {
    
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dbConnection = moduleFixture.get<DatabaseService>(DatabaseService).getDbHandler()
  });

  afterEach( async () => {
    dbConnection.collection('users').deleteMany({})
  })

  afterAll( async () => {
    app.close()
  })

  it('/auth/signup (POST)',async () => {
      const response = await request(app.getHttpServer()).post('/auth/signup').send(UserMock)
      expect(response.status).toBe(201)
      expect(response.body).toMatchObject({email: UserMock.email, name: UserMock.name})
      expect(response.body).not.toMatchObject({password: UserMock.password})
  })
});
