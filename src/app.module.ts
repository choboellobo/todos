import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env']
    }),
    MongooseModule.forRoot(
      process.env.ENV === 'production' ? process.env.MONGODB_URI : process.env.MONGODB_URI_DEV,
      {
        
      } 
    )
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
