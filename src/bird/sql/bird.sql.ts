import { Prisma } from '@prisma/client';
import { RESULTS_PER_PAGE } from '../../common/constants';

export function getSearchCount(searchTerm: string): Prisma.Sql {
  return Prisma.sql`
    SELECT CAST(COUNT(id) AS int) AS count
    FROM "Bird"
    WHERE "commonName" ILIKE CONCAT('%', ${searchTerm}, '%')
    OR family ILIKE CONCAT('%', ${searchTerm}, '%')
  `;
}

export function getBirdsBySearchTerm(
  searchTerm: string,
  page: number,
  id: number | null,
): Prisma.Sql {
  const userId = id || null;
  return Prisma.sql`
    SELECT
      *,
      CASE
        WHEN CAST(${userId} AS int) IS NOT NULL THEN (
          SELECT CAST(COUNT(*) AS int)
          FROM "Sighting"
          WHERE "birdId" = "Bird".id
          AND "userId" = ${userId}
          )
        ELSE 0 END AS count
    FROM "Bird"
    WHERE "commonName" ILIKE CONCAT('%', ${searchTerm}, '%')
    OR family ILIKE CONCAT('%', ${searchTerm}, '%')
    ORDER BY
      CASE
        WHEN POSITION(LOWER(${searchTerm}) IN LOWER("commonName")) > 0 THEN 2
        WHEN POSITION(LOWER(${searchTerm}) IN LOWER(family)) > 0 THEN 1
        ELSE 0
      END DESC,
      id ASC
    LIMIT ${RESULTS_PER_PAGE}
    OFFSET ${RESULTS_PER_PAGE * (page - 1)}
  `;
}
