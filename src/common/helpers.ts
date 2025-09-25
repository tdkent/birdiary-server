import { compare, hash } from 'bcrypt';
import { BIRD_COUNT, SALT_ROUNDS } from './constants';

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

/** Create an array of integers 1 - total count of bird species. */
export function createBirdOfTheDayIdsArray(): number[] {
  const arr = [];
  for (let i = 1; i <= BIRD_COUNT; i++) {
    arr.push(i);
  }
  return arr;
}
