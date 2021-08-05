import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { DatabaseService } from 'src/common/testing/database.service';
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

  it('/auth/signup (POST)',async () => {
      const response = await request(app.getHttpServer()).post('/signup').send(UserMock)
      expect(response.status).toBe(201)
      expect(response.body).toMatchObject(UserMock)
  });
});
