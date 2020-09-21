import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Document, FilterQuery, Model } from 'mongoose';
import { objectToFlattenMongoNotation } from '../utils';

export interface IRoleDetails {
  permission: any
  userId: string;
  resource: string;
  ownershipField?: string;
  returnOwn?: boolean;
}

@Injectable()
export abstract class CrudService<T extends Document> {

  constructor(
    private readonly model: Model<T>
  ) { }

  private mapAttributesToMongoose(attributes: string[]): string {
    attributes = attributes || ['*'];
    return attributes.map(attr => {
      return attr.replace('!', '-').replace('*', '')
    }).join(' ');
  }

  private checkForForbiddenFields(attributes: string[], projection: any) {
    console.log(attributes, projection);
    attributes = attributes || ['*'];
    projection = projection || {};
    if (attributes.length > 1 && attributes[0] === '*') {
      Object.keys(projection).forEach(key => {
        if (attributes.includes('!' + key)) {
          throw new ForbiddenException();
        }
      })
    }
    if (attributes.length > 1 && attributes[0] !== '*') {
      Object.keys(projection).forEach(key => {
        if (!attributes.includes(key)) {
          throw new ForbiddenException();
        }
      })
    }
  }

  public async getAll(
    conditions: Partial<Record<keyof T, unknown>> = {},
    projection: string | Record<string, any> = {},
    options: Record<string, unknown> = {},
    roleDetails: IRoleDetails = null,
  ): Promise<T[]> {
    try {
      if (roleDetails && !roleDetails.permission.readAny(roleDetails.resource).granted) {
        throw new ForbiddenException();
      }

      return await this.model.find(conditions as FilterQuery<T>, projection, options).select(
        this.mapAttributesToMongoose(roleDetails && roleDetails.permission.readAny(roleDetails.resource).attributes)
      );
    } catch (e) {
      throw new HttpException(e.message, e.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async get(
    conditions: Partial<Record<keyof T, unknown>>,
    projection: string | Record<string, any> = {},
    options: Record<string, unknown> = {},
    roleDetails: IRoleDetails = null,
  ): Promise<T> {
    try {
      if (roleDetails && !roleDetails.permission.readAny(roleDetails.resource).granted) {
        throw new ForbiddenException()
      }
      if (roleDetails && roleDetails.ownershipField) {
        const entity = await this.model.findOne(conditions as FilterQuery<T>);
        if (!entity) {
          throw new NotFoundException();
        }
        if (entity[roleDetails.ownershipField].toString() === roleDetails.userId) {
          return await this.model.findOne(conditions as FilterQuery<T>, projection, options);
        }
      }
      return await this.model.findOne(conditions as FilterQuery<T>, projection, options).select(
        this.mapAttributesToMongoose(roleDetails && roleDetails.permission.readAny(roleDetails.resource).attributes)
      )

    } catch (e) {
      throw new HttpException(e.message, e.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async create(
    projection: string | Record<string, any> = {},
    roleDetails: IRoleDetails = null,
  ): Promise<T> {
    try {
      if (roleDetails && !roleDetails.permission.createAny(roleDetails.resource).granted) {
        throw new ForbiddenException()
      }
      if (roleDetails && roleDetails.permission.createAny(roleDetails.resource)) {
        this.checkForForbiddenFields(roleDetails.permission.createAny(roleDetails.resource).attributes, projection);
      }
      const entity = new this.model(projection);
      await entity.save()
      return entity;
    } catch (e) {
      if (e.message.includes('E11000')) {
        throw new BadRequestException('This email already exists')
      }
      throw new HttpException(e.message, e.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async update(
    conditions: Partial<Record<keyof T, unknown>>,
    projection: string | Record<string, any> = {},
    options: Record<string, unknown> = { new: true },
    roleDetails: IRoleDetails = null,
  ): Promise<T> {
    try {
      if (roleDetails && !roleDetails.permission.updateOwn(roleDetails.resource).granted) {
        throw new ForbiddenException()
      }
      if (roleDetails
        && roleDetails.ownershipField
        && roleDetails.permission.updateOwn(roleDetails.resource).granted
        && !roleDetails.permission.updateAny(roleDetails.resource).granted
      ) {
        const entity = await this.model.findById(conditions);
        if (!entity) {
          throw new NotFoundException();
        }
        if (entity[roleDetails.ownershipField].toString() !== roleDetails.userId) {
          throw new ForbiddenException();
        }
      }
      if (roleDetails && roleDetails.permission.updateOwn(roleDetails.resource)) {
        this.checkForForbiddenFields(roleDetails.permission.updateOwn(roleDetails.resource).attributes, projection);
      }

      const res = objectToFlattenMongoNotation(projection);
      return await this.model.findOneAndUpdate(conditions as FilterQuery<T>, res, options);
    } catch (e) {
      throw new HttpException(e.message, e.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async deleteOne(
    conditions: Partial<Record<keyof T, unknown>>,
    options: Record<string, unknown> = {},
    roleDetails: IRoleDetails = null,
  ): Promise<void> {
    try {
      if (roleDetails && !roleDetails.permission.deleteOwn(roleDetails.resource).granted) {
        throw new ForbiddenException();
      }
      if (roleDetails
        && roleDetails.ownershipField
        && roleDetails.permission.deleteOwn(roleDetails.resource).granted
        && !roleDetails.permission.deleteAny(roleDetails.resource).granted
      ) {
        const entity = await this.model.findById(conditions);
        if (!entity) {
          throw new NotFoundException();
        }
        if (entity[roleDetails.ownershipField].toString() !== roleDetails.userId) {
          throw new ForbiddenException();
        }
      }
      await this.model.deleteOne(conditions as FilterQuery<T>, options);
    } catch (e) {
      throw new HttpException(e.message, e.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async deactivateOne(
    conditions: Partial<Record<keyof T, unknown>>,
    roleDetails: IRoleDetails = null,
  ) {
    try {
      if (roleDetails && !roleDetails.permission.deleteOwn(roleDetails.resource).granted) {
        throw new ForbiddenException();
      }
      if (roleDetails
        && roleDetails.ownershipField
        && roleDetails.permission.deleteOwn(roleDetails.resource).granted
        && !roleDetails.permission.deleteAny(roleDetails.resource).granted
      ) {
        const entity = await this.model.findById(conditions);
        if (!entity) {
          throw new NotFoundException();
        }
        if (entity[roleDetails.ownershipField].toString() !== roleDetails.userId) {
          throw new ForbiddenException();
        }
      }
      await this.model.findOneAndUpdate(conditions as FilterQuery<T>, { isActive: false } as any);
    } catch (e) {
      throw new HttpException(e.message, e.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
