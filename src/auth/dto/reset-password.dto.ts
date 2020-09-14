import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';


export class ResetPasswordDto {

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(100)
  public readonly resetToken: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(24)
  public readonly newPassword: string;
}
