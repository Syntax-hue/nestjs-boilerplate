import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategySingleton } from './strategies/jwt-strategy.singleton';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailConfirmationSchema } from './schemas/email-confirmation.schema';
import { ResetPasswordSchema } from './schemas/reset-password.schema';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {expiresIn: parseInt(process.env?.JWT_EXPIRE) || 3600}
      })
    }),
    MongooseModule.forFeature([{ name: 'email-confirmation', schema: EmailConfirmationSchema }]),
    MongooseModule.forFeature([{ name: 'reset-password', schema: ResetPasswordSchema }]),

  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategySingleton]
})
export class AuthModule {}
