import { Prisma } from '@prisma/client';
import { RESULTS_PER_PAGE } from '../../common/constants';

export function getCountOfSightingsByDate(userId: number): Prisma.Sql {
  return Prisma.sql`
    SELECT CAST(count(*) as int) as count
    FROM (
      SELECT date
      FROM "Sighting"
      WHERE "userId" = ${userId}
      GROUP BY date
      )
    `;
}

export function getCountOfSightingsByDistinctBird(userId: number): Prisma.Sql {
  return Prisma.sql`
    SELECT CAST(count(*) as int) as count
    FROM (
      SELECT DISTINCT "birdId"
      FROM "Sighting"
      WHERE "userId" = ${userId}
    )
  `;
}

export function getSightingsGroupedByDate(
  userId: number,
  sortBy: string,
  page: number,
): Prisma.Sql {
  let inputString = Prisma.raw(`date DESC`);
  if (sortBy === 'count') inputString = Prisma.raw(`count DESC, date DESC`);
  if (sortBy === 'dateAsc') inputString = Prisma.raw(`date ASC`);
  return Prisma.sql`
    SELECT
      CAST(
        REPLACE(
        LEFT(CAST(date AS text), 10), '-', ''
      ) AS int) AS id,
      date AS text,
      CAST(count(*) AS int) AS count
    FROM "Sighting"
    WHERE "userId" = ${userId}
    GROUP BY date
    ORDER BY ${inputString}
    LIMIT ${RESULTS_PER_PAGE}
    OFFSET ${RESULTS_PER_PAGE * (page - 1)}
  `;
}
