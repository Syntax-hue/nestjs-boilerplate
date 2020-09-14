import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class EmailConfirmation extends Document {

  @Prop()
  email: string;

  @Prop()
  emailToken: string;

  @Prop()
  timestamp: Date;

}

export const EmailConfirmationSchema = SchemaFactory.createForClass(EmailConfirmation);
