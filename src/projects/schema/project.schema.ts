import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class File {
  @Prop({ required: true })
  fileId: string;

  @Prop({ required: true })
  url: string;
}

export const FileSchema = SchemaFactory.createForClass(File);

@Schema({ timestamps: true })
export class Projects extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  link: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: FileSchema, required: true })
  file: File;
}

export const ProjectSchema = SchemaFactory.createForClass(Projects);
