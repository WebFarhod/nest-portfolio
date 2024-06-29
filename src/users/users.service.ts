import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Users } from './schema/user.schema';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectModel(Users.name)
    private userModel: Model<Users>,
  ) {}

  async onModuleInit() {
    await this.addDefaultAdmin();
  }

  private async addDefaultAdmin() {
    const admin = await this.userModel.findOne({ username: 'admin' }).exec();
    if (!admin) {
      const hashedPassword = await bcrypt.hash('adminpassword', 10);
      const newAdmin = new this.userModel({
        username: 'admin',
        email: 'admin@mail.com',
        password: hashedPassword,
        role: 'admin',
      });
      await newAdmin.save();
    }
  }

  async findOne(
    email: string,
    password: string,
  ): Promise<Users | undefined | string> {
    try {
      const user = await this.userModel.findOne({
        email,
      });
      const isMatch = await bcrypt.compare(password, user.password);
      if (user && isMatch) {
        return user;
      } else {
        throw new Error(`User not found`);
      }
    } catch (err) {
      throw new Error(`Error finding ${err} user ${err.message}`);
    }
  }
}
