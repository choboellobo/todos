import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './common/testing/database.module';
import { ListsModule } from './lists/lists.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env']
    }),
    MongooseModule.forRoot(
      process.env.ENV === 'testing' ? process.env.MONGODB_URI_TESTING : process.env.MONGODB_URI,
      {
        useCreateIndex: true
      } 
    ),
    UsersModule,
    AuthModule,
    DatabaseModule,
    ListsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
