import { Op, Sequelize } from "sequelize";

export const buildWhereClause = (query, config) => {
  const where = {};

  /* Keyword search across multiple fields */
  if (query.keyword && config.searchFields) {
    where[Op.or] = config.searchFields.map((field) => {
      /* If field is in list */
      if (config.numericFields?.includes(field)) {
        return {
          [Op.and]: [
            Sequelize.where(Sequelize.cast(Sequelize.col(field), "VARCHAR"), {
              [Op.like]: `%${query.keyword}%`,
            }),
          ],
        };
      }
      return { [field]: { [Op.like]: `%${query.keyword}%` } };
    });
  }

  /* Exact filter (equal) */
  if (config.exactFields) {
    config.exactFields.forEach((field) => {
      if (query[field]) {
        where[field] = query[field];
      }
    });
  }

  /* Like filter (month, day, etc.) */
  if (config.likeFields) {
    config.likeFields.forEach((field) => {
      if (query[field]) {
        where[field] = {
          [Op.like]: `%${query[field]}%`,
        };
      }
    });
  }

  /* Range (min max) */
  if (config.rangeFields) {
    config.rangeFields.forEach((field) => {
      const min = query[`min${field}`];
      const max = query[`max${field}`];

      if (min || max) {
        where[field] = {};

        if (min) where[field][Op.gte] = Number(min);
        if (max) where[field][Op.lte] = Number(max);
      }
    });
  }

  return where;
};

export const searchService = async (model, query, pagination, config = {}) => {
  const { offset, limit, page, finalSize } = pagination;

  const where = buildWhereClause(query, config);

  /* Merge forcedWhere - cannot be overridden */
  const finalWhere = config.forcedWhere
    ? { ...where, ...config.forcedWhere }
    : where;

  const { count, rows } = await model.findAndCountAll({
    where: finalWhere,
    limit: limit !== null ? limit : undefined,
    offset: limit !== null ? offset : undefined,
    order: config.order || [["createdAt", "DESC"]],
    include: config.include || [],
    ...(config.subQuery !== undefined && { subQuery: config.subQuery }),
  });

  return {
    totalItems: count,
    totalPages: limit ? Math.ceil(count / finalSize) : 1,
    currentPage: page,
    pageSize: finalSize,
    data: rows,
  };
};
