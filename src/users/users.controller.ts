import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleGuard } from '../common/guards/role.guard';
import { OnlyMeGuard } from '../common/guards/only-me.guard';
import { ResponseDescription } from '../common/enum/response.swagger';
import { User } from './user.schema';
import { IUser } from './user.interface';


@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('admin')
  @UseGuards(RoleGuard)
  @Post()
  @ApiCreatedResponse({description: ResponseDescription.CREATED, type: User  })
  @ApiUnauthorizedResponse({description: ResponseDescription.UNAUTHORIZED})
  @ApiBadRequestResponse({description: ResponseDescription.BAD})
  @ApiForbiddenResponse({description: ResponseDescription.FORBIDDEN})
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @Get()
  @ApiCreatedResponse({description: ResponseDescription.CREATED, type: User, isArray: true})
  @ApiUnauthorizedResponse({description: ResponseDescription.UNAUTHORIZED})
  @ApiBadRequestResponse({description: ResponseDescription.BAD})
  @ApiForbiddenResponse({description: ResponseDescription.FORBIDDEN})
  findAll(@Query() query: IUser) {
    return this.usersService.findAll(query)
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
