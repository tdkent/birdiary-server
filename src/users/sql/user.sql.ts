import { Prisma } from '@prisma/client';

export function getUserSightingStats(
  userId: number,
  favoriteBirdId: number,
): Prisma.Sql {
  return Prisma.sql`
    -- CTE 1: All sightings
    WITH all_sightings AS (
      SELECT * FROM "Sighting"
      WHERE "userId" = ${userId}
    ),
    -- CTE 2: All fav bird sightings
    fav_sightings AS (
      SELECT * FROM "Sighting"
      WHERE "userId" = ${userId}
      AND "birdId" = ${favoriteBirdId}
    )
    -- Queries
    SELECT
      -- Count all sightings
      (SELECT CAST(COUNT(*) AS int) FROM all_sightings) AS "countOfAllSightings",
      -- Oldest sighting
      (SELECT MIN(date) FROM all_sightings) AS "oldestSighting",
      -- Newest sighting
      (SELECT MAX(date) FROM all_sightings) AS "newestSighting",
      -- Count of common rarity sightings
      (
        SELECT CAST(COUNT(*) AS int) 
        FROM all_sightings
        JOIN "Bird" b
        ON all_sightings."birdId" = b.id
        WHERE b.rarity = 'Common'
      ) AS "countOfCommonSightings",
      -- Count of uncommon rarity sightings
      (
        SELECT CAST(COUNT(*) AS int) 
        FROM all_sightings
        JOIN "Bird" b
        ON all_sightings."birdId" = b.id
        WHERE b.rarity = 'Uncommon'
      ) AS "countOfUncommonSightings",
      -- Count of rare rarity sightings
      (
        SELECT CAST(COUNT(*) AS int) 
        FROM all_sightings
        JOIN "Bird" b
        ON all_sightings."birdId" = b.id
        WHERE b.rarity = 'Rare'
      ) AS "countOfRareSightings",
      -- Count fav sightings
      (SELECT CAST(COUNT(*) AS int) FROM fav_sightings) AS "countOfFavBirdSightings",
      -- Oldest fav sighting
      (
        SELECT MIN(date)
        FROM fav_sightings
        WHERE "birdId" = ${favoriteBirdId}
      ) AS "oldestFavSighting",
      -- Newest fav sighting
      (
        SELECT MAX(date)
        FROM fav_sightings
        WHERE "birdId" = ${favoriteBirdId}
      ) AS "newestFavSighting",
  `;
}
