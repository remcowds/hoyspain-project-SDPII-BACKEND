const {
  tables,
  getKnex
} = require('../data/index');

const tabelDienst = tables.dienst;
const uuid = require('uuid');
const { default: knex } = require('knex');


const getDiensten = async () => {

  let diensten = await getKnex()(`${tabelDienst} as w`).select('w.dienstID', 'w.dienstNaam' );
  return diensten

}

const addDienst = async (dienst) => {
  const dienstID = uuid.v4();
  return await getKnex()(tabelDienst).insert({dienstNaam:dienst, dienstID, beschrijvingDienst:""});
}

const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tabelDienst)
    .delete()
    .where('dienstID', id);

    return rowsAffected > 0;
  } catch (error) {
    console.error(error)
    throw error;
  }
};

module.exports = {
  getDiensten, addDienst, deleteById
}