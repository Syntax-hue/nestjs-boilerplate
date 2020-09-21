import {
  BadRequestException, ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/signup-user.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/schema/user.schema';

import * as bcrypt from 'bcrypt';
import { LoginUserDto, LoginUserResponseDto } from './dto/login-user.dto';
import { IJwtPayload } from './strategies/jwt-strategy.singleton';
import { JwtService } from '@nestjs/jwt';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailConfirmation } from './schemas/email-confirmation.schema';
import { getPassedMinutes } from '../core/utils';
import { ResetPassword } from './schemas/reset-password.schema';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { AppRoles } from 'src/app.roles';

const SALT_ROUNDS = 10;
const EMAIL_SENT_LIMIT_MINUTES = 30;
const EMAIL_TOKEN_EXPIRATION_MINUTES = 30;

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private notificationService: NotificationsService,
    @InjectModel('email-confirmation') private emailConfirmationModel: Model<EmailConfirmation>,
    @InjectModel('reset-password') private resetPasswordModel: Model<ResetPassword>
  ) { }

  public async createAdmin(): Promise<void> {
    const adminUser = await this.usersService.get({ email: process.env.ADMIN_EMAIL });
    if (adminUser) throw new ForbiddenException();

    await this.usersService.create({
      firstName: 'ADMIN',
      lastName: 'ADMIN',
      roles: [AppRoles.ADMIN],
      email: process.env.ADMIN_EMAIL,
      password: await bcrypt.hash('123456', SALT_ROUNDS),
      isActive: true,
      isEmailConfirmed: true,
    })
  }

  public async registerUser(registerUserDto: RegisterUserDto): Promise<void> {
    if (await this.usersService.getByEmail(registerUserDto.email)) {
      throw new BadRequestException('EMAIL_ALREADY_EXISTS');
    }
    await this.usersService.create({
      ...registerUserDto,
      password: await bcrypt.hash(registerUserDto.password, SALT_ROUNDS)
    });
  }

  public async loginUser(loginUserDto: LoginUserDto): Promise<LoginUserResponseDto> {
    try {
      console.log(2);

      const user = await this.validateCustomer(loginUserDto.email, loginUserDto.password);
      console.log(1);


      console.log(user);
      if (user) {
        console.log(111);

        const payload: IJwtPayload = { _id: user.id, firstName: user.firstName, roles: user.roles }

        return {
          jwt: this.jwtService.sign(payload)
        }
      }

      console.log('yes');

    } catch (e) {
      console.log('yes');

      throw new HttpException(e.message || 'SOMETHING_BAD_HAPPEN', e.status || HttpStatus.INTERNAL_SERVER_ERROR)
    }
    console.log('yes');

    throw new UnauthorizedException('INVALID_CREDENTIALS');
  }

  private async validateCustomer(email: string, password: string): Promise<User> {
    const user = await this.usersService.getByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      if (!user.isEmailConfirmed) {
        throw new ForbiddenException('EMAIL_NOT_VERIFIED')
      }
      return user;
    }
    return null;
  }

  public async verifyEmail(token: string): Promise<boolean> {
    const emailVerification = await this.emailConfirmationModel.findOne({ emailToken: token });
    if (emailVerification && emailVerification.email) {
      const user = await this.usersService.getByEmail(emailVerification.email);
      if (user) {
        const updateUser = await this.usersService.update({ _id: user._id }, { isEmailConfirmed: true });
        await this.emailConfirmationModel.remove(emailVerification);
        return !!updateUser;
      }
      throw new BadRequestException('USER_NOT_FOUND');
    } else {
      throw new BadRequestException('INVALID_VERIFICATION_TOKEN');
    }
  }

  public async createEmailToken(email: string): Promise<boolean> {
    const emailVerificationEntity = await this.emailConfirmationModel.findOne({ email });
    if (emailVerificationEntity && (getPassedMinutes(emailVerificationEntity.timestamp) < EMAIL_SENT_LIMIT_MINUTES)) {
      throw new BadRequestException('TOKEN_SEND_RECENTLY');
    } else {
      await this.emailConfirmationModel.findOneAndUpdate({ email }, {
        email,
        emailToken: String(Math.floor(1000 + Math.random() * 9000)),
        timestamp: new Date()
      }, { upsert: true });
      return true;
    }
  }

  public async createResetPasswordToken(email: string): Promise<boolean> {
    const passwordResetEntity = await this.resetPasswordModel.findOne({ email });
    if (passwordResetEntity && (getPassedMinutes(passwordResetEntity.timestamp) < EMAIL_SENT_LIMIT_MINUTES)) {
      throw new BadRequestException('TOKEN_SEND_RECENTLY');
    } else {
      await this.resetPasswordModel.findOneAndUpdate({ email }, {
        email,
        resetToken: String(Math.floor(1000 + Math.random() * 9000)),
        timestamp: new Date()
      }, { upsert: true });
      return true;
    }
  }

  public async sendResetPasswordEmail(email: string): Promise<boolean> {
    const resetPassword = await this.resetPasswordModel.findOne({ email });
    return await this.notificationService.sendEmail({
      from: 'Company',
      name: '',
      to: email,
      subject: 'Forgot Password Code',
      html: `
        <h3> Hello dear user</h3>
        <p>
          The forgot password code is: <b>${resetPassword.resetToken}</b>
        </p>`
    });
  }

  public async sendRegistrationEmailConfirmation(email: string, name: string = null): Promise<boolean> {
    const emailConfirmation = await this.emailConfirmationModel.findOne({ email });
    return await this.notificationService.sendEmail({
      from: 'Company',
      name,
      to: email,
      subject: 'Company Registration Confirmation Code',
      html: `
        <h3> Hello dear ${name || 'customer'}</h3>
        <p>
          The registration confirmation code is: <b>${emailConfirmation.emailToken}</b>
        </p>`
    });
  }

  public async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<boolean> {
    const resetPasswordEntity = await this.resetPasswordModel.findOne({ resetToken: resetPasswordDto.resetToken });
    if (getPassedMinutes(resetPasswordEntity?.timestamp) > EMAIL_TOKEN_EXPIRATION_MINUTES) {
      throw new BadRequestException('TOKEN_EXPIRED');
    }
    if (resetPasswordEntity) {
      const userEntity = await this.usersService.getByEmail(resetPasswordEntity.email);
      await this.usersService.update(userEntity._id, {
        password: await bcrypt.hash(resetPasswordDto.newPassword, SALT_ROUNDS)
      });
      await this.resetPasswordModel.remove(resetPasswordEntity);
      return true;
    }
    throw new BadRequestException('INVALID_TOKEN');
  }
}


export interface ISendEmailDetails {
  to?: string;
  name?: string;
  from: string;
  subject: string;
  html: string;
}
