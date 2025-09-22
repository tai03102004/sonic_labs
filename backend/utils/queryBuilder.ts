import { Prisma } from "@prisma/client";

export interface QueryOptions {
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  order?: string;
  select?: string;
  filters?: Record<string, any>;
}

export function buildPrismaQuery(options: QueryOptions) {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
    select,
    filters = {},
  } = options;
  const pageNum = Math.max(Number(page) || 1, 1);
  const pageSize = Math.min(Number(limit) || 10, 100);
  const skip = (pageNum - 1) * pageSize;

  // Select Fields
  let selectFields: Prisma.CourseSelect | undefined;
  if (select) {
    const fields = select.split(",").map((field) => field.trim());
    selectFields = Object.fromEntries(
      fields.map((field) => [field, true])
    ) as Prisma.CourseSelect;
  }

  return {
    where: filters,
    orderBy: { [sortBy]: order },
    skip: skip,
    take: pageSize,
    select: selectFields,
    pagination: { pageNum, pageSize },
  };
}
