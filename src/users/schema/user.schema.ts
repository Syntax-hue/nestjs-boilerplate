import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { AppRoles } from "src/app.roles";

@Schema()
export class User extends Document {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({
    type: Array,
    default: [AppRoles.USER],
  })
  roles: [AppRoles]

  @Prop()
  userAvatar: string;

  @Prop({
    index: {
      unique: true
    }
  })
  email: string;

  @Prop()
  password: string;

  @Prop({
    default: true
  })
  isActive: boolean;

  @Prop({
    default: false
  })
  isEmailConfirmed: boolean;

  @Prop()
  timestamps: {
    createdAt: Date;
    updatedAt: Date;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
