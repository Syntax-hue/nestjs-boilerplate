import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiResponseModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

@Schema()
export class Dictionary extends Document {

  @ApiResponseModelProperty() /* Swagger * */
  @Prop({
    index: { unique: true }
  })
  wordKey: string

  @ApiResponseModelProperty() /* Swagger * */
  @Prop()
  value: string;

  @Prop()
  i18n: any;

}

export const DictionarySchema = SchemaFactory.createForClass(Dictionary);
