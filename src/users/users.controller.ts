import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleGuard } from '../common/guards/role.guard';
import { OnlyMeGuard } from '../common/guards/only-me.guard';
import { ResponseDescription } from 'src/common/enum/response.swagger';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('admin')
  @UseGuards(RoleGuard)
  @Post()
  @ApiCreatedResponse({description: ResponseDescription.CREATED})
  @ApiUnauthorizedResponse({description: ResponseDescription.UNAUTHORIZED})
  @ApiBadRequestResponse({description: ResponseDescription.BAD})
  @ApiForbiddenResponse({description: ResponseDescription.FORBIDDEN})
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @Get()
  @ApiCreatedResponse({description: ResponseDescription.CREATED})
  @ApiUnauthorizedResponse({description: ResponseDescription.UNAUTHORIZED})
  @ApiBadRequestResponse({description: ResponseDescription.BAD})
  @ApiForbiddenResponse({description: ResponseDescription.FORBIDDEN})
  findAll() {
    return this.usersService.findAll()
  }

  @Roles('admin','user')
  @UseGuards(RoleGuard)
  @UseGuards(OnlyMeGuard)
  @Get(':id')
  @ApiCreatedResponse({description: ResponseDescription.CREATED})
  @ApiUnauthorizedResponse({description: ResponseDescription.UNAUTHORIZED})
  @ApiBadRequestResponse({description: ResponseDescription.BAD})
  @ApiForbiddenResponse({description: ResponseDescription.FORBIDDEN})
  findOne(@Param('id') id: string) {   
    return this.usersService.findOne(id)
  }

  @Roles('admin','user')
  @UseGuards(RoleGuard)
  @UseGuards(OnlyMeGuard)
  @Patch(':id')
  @ApiCreatedResponse({description: ResponseDescription.CREATED})
  @ApiUnauthorizedResponse({description: ResponseDescription.UNAUTHORIZED})
  @ApiBadRequestResponse({description: ResponseDescription.BAD})
  @ApiForbiddenResponse({description: ResponseDescription.FORBIDDEN})
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @Delete(':id')
  @ApiCreatedResponse({description: ResponseDescription.CREATED})
  @ApiUnauthorizedResponse({description: ResponseDescription.UNAUTHORIZED})
  @ApiBadRequestResponse({description: ResponseDescription.BAD})
  @ApiForbiddenResponse({description: ResponseDescription.FORBIDDEN})
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
