import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { User } from './schema/user.schema';
import { CrudService } from '../core/crud/crud.service';

@Injectable()
export class UsersService extends CrudService<User>{
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {
    super(userModel);
  }

  public async getByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ email });
      return user;
    } catch (e) {
      throw new HttpException(e.message, e.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
