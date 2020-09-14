import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class CreateDictionaryDto {

  @ApiProperty() /* Swagger * */
  @IsNotEmpty()
  public wordKey: string;

  @ApiProperty()
  @IsNotEmpty()
  public value: string;

  @ApiProperty() /* Swagger * */
  @IsNotEmpty()
  public i18n: Record<string, any>;
}

export class FindDictionaryDto {

  @ApiProperty() /* Swagger * */
  @IsNotEmpty()
  public wordKey: any;
}

export class UpdateKeyDto {

  @ApiProperty()
  @IsOptional()
  public value: string;

  @ApiProperty() /* Swagger * */
  @IsOptional()
  @IsObject()
  public i18n: Record<string, any>;
}
