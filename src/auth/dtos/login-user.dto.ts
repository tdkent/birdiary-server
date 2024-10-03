import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

export class LoginUserDto extends OmitType(CreateUserDto, ['name'] as const) {}
