import { Injectable, Logger } from '@nestjs/common';
import { CrudService } from '../core/crud/crud.service';
import { Notifications, NotificationsArea } from './schema/notifications.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ISendEmailDetails } from '../auth/auth.service';

import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService extends CrudService<Notifications> {
  constructor(
    @InjectModel('notifications') private notifications: Model<Notifications>
  ) {
    super(notifications);
  }


  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_MAILER_LOGIN,
      pass: process.env.GMAIL_MAILER_PASSWORD
    }
  });

  public async sendEmailToRegisteredNotifiers(
    details: ISendEmailDetails,
    area: NotificationsArea
  ): Promise<void> {
    const notifiers = await this.getAll();
    notifiers.forEach(notifier => {
      if (notifier.area.includes(area)) {
        this.sendEmail({
          to: notifier.receiverEmail,
          ...details
        });
      }
    });
  }

  public async sendEmail(details: ISendEmailDetails): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: details.from,
        to: details.to,
        subject: details.subject,
        html: details.html,
      });
      Logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } catch (e) {
      Logger.log(e)
    }
    return true;
  }

}
