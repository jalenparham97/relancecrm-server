import {
  AsyncModelFactory,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type TaskModel = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ type: Types.ObjectId })
  userId: string;

  @Prop({ trim: true })
  content: string;

  @Prop({ default: false })
  completed: boolean;

  @Prop()
  dueDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  project: string;

  @Prop()
  projectId: string;

  @Prop({ type: Types.ObjectId })
  clientId: string;

  createdAt: Date;
  updatedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

export const TaskSchemaProvider: AsyncModelFactory = {
  name: 'Task',
  useFactory: () => {
    return TaskSchema;
  },
};
