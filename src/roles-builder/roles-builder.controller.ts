import { Controller, Get, Param, Post, Body, Delete, Patch, BadRequestException, UseGuards } from '@nestjs/common';
import { RolesBuilderService } from './roles-builder.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from './schema/roles.schema';
import { AuthGuard } from '../auth/auth.guard';
import { ACGuard, UseRoles } from 'nest-access-control';
import { APP_RESOURCES } from '../app.roles';



@Controller('roles-builder')
export class RolesBuilderController {

  constructor(private readonly rolesBuilder: RolesBuilderService) { }

  @UseGuards(AuthGuard, ACGuard)
  @Get()
  @UseRoles({
    resource: 'roles',
    action: 'read',
  })
  getAll(): Promise<Roles[]> {
    return this.rolesBuilder.getAll();
  }

  @UseGuards(AuthGuard, ACGuard)
  @UseRoles({
    resource: 'roles',
    action: 'read',
  })
  @Get('resources')
  getResources() {
    return APP_RESOURCES;
  }

  @UseGuards(AuthGuard, ACGuard)
  @Get(':id')
  @UseRoles({
    resource: 'roles',
    action: 'read',
  })
  getOne(
    @Param('id') id: string): Promise<Roles> {
    return this.rolesBuilder.get({ _id: id })
  }

  @UseGuards(AuthGuard, ACGuard)
  @Post()
  @UseRoles({
    resource: 'roles',
    action: 'create',
  })
  async create(
    @Body()
    createRoleDto: CreateRoleDto
  ): Promise<Roles> {
    try {
      return await this.rolesBuilder.create(createRoleDto);
    } catch (e) {
      if (e.message.includes('E11000')) {
        throw new BadRequestException('This Role already exists')
      }
    }
  }

  @UseGuards(AuthGuard, ACGuard)
  @Patch(':roleName')
  @UseRoles({
    resource: 'roles',
    action: 'update',
  })
  update(
    @Param('roleName') roleName: string,
    @Body()
    updateRoleDto: Partial<UpdateRoleDto>
  ): Promise<Roles> {
    return this.rolesBuilder.update({ roleName }, updateRoleDto);
  }

  @UseGuards(AuthGuard, ACGuard)
  @Delete(':id')
  @UseRoles({
    resource: 'roles',
    action: 'delete',
  })
  remove(
    @Param('id') id: string
  ): Promise<void> {
    return this.rolesBuilder.deleteOne({ _id: id })
  }
}
