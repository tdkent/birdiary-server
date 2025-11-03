import { Prisma } from '@prisma/client';
import { RESULTS_PER_PAGE } from '../../common/constants';

export function getBirdsBySearchTerm(
  searchTerm: string,
  page: number,
): Prisma.Sql {
  return Prisma.sql`
    SELECT *
    FROM "Bird"
    LIMIT ${RESULTS_PER_PAGE}
    OFFSET ${RESULTS_PER_PAGE * (page - 1)}
  `;
}
