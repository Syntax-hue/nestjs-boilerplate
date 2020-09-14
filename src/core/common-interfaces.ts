import { Document } from "mongoose";
import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class Languages {
  public readonly ro: string;
  public readonly en: string;
  public readonly ru: string;
}

export class CreatMetaDto {

  @ApiProperty()
  keywords: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  @IsOptional()
  author: string;

}

export class CreateOgDto {

  @ApiProperty()
  title: string;

  @ApiProperty()
  @IsOptional()
  type: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  img: string;

  @ApiProperty()
  @IsOptional()
  description: string;
}
