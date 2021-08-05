import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../users/user.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ){}

    async validateUser(email: string, password: string) {
        const user: IUser =  await this.userService.getUserByEmail(email);
        if(user) {
            const isUserValid = await this.userService.validatePassword(password, user.password);
            if(isUserValid) return user
        }
        return null
    }

    generateToken(user: any) {
        const payload = { sub: user.id };
        return {
            name: user.name,
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign({...payload, refresh: true})
        };
    }

    async generateTokenFromRefresh(refresh_token: string) {
        const data = this.jwtService.decode(refresh_token) as any
        if(data.refresh) {
            const user: IUser = await this.userService.findOne(data.sub)
            return this.generateToken(user)
        }
        throw new UnauthorizedException()
    }
}
