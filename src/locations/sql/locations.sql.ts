import { Prisma } from '@prisma/client';
import { RESULTS_PER_PAGE } from '../../common/constants';

export function getLocationsWithSightings(
  userId: number,
  sortBy: string,
  page: number,
): Prisma.Sql {
  let inputString = Prisma.raw(`name ASC`);
  if (sortBy === 'count') inputString = Prisma.raw(`count DESC, name ASC`);
  if (sortBy === 'alphaDesc') inputString = Prisma.raw(`name DESC`);
  return Prisma.sql`
    SELECT
      "Location".id,
      name,
      CAST(count(*) AS int) AS count,
      ARRAY_AGG(
        "Sighting".id || ',' || "commonName" || ',' || COALESCE("imgSecureUrl", null)
        ) AS "sightings"
    FROM "Location"
    JOIN "Sighting"
    ON "Location"."id" = "Sighting"."locationId"
    JOIN "Bird"
    ON "Sighting"."birdId" = "Bird".id
    WHERE "Location"."userId" = ${userId}
    GROUP BY "Location".id
    ORDER BY ${inputString}
    LIMIT ${RESULTS_PER_PAGE}
    OFFSET ${RESULTS_PER_PAGE * (page - 1)}
  `;
}
