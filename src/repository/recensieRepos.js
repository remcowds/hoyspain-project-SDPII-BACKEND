const {
  tables,
  getKnex
} = require('../data/index');

const {
  formatDate
} = require('../core/datumOmzetting');
const ServiceError = require('../core/serviceError');

const tabelBeoordeling = tables.beoordeling;

const formatBeoordelingen = (beoordeling) => {
  const {
    datumBeoordeling,
    ...rest
  } = beoordeling;

  return {
    datumBeoordeling: formatDate(datumBeoordeling),
    ...rest
  }
}

const getBeoordelingenByWoning = async (woningID) => {

  const recensies = await getKnex()(tabelBeoordeling).select('beoordelingsID', 'aantalSterren', 'tekst', 'voornaam', 'achternaam', 'datumBeoordeling', `${tabelBeoordeling}.userID`)
    .join(tables.gebruiker, `${tabelBeoordeling}.userID`, '=', `${tables.gebruiker}.userID`)
    .where({
      woningID
    })
    .orderBy('datumBeoordeling');
    
  return recensies.map(formatBeoordelingen);
}

const findByUserId = (userID, woningID) => {
  return getKnex()(tables.beoordeling).select()
    .where('woningID', woningID)
    .where('userID', userID)
        
    
};

const createBeoordeling = async (recensieBody) => {
  const {
    datumBeoordeling,
    ...rest
  } = recensieBody;
  const datum = formatDate(datumBeoordeling);

  try {
    
    
    const test = await findByUserId(recensieBody.userID, recensieBody.woningID)
    if (test.length == 0) {
      await getKnex().raw(`set foreign_key_checks = 0`);
      const ret = await getKnex()(tabelBeoordeling).insert({
        ...rest,
        datumBeoordeling: datum
      })    
      await getKnex().raw(`set foreign_key_checks = 1`); 
      return await findByUserId(recensieBody.userID, recensieBody.woningID);
    }

    

    else{      
      throw ServiceError.unauthorized('Jij hebt al een review geplaatst op deze ');
    }
  } catch (error) {
    if (error.message.includes('Duplicate entry')) {
      console.log('er bestaat al een recensie met deze id')
    } else {
      console.log(error)
      throw error
    }
  }

}


module.exports = {
  getBeoordelingenByWoning,
  createBeoordeling
}