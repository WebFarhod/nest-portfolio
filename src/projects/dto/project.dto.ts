import { IsNotEmpty, IsOptional } from 'class-validator';

export class ProjectDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  link: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  file: {
    url: string;
    fileId: string;
  };
}
