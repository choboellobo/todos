import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { IUser } from 'src/users/user.interface';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (request, jwtToken, done) => {
        done(null, process.env.JWT_SECRET);
      }
    });
  }

  async validate(payload: any) {
    const user: IUser = await this.userService.findOne(payload.sub) 
    return user;
  }
}