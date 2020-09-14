import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { Roles } from './schema/roles.schema';
import { CrudService } from '../core/crud/crud.service';

@Injectable()
export class RolesBuilderService extends CrudService<Roles> {

  constructor(
    @InjectModel(Roles.name) public rolesModel: Model<Roles>
  ) {
    super(rolesModel);
  }
}
