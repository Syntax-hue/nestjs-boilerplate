import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiResponseModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';


@Schema({
    toJSON: {
        transform: function (doc, ret, options) {
            delete ret.isActive;
            delete ret.__v;
            return ret
        }
    }
})
export class News extends Document {

    @ApiResponseModelProperty() /* Swagger * */
    @Prop()
    title: string;

    @ApiResponseModelProperty() /* Swagger * */
    @Prop()
    shortDescription: string;

    @ApiResponseModelProperty() /* Swagger * */
    @Prop()
    tags: string[];

    @ApiResponseModelProperty() /* Swagger * */
    @Prop()
    frontImage: string;

    @ApiResponseModelProperty() /* Swagger * */
    @Prop()
    html: string;

    @ApiResponseModelProperty() /* Swagger * */
    @Prop({
        default: new Date()
    })
    createdAt: Date;

    @ApiResponseModelProperty() /* Swagger * */
    @Prop({
        default: new Date()
    })
    updateAt: Date;

    @ApiResponseModelProperty() /* Swagger * */
    @Prop()
    createdBy: string;

    @Prop()
    isActive: boolean;
}

export const NewsSchema = SchemaFactory.createForClass(News);