import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

export class LoginUserDto extends PartialType(CreateUserDto) {}
