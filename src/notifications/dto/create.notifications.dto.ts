import { IsEmail, IsEnum, IsNotEmpty, ValidateIf } from 'class-validator';
import { NotificationsArea } from '../schema/notifications.schema';
import { PartialType } from '@nestjs/mapped-types';

export class CreateNotificationsDto {

  @ValidateIf(o => !o.receiverPhone || o.receiverEmail)
  @IsNotEmpty()
  @IsEmail()
  receiverEmail: string;

  @ValidateIf(o => !o.receiverEmail || o.receiverPhone)
  @IsNotEmpty()
  receiverPhone: string;

  @IsEnum(NotificationsArea, {each: true})
  @IsNotEmpty()
  area: string[]
}

export class UpdateNotificationsDto extends PartialType(CreateNotificationsDto) {}
