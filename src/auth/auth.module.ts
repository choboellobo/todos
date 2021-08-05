import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [ 
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => { return {
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1w' },
      }},
      imports: [ConfigModule],
      inject: [ConfigService]
    }),
    UsersModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}
