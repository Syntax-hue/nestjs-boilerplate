import {
    IsString,
    MaxLength,
    IsArray,
    ValidateNested,
    IsNotEmptyObject,
    IsOptional,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export class ResourceAction {
  
    @IsOptional()
    @IsString()
    name: string;
  
    @IsString()
    @IsOptional()
    attributes: string;
  }
  
  export class Resource {
  
    @IsOptional()
    @IsString()
    name: string;
  
    @IsOptional()
    @IsNotEmptyObject()
    @ValidateNested({ each: true })
    @Type(() => ResourceAction)
    read: ResourceAction;
  
    @IsOptional()
    @IsNotEmptyObject()
    @ValidateNested({ each: true })
    @Type(() => ResourceAction)
    create: ResourceAction;
  
    @IsOptional()
    @IsNotEmptyObject()
    @ValidateNested({ each: true })
    @Type(() => ResourceAction)
    update: ResourceAction;
  
    @IsOptional()
    @IsNotEmptyObject()
    @ValidateNested({ each: true })
    @Type(() => ResourceAction)
    delete: ResourceAction;
  
  }
  
  export class UpdateRoleDto {
  
    @IsOptional()
    @IsString()
    @MaxLength(50)
    public readonly roleName: string;
  
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Resource)
    public readonly resources: Resource[]
  }
