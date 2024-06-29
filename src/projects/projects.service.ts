import { HttpStatus, Injectable } from '@nestjs/common';
import { ProjectDto } from './dto/project.dto';
import { Projects } from './schema/project.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FileService } from 'src/file/file.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Projects.name)
    private projectModel: Model<Projects>,
    private fileService: FileService,
  ) {}

  async create(data: ProjectDto, file: Express.Multer.File) {
    const image = await this.fileService.create(file);
    try {
      const newProject = new this.projectModel({ ...data, file: image });
      return await newProject.save();
    } catch (error) {
      return {
        message: 'something wrong error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findAll() {
    return await this.projectModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  async update(id: string, data: ProjectDto, file: Express.Multer.File) {
    try {
      const project = await this.projectModel.findById(id);
      if (!project) {
        return {
          message: 'project not found',
          status: HttpStatus.NOT_FOUND,
        };
      }
      await this.fileService.delete(project.file.fileId);
      const image = await this.fileService.create(file);
      project.name = data.name;
      project.link = data.link;
      project.description = data.description;
      project.file = image;
      return await project.save();
    } catch (error) {
      return {
        message: 'The data could not be update, please try again',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async remove(id: string) {
    try {
      const project = await this.projectModel.findById(id);
      if (!project) {
        return {
          message: 'project not found',
          status: HttpStatus.NOT_FOUND,
        };
      }

      await this.fileService.delete(project.file.fileId);
      await this.projectModel.findByIdAndDelete(id);
      return { message: 'data deleted', status: HttpStatus.OK };
    } catch (error) {
      return {
        message: 'The data could not be deleted, please try again',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
