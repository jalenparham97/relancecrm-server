import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceResponse } from 'src/types';
import { User } from 'src/modules/users/models/user.model';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './models/project.model';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel('Project') private projectsModel: Model<Project>) {}

  async create(createProjectDto: CreateProjectDto, user: User) {
    return await this.projectsModel.create({
      userId: user._id,
      ...createProjectDto,
    });
  }

  async findAll(user: User) {
    const data = await this.projectsModel
      .find({ userId: user._id })
      .sort({ createdAt: 'desc' })
      .exec();
    return { total: data.length, data };
  }

  async findAllClientProjects(
    clientId: string,
    user: User,
  ): Promise<ServiceResponse<Project>> {
    const data = await this.projectsModel
      .find({ userId: user._id, client: clientId })
      .sort({ createdAt: 'desc' })
      .exec();

    return { total: data.length, data };
  }

  async findOne(id: string, user: User) {
    const project = await this.projectsModel
      .findOne({
        _id: id,
        userId: user._id,
      })
      .populate('client')
      .exec();

    if (!project) throw new NotFoundException('Project not found');

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, user: User) {
    try {
      return await this.projectsModel.findOneAndUpdate(
        { _id: id, userId: user._id },
        updateProjectDto,
      );
    } catch (error) {
      throw new NotFoundException('Project not found');
    }
  }

  async removeMany(ids: string[]) {
    try {
      return await this.projectsModel.deleteMany({ _id: { $in: ids } });
    } catch (error) {
      throw new NotFoundException('Projects not found');
    }
  }

  async remove(id: string, user: User) {
    try {
      return await this.projectsModel.findOneAndRemove({
        _id: id,
        userId: user._id,
      });
    } catch (error) {
      throw new NotFoundException('Project not found');
    }
  }
}
