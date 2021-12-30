import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from 'src/modules/users/models/user.model';
import { GetUser } from 'src/decorators';
import { FilterQuery } from 'mongoose';
import { PaginationParams, ServiceResponse } from 'src/types';
import { Task } from './models/task.model';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return await this.tasksService.create(createTaskDto, user);
  }

  @Get()
  async findAll(
    @GetUser() user: User,
    // @Query('filter') filter: string,
    @Query() paginationParams: PaginationParams,
  ) {
    console.log({ paginationParams });

    // const filterQuery = JSON.parse(filter) as FilterQuery<Task>;
    return await this.tasksService.findAll(user, {}, paginationParams);
  }

  @Get('client')
  async findAllClientTasks(
    @Query('clientId') clientId: string,
    @GetUser() user: User,
  ) {
    return await this.tasksService.findAllClientTasks(clientId, user);
  }

  @Get('project')
  async findAllProjectTasks(
    @Query('projectId') projectId: string,
    @GetUser() user: User,
  ) {
    return await this.tasksService.findAllProjectTasks(projectId, user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser() user: User) {
    return await this.tasksService.findOne(id, user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ) {
    return await this.tasksService.update(id, updateTaskDto, user);
  }

  @Delete()
  async removeMany(@Query('ids') ids: string[]) {
    return await this.tasksService.removeMany(ids);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser() user: User) {
    return await this.tasksService.remove(id, user);
  }
}
