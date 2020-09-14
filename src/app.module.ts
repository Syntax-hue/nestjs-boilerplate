import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessControlModule } from 'nest-access-control';
import { UsersModule } from './users/users.module';
import { createRolesFactory } from './app.roles';
import { RolesBuilderModule } from './roles-builder/roles-builder.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { RolesBuilderService } from './roles-builder/roles-builder.service';
import { NotificationsModule } from './notifications/notifications.module';
import { DictionaryModule } from './dictionary/dictionary.module';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      useFindAndModify: false,
      useCreateIndex: true,
    }),
    AccessControlModule.forRootAsync(
      {
        inject: [RolesBuilderService],
        useFactory: createRolesFactory
      }
    ),
    UsersModule,
    RolesBuilderModule,
    NotificationsModule,
    AuthModule,
    DictionaryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
