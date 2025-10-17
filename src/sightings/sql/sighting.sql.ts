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

export function getLifeListCount(userId: number): Prisma.Sql {
  return Prisma.sql`
    SELECT CAST(count(*) as int) as count
    FROM (
      SELECT DISTINCT "birdId"
      FROM "Sighting"
      WHERE "userId" = ${userId}
    )
  `;
}

export function getLifeListSightings(
  userId: number,
  sortBy: string,
  page: number,
): Prisma.Sql {
  let inputString = Prisma.raw(`"commonName" ASC`);
  if (sortBy === 'alphaDesc') inputString = Prisma.raw(`"commonName" DESC`);
  if (sortBy === 'dateAsc') inputString = Prisma.raw(`date ASC`);
  if (sortBy === 'dateDesc') inputString = Prisma.raw(`date DESC`);
  return Prisma.sql`
    SELECT "birdId" AS id, MIN(date) AS date, "commonName"
    FROM "Sighting"
    JOIN "Bird"
    ON "birdId" = "Bird".id
    WHERE "userId" = ${userId}
    GROUP BY "birdId", "commonName"
    ORDER BY ${inputString}
    LIMIT ${RESULTS_PER_PAGE}
    OFFSET ${RESULTS_PER_PAGE * (page - 1)}
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
      CAST(REPLACE(LEFT(CAST(date AS text), 10), '-', '') AS int) AS "dateId",
      date,
      CAST(count(*) AS int) AS count,
      ARRAY_AGG("Sighting".id || ',' || "commonName" || ',' || COALESCE("imgSecureUrl", 'null')) as "sightings"
    FROM "Sighting"
    JOIN "Bird"
    ON "Sighting"."birdId" = "Bird".id
    WHERE "userId" = ${userId}
    GROUP BY date
    ORDER BY ${inputString}
    LIMIT ${RESULTS_PER_PAGE}
    OFFSET ${RESULTS_PER_PAGE * (page - 1)}
  `;
}
