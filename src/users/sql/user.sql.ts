import { Prisma } from '@prisma/client';

export function getUserSightingStats(
  userId: number,
  favoriteBirdId: number,
): Prisma.Sql {
  return Prisma.sql`
    -- CTE: All user's sightings
    WITH all_sightings AS (
      SELECT
        "Sighting".id AS "sightingId",
        "birdId",
        "commonName",
        date,
        "isNew",
        rarity,
        family,
        "locationId",
        name
      FROM "Sighting"
      JOIN "Bird"
      ON "birdId" = "Bird".id
      LEFT JOIN "Location" -- Include rows w/null values
      ON "locationId" = "Location".id
      WHERE "Sighting"."userId" = ${userId}
    )
    
    -- Queries
    SELECT
      -- Count all sightings
      (SELECT CAST(COUNT(*) AS int) FROM all_sightings) AS "countOfAllSightings",
      -- Count life list sightings
      (SELECT CAST(count(*) as int)
        FROM (SELECT DISTINCT "birdId" FROM all_sightings)
      ) AS "countOfLifeListSightings",
      -- Oldest sighting
      (SELECT MIN(date) FROM all_sightings) AS "oldestSighting",
      -- Newest sighting
      (SELECT MAX(date) FROM all_sightings) AS "newestSighting",
      -- Newest life list sighting
      (
        SELECT json_agg(
          json_build_object(
            'sightingId', "sightingId", 'birdId', "birdId", 'commonName', "commonName", 'date', date
            )
        )
        FROM (
          SELECT *
          FROM all_sightings
          WHERE "isNew" = true
          ORDER BY
            date DESC,
            "sightingId" DESC
          LIMIT 1
        )
      ) AS "newestLifeListSighting",
      -- Count of common rarity sightings
      (
        SELECT CAST(COUNT(*) AS int) 
        FROM all_sightings
        WHERE rarity = 'Common'
      ) AS "countOfCommonSightings",
      -- Count of uncommon rarity sightings
      (
        SELECT CAST(COUNT(*) AS int) 
        FROM all_sightings
        WHERE rarity = 'Uncommon'
      ) AS "countOfUncommonSightings",
      -- Count of rare rarity sightings
      (
        SELECT CAST(COUNT(*) AS int) 
        FROM all_sightings
        WHERE rarity = 'Rare'
      ) AS "countOfRareSightings",
      -- Count of sightings w/o a location
      (
        SELECT CAST(COUNT(*) AS int)
        FROM all_sightings
        WHERE "locationId" IS NULL
      ) AS "countOfSightingsWithoutLocation",
      -- Count fav sightings
      (
        SELECT CAST(COUNT(*) AS int)
        FROM all_sightings 
        WHERE "birdId" = ${favoriteBirdId}
      ) AS "countOfFavBirdSightings",
      -- Oldest fav sighting
      (
        SELECT MIN(date)
        FROM all_sightings
        WHERE "birdId" = ${favoriteBirdId}
      ) AS "oldestFavSighting",
      -- Newest fav sighting
      (
        SELECT MAX(date)
        FROM all_sightings
        WHERE "birdId" = ${favoriteBirdId}
      ) AS "newestFavSighting",
      -- Top 5 most-sighted birds
      (
        SELECT json_agg(
          json_build_object('birdId', "birdId", 'commonName', "commonName", 'count', count)
          )
        FROM (
          SELECT "birdId", "commonName", COUNT(*) AS count
          FROM all_sightings
          GROUP BY "birdId", "commonName"
          ORDER BY count DESC, "commonName"
          LIMIT 5
        )
      ) AS "topThreeBirds",
      -- Top 5 locations by most sightings
      (
        SELECT json_agg(
          json_build_object('locationId', "locationId", 'name', name, 'count', count)
          )
        FROM (
          SELECT "locationId", "name", COUNT(*) AS count
          FROM all_sightings
          GROUP BY "locationId", "name"
          ORDER BY count DESC, "name"
          LIMIT 5
        )
      ) AS "topThreeLocations",
      -- Top 5 dates by most sightings
      (
        SELECT json_agg(
          json_build_object('date', "date", 'count', count)
          )
        FROM (
          SELECT date, COUNT(*) AS count
          FROM all_sightings
          GROUP BY date
          ORDER BY count DESC
          LIMIT 5
        )
      ) AS "topThreeDates",
      -- Top 5 bird families by sightings
      (
        SELECT json_agg(
          json_build_object('family', "family", 'count', count)
      )
        FROM (
          SELECT family, COUNT(*) AS count
          FROM all_sightings
          GROUP BY family
          ORDER BY count DESC
          LIMIT 5
        )
      ) AS "topThreeFamilies";
  `;
}
