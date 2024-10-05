import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from '../../users/dtos/create-user.dto';

export class LoginUserDto extends PartialType(CreateUserDto) {}
