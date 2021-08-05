import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleGuard } from '../common/guards/role.guard';
import { OnlyMeGuard } from '../common/guards/only-me.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('admin')
  @UseGuards(RoleGuard)
  findAll() {
    return this.usersService.findAll()
  }

  @Get(':id')
  @Roles('admin','user')
  @UseGuards(RoleGuard)
  @UseGuards(OnlyMeGuard)
  findOne(@Param('id') id: string) {   
    return this.usersService.findOne(id)
  }

  @Patch(':id')
  @Roles('admin','admin')
  @UseGuards(RoleGuard)
  @UseGuards(OnlyMeGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(RoleGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
