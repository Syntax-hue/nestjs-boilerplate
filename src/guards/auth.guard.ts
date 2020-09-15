
// import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

// export const AuthGuard = NestAuthGuard('jwt');


// the following is for test cases
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const fakeUser = {
      roles: ['ADMIN'],
      username: '@fake',
      id: '5f5b45b20e841b7ceadfbd62'
    };
    req.user = fakeUser;
    return true;
  }
}



