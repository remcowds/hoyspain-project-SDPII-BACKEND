const uuid = require('uuid');
const {
  tables,
  getKnex
} = require('../data/index');


const getAllRegios = ({
  limit,
  offset,
}) => {
  return getKnex()(tables.regio)
    .select()
    .limit(limit)
    .offset(offset)
    .orderBy('regio', 'ASC');
};

const findByRegio = (regio) => {
  return getKnex()(tables.regio)
    .where('regio', regio)
    .first();
};

const findById = (id) => {
  return getKnex()(tables.regio)
    .where('id', id)
    .first();
};

const findCount = async () => {
  const [count] = await getKnex()(tables.regio)
    .count();
  return count['count(*)'];
};

const updateById = async (id, {
  regio,
}) => {
  try {
    await getKnex()(tables.regio)
      .update({
        regio,
      })
      .where('id', id);

    return await findById(id);
  } catch (error) {
    const logger = getChildLogger('brands-repo');
    logger.error('Error in updateById', {
      error,
    });
    throw error;
  }
};


const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.brands)
      .delete()
      .where('id', id);

    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger('brands-repo');
    logger.error('Error in deleteById', {
      error,
    });
    throw error;
  }
};

module.exports = {
  getAllRegios,
  findById,
  findCount,
  findByRegio,
  updateById,
  deleteById,
};