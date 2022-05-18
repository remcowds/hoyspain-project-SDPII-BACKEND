const {
  tables,
  getKnex
} = require('../data/index');

const userRepository = require('../repository/userRepos');

const {
  formatDate
} = require('../core/datumOmzetting');

const tabelBoeking = tables.boeking;
const tabelWoning = tables.woning;

const getUserFromWoningID = async (id) => {
  const woning = await getKnex()(tabelWoning)
    .select()
    .join(tables.regio, `${tabelWoning}.regio_id`, "=", `${tables.regio}.id`)
    .where({
      woningID: id,
    })
    .first();

  if (woning) {
    return await userRepository.findById(woning.userID);
  } else {
    console.log("geen woning gevonden met id " + id);
  }
};

const formatBoekingen = async (boeking) => {
  let rating = await getKnex()(tables.beoordeling).avg('aantalSterren as aantal').where({
    woningID: boeking.woningID
  }).first();

  const {
    woningID,
    naamWoning,
    linkAfbeeldingen,
    adres,
    type,
    prijsPerNachtPerPersoon,
    kopen,
    aantalPersonen,
    wifi,
    zeezicht,
    zwembad,
    airco,
    korteBeschrijving,
    beschrijving,
    oppervlakte,
    avontuur,
    reizen,
    culinair,
    ontspanning,
    sporten,
    regio,
    ...rest
  } = boeking;

  return {
    ...rest,
    woning: {
      woningID,
      naamWoning,
      linkAfbeeldingen: JSON.parse(linkAfbeeldingen),
      adres,
      type,
      prijsPerNachtPerPersoon,
      kopen,
      aantalPersonen,
      wifi,
      zeezicht,
      zwembad,
      airco,
      korteBeschrijving,
      beschrijving,
      oppervlakte,
      avontuur,
      reizen,
      culinair,
      ontspanning,
      sporten,
      regio,
      rating: Math.round(Number(rating.aantal)) || null,
    }
  }

}

const getBoekingen = async (queryParams) => {
  const userID = queryParams.userID;

  const boekingen = await getKnex().select().from((`${tabelBoeking} as b`))
    .join(`${tables.woning} as w`, `b.woningID`, '=', `w.woningID`)
    .join(`${tables.regio} as r`, 'w.regio_id', '=', 'r.id')
    .modify(qb => {
      if (userID) {
        qb.whereRaw(
          `b.userID = '${userID}'`
        )
      }
    })

  return await Promise.all(boekingen.map(formatBoekingen));
}

const getBoekingByID = async (boekingsID) => {
  return await getKnex().select().from(tabelBoeking).where({
    boekingsID
  }).first();
}

const formatBoekingenByWoning = (boeking) => {
  return {
    ...boeking,
    datumAankomst: formatDate(boeking.datumAankomst),
    datumVertrek: formatDate(boeking.datumVertrek)
  }
}
//niet boekingen uit het verleden ophalen, niet nodig
const getBoekingenByWoning = async (woningID) => {
  let boekingen = await getKnex()(tabelBoeking).select().where({
    woningID
  }).andWhereRaw('datumAankomst > date(now())')

  boekingen = boekingen.map(formatBoekingenByWoning);

  return boekingen;
}

const createBoeking = async (boekingBody) => {
  let {
    datumAankomst,
    datumVertrek,
    ...rest
  } = boekingBody;

  datumAankomst = formatDate(datumAankomst)
  datumVertrek = formatDate(datumVertrek)

  //eerst checken of hij wel mag (dus of datum wel degelijk beschikbaar is, if not throw error)
  const {
    woningID
  } = rest;

  await getKnex().raw(`set foreign_key_checks = 0`);
  const beschikbaar = await getKnex()(tables.woning).select('woningID')
    .where({
      woningID
    })
    .whereNotExists(function () {
      this.select().from(`${tables.boeking}`).where({
          woningID
        })
        .andWhereRaw(`datumAankomst <= '${datumVertrek}' AND datumVertrek >= '${datumAankomst}'`)
    });

  if (beschikbaar.length === 0) {
    await getKnex().raw(`set foreign_key_checks = 1`);
    throw new Error('deze data zijn niet beschikbaar');
  }

  try {
    const ret = await getKnex()(tabelBoeking).insert({
      ...rest,
      datumAankomst,
      datumVertrek
    });

    if (ret.length > 0) {
      const user = await userRepository.findById(boekingBody.userID);
      await getKnex().raw(`set foreign_key_checks = 1`);
      //de verhuurder ophalen adhv get woning by id en dan get user by id
      const verhuurder = await getUserFromWoningID(woningID);
      const boeking = await getBoekingByID(rest.boekingsID);
      boeking.datumAankomst = formatDate(boeking.datumAankomst); 
      boeking.datumVertrek = formatDate(boeking.datumVertrek);
      return {
        boeking,
        verhuurder,
        user
      };
    }

  } catch (error) {
    await getKnex().raw(`set foreign_key_checks = 1`);
    if (error.message.includes('Duplicate entry')) {
      console.log('er bestaat al een boeking met deze id');
      throw error;
    } else {
      console.log(error)
      throw error;
    }
  }
}

module.exports = {
  getBoekingen,
  getBoekingenByWoning,
  createBoeking
}