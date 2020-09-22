import { User } from './../users/schema/user.schema';
import { Controller, Get, Param, Post, Body, Delete, Patch, BadRequestException, UseGuards } from '@nestjs/common';
import { RolesBuilderService } from './roles-builder.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from './schema/roles.schema';
import { AuthGuard } from '../auth/auth.guard';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { APP_RESOURCES } from '../app.roles';
import { UserData } from 'src/core/decorators';



@Controller('roles-builder')
export class RolesBuilderController {

  constructor(private readonly rolesBuilder: RolesBuilderService,
    @InjectRolesBuilder() private rolesAccess: RolesBuilder,
  ) { }

  private readonly resource = 'roles';

  @UseGuards(AuthGuard)
  @Get()
  getAll(
    @UserData() user: User
  ): Promise<Roles[]> {
    return this.rolesBuilder.getAll(null, null, null, {
      permission: this.rolesAccess.can(user.roles),
      userId: user.id,
      resource: this.resource,
    });
  }

  // @UseGuards(AuthGuard)
  // @Get('resources')
  // getResources() {
  //   return APP_RESOURCES;
  // }

  @UseGuards(AuthGuard)
  @Get(':id')
  getOne(
    @Param('id') id: string,
    @UserData() user: User,
  ): Promise<Roles> {
    return this.rolesBuilder.get({ _id: id }, null, null, {
      permission: this.rolesAccess.can(user.roles),
      userId: user.id,
      resource: this.resource,
    })
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createRoleDto: CreateRoleDto,
    @UserData() user: User,
  ): Promise<Roles> {
    try {
      return await this.rolesBuilder.create(createRoleDto, {
        permission: this.rolesAccess.can(user.roles),
        userId: user.id,
        resource: this.resource,
      });

    } catch (e) {
      if (e.message.includes('E11000')) {
        throw new BadRequestException('This Role already exists')
      }
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':roleName')
  update(
    @Param('roleName') roleName: string,
    @UserData() user: User,
    @Body() updateRoleDto: Partial<UpdateRoleDto>
  ): Promise<Roles> {
    return this.rolesBuilder.update({ roleName }, updateRoleDto, null, {
      permission: this.rolesAccess.can(user.roles),
      userId: user.id,
      resource: this.resource,
    });
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @UserData() user: User,
  ): Promise<void> {
    return this.rolesBuilder.deleteOne({ _id: id }, null, {
      permission: this.rolesAccess.can(user.roles),
      userId: user.id,
      resource: this.resource,
    })
  }
}
