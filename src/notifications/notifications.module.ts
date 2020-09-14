import { Global, Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsSchema } from './schema/notifications.schema';
import { PassportModule } from '@nestjs/passport';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{name: 'notifications', schema: NotificationsSchema}]),
    PassportModule.register({defaultStrategy: 'jwt'}),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService]
})
export class NotificationsModule {}
