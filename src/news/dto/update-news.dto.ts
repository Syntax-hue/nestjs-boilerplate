import { IsArray, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateNewsDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    @MinLength(5)
    public readonly title;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    @MinLength(5)
    public readonly shortDescription;

    @IsOptional()
    @IsString()
    @IsArray()
    public readonly tags;

    @IsOptional()
    @IsString()
    public readonly frontImage;

    @IsOptional()
    @IsString()
    public readonly html;
}