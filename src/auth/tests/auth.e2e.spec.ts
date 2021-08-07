import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { DatabaseService } from '../../common/testing/database.service';
import { Connection } from 'mongoose';
import { UserMock } from './user.mock';
import { loginHelper } from '../../common/testing/login.helpers';

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
    await dbConnection.collection('users').deleteMany({})
    await dbConnection.close()
  })

  afterAll( async () => {
    await app.close()
  })

  it('/auth/signup CREATED',async () => {
      const response = await request(app.getHttpServer()).post('/auth/signup').send(UserMock)
      expect(response.status).toBe(201)
      expect(response.body).toMatchObject({email: UserMock.email, name: UserMock.name})
      expect(response.body).not.toMatchObject({password: UserMock.password})
  })

  it('/auth/login CREATED', async () => {
    await request(app.getHttpServer()).post('/auth/signup').send(UserMock)
    const { email, password } = UserMock;
    const response = await request(app.getHttpServer()).post('/auth/login').send({email, password})
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('name')
    expect(response.body).toHaveProperty('access_token')
    expect(response.body).toHaveProperty('refresh_token')
  })

  it('/auth/login Unauthorized', async () => {
    const { email, password } = UserMock;
    const response = await request(app.getHttpServer()).post('/auth/login').send({email, password})
    expect(response.status).toBe(401)
  })

  it('/auth/login CREATED', async () => {
    await request(app.getHttpServer()).post('/auth/signup').send(UserMock)
    const { email, password } = UserMock;
    const loginResponse = await request(app.getHttpServer()).post('/auth/login').send({email, password})
    const { refresh_token } = loginResponse.body as any
    const response = await request(app.getHttpServer()).post('/auth/refresh').send({refresh_token})
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('name')
    expect(response.body).toHaveProperty('access_token')
    expect(response.body).toHaveProperty('refresh_token')
  })

  it('/auth/me GET INFO', async () => {
    const { access_token } = await loginHelper(request, app, UserMock).then( response => response.body)
    const response = await request(app.getHttpServer()).get('/auth/me').set({Authorization: `Bearer ${access_token}`})
    expect(response.status).toBe(200)
  })

  it('/auth/me Unauthorized', async () => {
    const response = await request(app.getHttpServer()).get('/auth/me')
    expect(response.status).toBe(401)
  })





});
