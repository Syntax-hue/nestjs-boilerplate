import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength, IsEnum } from "class-validator";
import { AppRoles } from "src/app.roles";

export class UpdateUserDto {

    @IsEmail()
    @IsOptional()
    @MaxLength(100)
    public readonly email;

    @IsOptional()
    @MaxLength(100)
    public readonly firstName;

    @IsOptional()
    @MaxLength(100)
    public readonly lastName;

    @IsOptional()
    @MinLength(6)
    @MaxLength(24)
    public readonly password;

    @IsEnum(AppRoles, { each: true })
    @IsOptional()
    public readonly roles;
}