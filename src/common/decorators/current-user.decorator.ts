import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // if 'id' is passed as an arg to the decorator
    // i.e. @CurrentUser('id'), the return value
    // will be user.id. If no arg is passed, the
    // return value is the entire request.user object.
    if (data) {
      return user[data];
    }

    return data;
  },
);
