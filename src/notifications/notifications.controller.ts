import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ResponseSuccess } from '../core/utils';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { NotificationsService } from './notifications.service';
import { CreateNotificationsDto, UpdateNotificationsDto } from './dto/create.notifications.dto';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { UserData } from 'src/core/decorators';
import { User } from 'src/users/schema/user.schema';

@ApiTags('Notifications')
@ApiBearerAuth()

@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationsController {

  constructor(
    private notificationsService: NotificationsService,
    @InjectRolesBuilder() private readonly rolesBuilder: RolesBuilder
  ) {
  }

  public readonly resource = 'notifications';

  @UseGuards(AuthGuard)
  @Get()
  async getAll(
    @UserData() user: User
  ) {
    return await this.notificationsService.getAll(null, null, null, {
      permission: this.rolesBuilder.can(user.roles),
      userId: user.id,
      resource: this.resource,
    });
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @UserData() user: User,
    @Body() createNotificationsDto: CreateNotificationsDto
  ) {
    return await this.notificationsService.create(createNotificationsDto, {
      permission: this.rolesBuilder.can(user.roles),
      resource: this.resource,
      userId: user.id,
    });

  }
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @UserData() user: User,
    @Param('id') id: string,
    @Body() updateNotificationsDto: UpdateNotificationsDto
  ) {
    return await this.notificationsService.update({ _id: id }, updateNotificationsDto, {
      permission: this.rolesBuilder.can(user.roles),
      resource: this.resource,
      userId: user.id,
    });
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(
    @UserData() user: User,
    @Param('id') id: string
  ) {
    await this.notificationsService.deleteOne({ _id: id }, {
      permission: this.rolesBuilder.can(user.roles),
      resource: this.resource,
      userId: user.id,
    });
    return new ResponseSuccess('DELETED_SUCCESSFULLY')
  }
}
