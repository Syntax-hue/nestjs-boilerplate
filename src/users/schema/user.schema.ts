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

  @Prop({
    default: 'https://enwardo-assets.ams3.digitaloceanspaces.com/enwardo-api/user.png'
  })
  userAvatar: string;

  @Prop({
    index: {
      unique: true
    }
  })
  email: string; // should throw an err but doesn't

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
