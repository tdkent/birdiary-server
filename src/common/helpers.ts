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
  const idsWithoutImgs = [156, 179, 422, 649, 768, 777];
  for (let i = 1; i <= BIRD_COUNT; i++) {
    if (idsWithoutImgs.includes(i)) continue;
    arr.push(i);
  }
  return arr;
}
