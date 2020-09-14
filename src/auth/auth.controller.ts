import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/signup-user.dto';
import { LoginUserDto, LoginUserResponseDto } from './dto/login-user.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IResponse, ResponseSuccess, StringMap } from '../core/utils';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { IsEmail } from 'class-validator';


export class Email {
  @IsEmail()
  email: string;
}

@ApiTags('Authentication') /* Swagger * */
@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService
  ) { }

  // swagger //
  @ApiOperation({ summary: 'Register a new user and sends the confirmation email' })
  // ----- //
  @Post('/register')
  public async registerCustomer(
    @Body() registerCustomerDto: RegisterUserDto
  ): Promise<IResponse> {
    if (process.env.RUN_MODE.toLowerCase() === 'prod') {
      throw new ForbiddenException();
    }
    await this.authService.registerUser(registerCustomerDto);
    await this.authService.createEmailToken(registerCustomerDto.email);
    await this.authService.sendRegistrationEmailConfirmation(registerCustomerDto.email, registerCustomerDto.firstName);
    return new ResponseSuccess('REGISTER_SUCCESS');
  }


  // swagger //
  @ApiOperation({ summary: 'Login the user by credentials and return JWT token' })
  // ----- //
  @Post('/login')
  @ApiResponse({
    type: LoginUserResponseDto,
    status: 200,
    description: 'The JWT bearer token that need to be assigned to future requests'
  })
  public async loginCustomer(
    @Body() loginUserDto: LoginUserDto
  ) {
    return await this.authService.loginUser(loginUserDto);
  }

  // swagger //
  @ApiParam({ name: 'token', type: String })
  @ApiOperation({ summary: 'Confirm the registration by providing token from sent email' })
  // ----- //
  @Get('/confirm-registration/:token')
  public async emailConfirmation(
    @Param() params: StringMap<string>
  ) {
    try {
      const isEmailVerified = await this.authService.verifyEmail(params.token);
      return new ResponseSuccess("LOGIN.EMAIL_VERIFIED", isEmailVerified);
    } catch (e) {
      throw new HttpException(e.message || 'CONFIRMATION.ERROR', e.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // swagger //
  @ApiParam({ name: 'email', type: String })
  @ApiOperation({ summary: 'Send a reset password token to specified email' })
  // ----- //
  @Get('/reset-password/:email')
  public async forgotPassword(
    @Param() params: Email
  ): Promise<IResponse> {
    try {
      await this.authService.createResetPasswordToken(params.email);
      await this.authService.sendResetPasswordEmail(params.email);
      return new ResponseSuccess('EMAIL_SENT_SUCCESSFULLY');
    } catch (e) {
      throw new HttpException(e.message || 'RESET_PASSWORD.ERROR', e.status || HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }

  // swagger //
  @ApiOperation({ summary: 'Reset the user password by providing token sent from email and new password' })
  // ----- //
  @Post('/reset-password')
  public async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto
  ): Promise<IResponse> {
    try {
      if (await this.authService.resetPassword(resetPasswordDto)) {
        return new ResponseSuccess('PASSWORD_RESET_SUCCESSFULLY');
      }
      throw new BadRequestException('FAILED_RESET_PASSWORD')
    } catch (e) {
      throw new HttpException(e.message || 'RESET_PASSWORD_ERROR', e.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }
}
