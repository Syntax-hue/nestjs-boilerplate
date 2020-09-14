import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {

  @ApiProperty() /* Swagger * */
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  public readonly email: string;

  @ApiProperty()  /* Swagger * */
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(24)
  public readonly password: string;
}

export class LoginUserResponseDto {
  @ApiProperty() /* Swagger * */
  jwt: string;
}
