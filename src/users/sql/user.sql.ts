import { Prisma } from '@prisma/client';

export function getUserSightingStats(userId: number): Prisma.Sql {
  return Prisma.sql`
    SELECT * FROM "Sighting"
    WHERE "userId" = ${userId}
  `;
}
