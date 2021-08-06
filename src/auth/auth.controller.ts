import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express'
import { LocalAuthGuard } from './guards/local.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh_token.dto';
import { ResponseDescription } from '../common/enum/response.swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiCreatedResponse({description: 'Get access_token and refresh_token'})
  @ApiUnauthorizedResponse({description: ResponseDescription.UNAUTHORIZED})
  @ApiBadRequestResponse({description: ResponseDescription.BAD})
  async login(@Req() req: Request) {
    return this.authService.generateToken(req.user)
  }

  @Post('signup')
  @ApiResponse({status: 201, description: ResponseDescription.CREATED })
  @ApiResponse({status: 400, description: ResponseDescription.BAD})
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOkResponse({description: ResponseDescription.OK})
  @ApiUnauthorizedResponse({description: ResponseDescription.UNAUTHORIZED})
  getMeInformation(@Req() req: Request) {
    const { id } = req.user as any
    return this.userService.findOne(id)
  }

  @Post('refresh')
  @ApiCreatedResponse({description:  'Get access_token and refresh_token' })
  @ApiBadRequestResponse({description: ResponseDescription.BAD})
  generateTokenFromRefresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.generateTokenFromRefresh(refreshTokenDto.refresh_token)
  }
}
