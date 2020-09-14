import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class RegisterUserDto {

  @ApiProperty() /* Swagger * */
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  public readonly email: string;

  @ApiProperty() /* Swagger * */
  @IsNotEmpty()
  @MaxLength(100)
  public readonly firstName: string;

  @ApiProperty() /* Swagger * */
  @IsOptional()
  @MaxLength(100)
  @MaxLength(24)
  public readonly lastName: string;

  @ApiProperty() /* Swagger * */
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(24)
  public readonly password: string;

}
