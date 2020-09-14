import { Prop } from '@nestjs/mongoose';
import { ApiResponseModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class Meta {

  @ApiResponseModelProperty() /* Swagger * */
  @Prop()
  @IsNotEmpty()
  keywords: string;

  @ApiResponseModelProperty() /* Swagger * */
  @Prop()
  @IsNotEmpty()
  description: string;

  @ApiResponseModelProperty() /* Swagger * */
  @IsOptional()
  @Prop({
    default: null
  })
  author: string;

}

export class Og {

  @ApiResponseModelProperty() /* Swagger * */
  @Prop()
  @IsNotEmpty()
  title: string;

  @ApiResponseModelProperty() /* Swagger * */
  @IsOptional()
  @Prop({
    default: null
  })
  type: string;

  @ApiResponseModelProperty() /* Swagger * */
  @Prop()
  @IsNotEmpty()
  url: string;

  @ApiResponseModelProperty() /* Swagger * */
  @Prop()
  @IsNotEmpty()
  img: string;

  @ApiResponseModelProperty() /* Swagger * */
  @Prop()
  @IsOptional()
  description: string;

}
