import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Roles extends Document {
  @Prop({
    index: {
      unique: true
    }
  })
  roleName: string;

  @Prop()
  resources: ResourceDocument[];
}


export class ResourceActionDocument {
  @Prop()
  name: string;

  @Prop({
    default: '*'
  })
  attributes: string;
}

export class ResourceDocument {

  @Prop()
  name: string;

  @Prop()
  read: ResourceActionDocument;

  @Prop()
  create: ResourceActionDocument;

  @Prop()
  update: ResourceActionDocument;

  @Prop()
  delete: ResourceActionDocument;

}

export const RolesSchema = SchemaFactory.createForClass(Roles);
