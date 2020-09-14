import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum NotificationsArea {
  BRIEFING = 'BRIEFING'
}

@Schema()
export class Notifications extends Document {


  @Prop({
    unique: true
  })
  receiverEmail: string;

  @Prop({
    unique: true
  })
  receiverPhone: string;

  @Prop({
    type: Array,
    enum: Object.keys(NotificationsArea).map(key => NotificationsArea[key]),
  })
  area;
}

export const NotificationsSchema = SchemaFactory.createForClass(Notifications);

