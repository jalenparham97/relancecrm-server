import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from 'src/modules/users/models/user.model';
import { Task, TaskModel } from './models/task.model';
import { ServiceResponse } from 'src/types';
import { getDocumentsCount } from 'src/utils';

@Injectable()
export class TasksService {
  constructor(@InjectModel('Task') private tasksModel: Model<TaskModel>) {}

  async create(createTaskDto: CreateTaskDto, user: User) {
    return await this.tasksModel.create({ userId: user._id, ...createTaskDto });
  }

  async findAll(
    user: User,
    filter?: FilterQuery<Task>,
  ): Promise<ServiceResponse<Task>> {
    const baseQuery: FilterQuery<Task> = {
      userId: user._id,
    };

    const data = await this.tasksModel
      .find({
        ...baseQuery,
        ...filter,
      })
      .sort({ _id: -1 })
      .populate('project')
      .exec();

    const count = await getDocumentsCount(baseQuery, this.tasksModel);

    return { total: count, data };
  }

  async findAllClientTasks(
    clientId: string,
    user: User,
  ): Promise<ServiceResponse<Task>> {
    const query: FilterQuery<Task> = { userId: user._id, clientId };

    const data = await this.tasksModel
      .find(query)
      .sort({ createdAt: 'desc' })
      .exec();

    const count = await getDocumentsCount(query, this.tasksModel);

    return { total: count, data };
  }

  async findAllProjectTasks(
    projectId: string,
    user: User,
  ): Promise<ServiceResponse<Task>> {
    const data = await this.tasksModel
      .find({ userId: user._id, project: projectId })
      .sort({ createdAt: 'desc' })
      .populate('project')
      .exec();

    return { total: data.length, data };
  }

  async findOne(id: string, user: User) {
    const task = await this.tasksModel.findOne({ _id: id, userId: user._id });

    if (!task) throw new NotFoundException('Task not found');

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: User) {
    try {
      return await this.tasksModel.findOneAndUpdate(
        { _id: id, userId: user._id },
        updateTaskDto,
      );
    } catch (error) {
      throw new NotFoundException('Task not found');
    }
  }

  async removeMany(ids: string[]) {
    try {
      return await this.tasksModel.deleteMany({ _id: { $in: ids } });
    } catch (error) {
      throw new NotFoundException('Tasks not found');
    }
  }

  async remove(id: string, user: User) {
    try {
      return await this.tasksModel.findOneAndRemove({
        _id: id,
        userId: user._id,
      });
    } catch (error) {
      throw new NotFoundException('Task not found');
    }
  }
}
