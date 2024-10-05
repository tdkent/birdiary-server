import { hash } from 'bcrypt';
import { SALT_ROUNDS } from './auth.constants';

export async function hashPassword(password: string) {
  const hashedPassword = await hash(password, SALT_ROUNDS);
  return hashedPassword;
}
