import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength, IsEnum } from "class-validator";
import { AppRoles } from "src/app.roles";

export class CreateUserDto {

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  public readonly email;

  @IsNotEmpty()
  @MaxLength(100)
  public readonly firstName;

  @IsOptional()
  @MaxLength(100)
  public readonly lastName;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(24)
  public readonly password;

  @IsEnum(AppRoles, { each: true })
  @IsNotEmpty()
  public readonly roles;
}