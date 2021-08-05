import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express'
import { LocalAuthGuard } from './guards/local.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { loginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh_token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: loginDto, @Req() req: Request) {
    return this.authService.generateToken(req.user)
  }

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMeInformation(@Req() req: Request) {
    const { id } = req.user as any
    return this.userService.findOne(id)
  }

  @Post('refresh')
  generateTokenFromRefresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.generateTokenFromRefresh(refreshTokenDto.refresh_token)
  }
}
