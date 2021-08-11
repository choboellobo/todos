import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Request } from 'express'
import { ResponseDescription } from 'src/common/enum/response.swagger';

@ApiTags('Lists')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  @ApiCreatedResponse({description: ResponseDescription.CREATED})
  @ApiUnauthorizedResponse({description: ResponseDescription.UNAUTHORIZED})
  @ApiBadRequestResponse({description: ResponseDescription.BAD})
  create(@Body() createListDto: CreateListDto, @Req() req: Request) {
    const { id } = req.user as any
    return this.listsService.create(id, createListDto);
  }

  @ApiOkResponse({description: ResponseDescription.OK})
  @ApiUnauthorizedResponse({description: ResponseDescription.UNAUTHORIZED})
  @Get()
  findAll(@Req() req: Request) {
    const { id, roles } = req.user as any
    const query = roles.includes('admin') ? null : { $or: [{owner: id}, {allows: id }]}
    return this.listsService.findAll(query);
  }

  @ApiOkResponse({description: ResponseDescription.OK})
  @ApiUnauthorizedResponse({description: ResponseDescription.UNAUTHORIZED})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listsService.findOne(id);
  }

  @ApiOkResponse({description: ResponseDescription.OK})
  @ApiUnauthorizedResponse({description: ResponseDescription.UNAUTHORIZED})
  @ApiBadRequestResponse({description: ResponseDescription.BAD})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateListDto: UpdateListDto) {
    return this.listsService.update(id, updateListDto);
  }

  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({description: ResponseDescription.UNAUTHORIZED})
  @ApiBadRequestResponse({description: ResponseDescription.BAD})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listsService.remove(id);
  }

  @ApiCreatedResponse({description: ResponseDescription.CREATED})
  @ApiUnauthorizedResponse({description: ResponseDescription.UNAUTHORIZED})
  @Get('sync/:listId/')
  async syncListWithOtherUser(
    @Param('listId') listId: string,
    @Req() req: Request
    ){
      const { id } = req.user as any
      return this.listsService.syncListWithMe(listId, id )
  }
}
