import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty({ message: 'Project name is a required field.' })
  projectName: string;

  @IsOptional()
  description: string;

  @IsOptional()
  endDate: string;

  @IsOptional()
  clientId: string;
}
