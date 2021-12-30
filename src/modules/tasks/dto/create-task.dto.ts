import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({ message: 'A task must contain content.' })
  @IsString()
  content: string;

  @IsOptional()
  dueDate: Date;

  @IsOptional()
  @IsString()
  projectId: string;

  @IsOptional()
  @IsString()
  clientId: string;
}
