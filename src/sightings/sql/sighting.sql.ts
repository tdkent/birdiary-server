import { Prisma } from '@prisma/client';
import { TAKE_COUNT } from 'src/common/constants/api.constants';

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

export function getCountOfSightingsByLocation(userId: number): Prisma.Sql {
  return Prisma.sql`
    SELECT CAST(count(*) as int) as count
    FROM (
      SELECT DISTINCT "locationId"
      FROM "Sighting"
      WHERE "userId" = ${userId}
      AND "locationId" IS NOT NULL
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
    LIMIT ${TAKE_COUNT}
    OFFSET ${TAKE_COUNT * (page - 1)}
  `;
}

export function getSightingsGroupedByLocation(
  userId: number,
  sortBy: string,
  page: number,
): Prisma.Sql {
  let inputString = Prisma.raw(`l.name ASC`);
  if (sortBy === 'count') inputString = Prisma.raw(`count DESC, l.name ASC`);
  if (sortBy === 'alphaDesc') inputString = Prisma.raw(`l.name DESC`);
  return Prisma.sql`
    SELECT
      s."locationId" AS id,
      l.name AS text,
      CAST(count(*) AS int) AS count
    FROM "Sighting" AS s
    JOIN "Location" AS l ON s."locationId" = l.id
    WHERE s."userId" = ${userId}
    AND s."locationId" IS NOT NULL
    GROUP BY s."locationId", l.name
    ORDER BY ${inputString}
    LIMIT ${TAKE_COUNT}
    OFFSET ${TAKE_COUNT * (page - 1)}
    `;
}
