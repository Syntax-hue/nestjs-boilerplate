import { IsArray, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateNewsDto {
    
    @IsString()
    @IsOptional()
    @MaxLength(100)
    @MinLength(5)
    public readonly title;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    @MinLength(5)
    public readonly shortDescription;

    @IsString()
    @IsOptional()
    @IsArray()
    public readonly tags;

    @IsString()
    @IsOptional()
    public readonly frontImage;
    
    @IsString()
    @IsOptional()
    public readonly updateAt;
}