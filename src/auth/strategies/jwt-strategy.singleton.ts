import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as mongoose from 'mongoose';
import { AppRoles } from '../../app.roles';

@Injectable()
export class JwtStrategySingleton extends PassportStrategy(Strategy) implements IJwtStrategySingleton {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<IJwtPayload> {
    return { _id: payload._id, firstName: payload.firstName, roles: payload.roles };
  }
}

export interface IJwtStrategySingleton {
  validate: (payload: any) => Promise<IJwtPayload>
}

export interface IJwtPayload {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  roles: [AppRoles];
}
