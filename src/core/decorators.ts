import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const UserData = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
