import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { GetUser } from 'src/decorators';
import { User } from 'src/modules/users/models/user.model';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() user: User,
  ) {
    return await this.projectsService.create(createProjectDto, user);
  }

  @Get()
  async findAll(@GetUser() user: User) {
    return await this.projectsService.findAll(user);
  }

  @Get('client')
  async findAllClientProjects(
    @Query('clientId') clientId: string,
    @GetUser() user: User,
  ) {
    return await this.projectsService.findAllClientProjects(clientId, user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser() user: User) {
    return await this.projectsService.findOne(id, user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @GetUser() user: User,
  ) {
    return await this.projectsService.update(id, updateProjectDto, user);
  }

  @Delete()
  async removeMany(@Query('ids') ids: string[]) {
    return await this.projectsService.removeMany(ids);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser() user: User) {
    return await this.projectsService.remove(id, user);
  }
}
