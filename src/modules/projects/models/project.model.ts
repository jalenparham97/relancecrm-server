import {
  AsyncModelFactory,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { getInitials } from 'src/utils/getInitials';
import { ProjectStatus } from '../projects.types';
import randomColor from 'randomcolor';

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ type: Types.ObjectId })
  userId: string;

  @Prop({ trim: true })
  projectName: string;

  @Prop({ trim: true })
  lastName: string;

  @Prop({ trim: true })
  description: string;

  @Prop()
  backgroundColor: string;

  @Prop({ trim: true })
  initials: string;

  @Prop({ trim: true, default: ProjectStatus.ACTIVE })
  status: ProjectStatus;

  @Prop({ type: Types.ObjectId, ref: 'Client' })
  client: string;

  @Prop()
  endDate: string;

  createdAt: Date;
  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

export const ProjectSchemaProvider: AsyncModelFactory = {
  name: 'Project',
  useFactory: () => {
    ProjectSchema.pre<Project>('save', function (next) {
      this.initials = getInitials(this.projectName, 'project');
      this.backgroundColor = randomColor({ luminosity: 'dark' });
      next();
    });

    return ProjectSchema;
  },
};
