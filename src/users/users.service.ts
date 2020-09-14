import { Injectable, HttpException, HttpStatus, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { User } from './schema/user.schema';
import { CrudService, IRoleDetails } from '../core/crud/crud.service';

@Injectable()
export class UsersService extends CrudService<User>{
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {
    super(userModel);
  }

  // async deactivateOne(
  //   id: string,
  //   roleDetails: IRoleDetails = null,
  // ) {
  //   try {
  //     if (roleDetails && roleDetails.permission.granted) {
  //       return await this.userModel.findOneAndUpdate({ _id: id }, { isActive: false });
  //     }
  //     throw new ForbiddenException();
  //   } catch (e) {
  //     throw new HttpException(e.message, e.status || HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  public async getByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ email });
      return user;
    } catch (e) {
      throw new HttpException(e.message, e.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
