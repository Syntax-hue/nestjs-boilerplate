import { IsArray, IsOptional, IsString, MaxLength, MinLength, IsNotEmpty } from "class-validator";

export class CreateNewsDto {
    
    @IsString()
    @MaxLength(100)
    @MinLength(5)
    @IsNotEmpty()
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
    @IsNotEmpty()
    public readonly frontImage;

    @IsNotEmpty()
    @IsString()
    public readonly html;
}