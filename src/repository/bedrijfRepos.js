const {
  tables,
  getKnex
} = require('../data/index');

const uuid = require('uuid');
const tabelBedrijf = tables.bedrijf;
const tabelDienst= tables.dienst;
const dienstenService = require('../service/dienstenService');
const bedrijfService = require('../service/bedrijfService');


// const formatBedrijven = async (beoordeling) => {

// }

const getBedrijven = async (queryParams) => {
  const filterDienst = queryParams.dienstNaam;

  const bedrijven = await getKnex()(tabelBedrijf).select()
    .join(tables.dienst, `${tabelBedrijf}.dienstID`, '=', `${tables.dienst}.dienstID`)
    .modify(function (qb) {
      if (filterDienst) {
        qb.where('dienstNaam', 'like', `%${filterDienst}%`)
      }
    });

  return bedrijven

}

const createBedrijf = async ({body, url}) => {
  const {
    naam,
    link,
    tekst,
    dienst
  } = body;
  const bedrijfsID = uuid.v4();
  const deDienst = await getKnex()(tabelDienst).select().where('dienstNaam', dienst);
  //if deDienst empty
  if (deDienst.length === 0) {
    console.log("de dienst bestaat niet, aanmaken van:" + dienst)
    await dienstenService.addDienst(dienst);
  }
  const dienstID = await getKnex()(tabelDienst).select().where('dienstNaam', dienst).first();
  

  try {
      return await getKnex()(tabelBedrijf).insert({
        bedrijfsNaam: naam,
        linkBedrijf: link,
        tekstjeBedrijf: tekst,
        fotoBedrijf:url,
        bedrijfsID,
        dienstID:dienstID.dienstID
      })     
  } catch (error) {
    console.log(error)
  }
}



const deleteById = async (id) => {
  try {
    const getBedrijf = await findById(id);
    const rowsAffected = await getKnex()(tabelBedrijf)
    .delete()
    .where('bedrijfsID', id);
    const aantalNogInDienst = await getKnex()(tabelBedrijf).select().where('dienstID', getBedrijf.dienstID);
    if (aantalNogInDienst.length === 0) {
      await getKnex().raw(`set foreign_key_checks = 0`);
      await dienstenService.deleteById(getBedrijf.dienstID);
      await getKnex().raw(`set foreign_key_checks = 1`);
    }
    return rowsAffected > 0;
  } catch (error) {
    console.error(error)
    throw error;
  }
};

const findById = (id) => {
  return getKnex()(tabelBedrijf)
    .where('bedrijfsID', id)
    .first();
};

module.exports = {
  getBedrijven,
  createBedrijf,
  deleteById,
  findById
}