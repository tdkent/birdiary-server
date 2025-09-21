import { compare, hash } from 'bcrypt';
import { SALT_ROUNDS } from './constants';

export async function hashPassword(password: string) {
  const hashedPassword = await hash(password, SALT_ROUNDS);
  return hashedPassword;
}

export async function comparePassword(
  requestPassword: string,
  databasePassword: string,
) {
  const isValid = await compare(requestPassword, databasePassword);
  return isValid;
}
