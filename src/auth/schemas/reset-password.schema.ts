import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ResetPassword extends Document {

  @Prop()
  email: string;

  @Prop()
  resetToken: string;

  @Prop()
  timestamp: Date;

}

export const ResetPasswordSchema = SchemaFactory.createForClass(ResetPassword);
