const {
  tables,
  getKnex
} = require("../data/index");

const {
  findByRegio
} = require("./regioRepos");

const {
  createBoeking
} = require("./boekingRepos");

const uuid = require("uuid");

const {
  formatDate
} = require("../core/datumOmzetting");

const tabelWoning = tables.woning;

//beschikbaarheden doorvoeren
const voerBeschikbaarhedenDoor = async ({
  data,
  woningID,
  userID
}) => {
  await Promise.all(
    data.map(async (boekingData) => {
      const boekingsID = uuid.v4();
      const datumAankomst = formatDate(boekingData[0]);
      const datumVertrek = formatDate(boekingData[1]);

      await createBoeking({
        boekingsID,
        woningID,
        userID,
        datumAankomst,
        datumVertrek,
        aantalPersonenBoeking: 0,
        aantalNachten: 0,
        verzekering: "none",
        verzekeringsprijs: 0,
        reisPrijs: 0,
        totaalPrijs: 0,
      });
    })
  );
};

const formatWoning = async (woning) => {
  woning.prijsAanpassing = JSON.parse(woning.prijsAanpassing);
  woning.linkAfbeeldingen = JSON.parse(woning.linkAfbeeldingen);
  woning.adres = JSON.parse(woning.adres);
  woning.bijkomendeKosten = JSON.parse(woning.bijkomendeKosten)

  const rating = await getKnex()(tables.beoordeling)
    .avg("aantalSterren as aantal")
    .where({
      woningID: woning.woningID,
    })
    .first();

  woning.rating = Math.round(Number(rating.aantal)) || null;

  return woning;
};

const getAllWoningen = async (filters) => {
  const filtersMetRegio = {
    ...filters.checks,
  };

  let regioID;
  if (filters.regio_id) {
    regioID = await getKnex()(tables.regio)
      .select("id")
      .where({
        regio: filters.regio_id,
      })
      .first();
    regioID = regioID.id;
  }

  if (filters.regio_id) {
    filtersMetRegio.regio_id = regioID;
  }
  let woningen = await getKnex()(`${tabelWoning} as w`).select() //'w.woningID', 'w.userID', 'w.naamWoning', 'w.linkAfbeeldingen', 'w.adres', 'w.prijsPerNachtPerPersoon', 'w.prijsAanpassing', 'w.wifi', 'w.zeezicht', 'w.zwembad', 'w.airco', 'w.korteBeschrijving', 'w.beschrijving', 'w.oppervlakte', 'w.avontuur', 'w.reizen', 'w.culinair', 'w.ontspanning', 'w.sporten', 'w.bijkomendeKosten', 'w.maandKortingPercent', 'regio.id', 'regio.regio')
    .join(tables.regio, `w.regio_id`, '=', `${tables.regio}.id`)
    .where(filtersMetRegio)
    .andWhere('aantalPersonen', '>', Number(filters.aantalPersonen) - 1 || 0)
    .modify(function (qb) {
      if (filters.minPrijs) {
        qb.where('prijsPerNachtPerPersoon', '>', filters.minPrijs)
      }
    })
    .modify(function (qb) {
      if (filters.maxPrijs) {
        qb.where('prijsPerNachtPerPersoon', '<', filters.maxPrijs)
      }
    })
    .modify(function (qb) {
      if (filters.datumVan && filters.datumTot) {
        qb.whereNotExists(function () {
          this.select("*")
            .from(`${tables.boeking}`)
            .whereRaw("w.woningID = woningID")
            .andWhereRaw(
              `datumAankomst <= '${filters.datumTot}' AND datumVertrek >= '${filters.datumVan}'`
            );
        });
      }
    });

  let woningenMetRating = await Promise.all(woningen.map(formatWoning));

  //filter rating
  if (filters.rating.length > 0) {
    woningenMetRating = woningenMetRating.filter((woning) => {
      if (woning.rating === null) {
        woning.rating = 0;
      }
      if (filters.rating.includes(woning.rating)) {
        return true;
      }
      return false;
    });
  }

  const orderBy = filters.orderBy;

  //sorteren
  const compare = (woning1, woning2) => {
    const isPrijs = orderBy.includes("prijs");
    let attribuut = isPrijs ? "prijsPerNachtPerPersoon" : "rating";

    if (Number(woning1[attribuut]) < Number(woning2[attribuut])) {
      return 1;
    }
    if (Number(woning1[attribuut]) > Number(woning2[attribuut])) {
      return -1;
    }
    return 0;
  };

  if (orderBy) {
    woningenMetRating.sort(compare);
    if (orderBy.includes("Stijgend")) {
      woningenMetRating.reverse();
    }
  }

  return woningenMetRating;
};

const getWoningenByUser = async (userID) => {
  const woningen = await getKnex()(tabelWoning)
    .select()
    .join(tables.regio, `${tabelWoning}.regio_id`, "=", `${tables.regio}.id`)
    .where({
      userID,
    });

  if (woningen.length > 0) {
    return await Promise.all(woningen.map(formatWoning))
  } else {
    console.log("geen woningen gevonden van deze gebruiker");
  }
};

const getWoningByID = async (id) => {
  const woning = await getKnex()(tabelWoning)
    .select()
    .join(tables.regio, `${tabelWoning}.regio_id`, "=", `${tables.regio}.id`)
    .where({
      woningID: id,
    })
    .first();

  if (woning) {
    return await formatWoning(woning);
  } else {
    console.log("geen woning gevonden met id " + id);
  }
};

const getWoningenByIDS = async (woningBody) => {
  const {
    alleWoningen
  } = woningBody;

  const woning = await getKnex()(tabelWoning)
    .select()
    .whereIn("woningID", alleWoningen);

  let woningenMetRating = await Promise.all(woning.map(voegRatingToe));

  return woningenMetRating;
}

const getWoningByIDNoRating = async (id) => {
  const woning = await getKnex()(tabelWoning).select()
    .join(tables.regio, `${tabelWoning}.regio_id`, '=', `${tables.regio}.id`)
    .where({
      woningID: id
    }).first();

  if (woning) {
    return woning;
  } else {
    console.log('geen woning gevonden met id ' + id)
  }

};

const updateWoning = async (woningID, woningBody) => {
  const {
    userID,
    naamWoning,
    linkAfbeeldingen,
    adres,
    nietBeschikbaar,
    prijsPerNachtPerPersoon,
    prijsAanpassing,
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
    regioNaam,
    kortingPercent,
    kortingNachten,
    minimumAantalNachtenVerblijf,
    waarborg,
    bijkomendeKosten,
    maandKortingPercent
  } = woningBody;

  //regionaam: id zoeken
  const regio_id = (await findByRegio(regioNaam)).id;

  if (linkAfbeeldingen === "[]") {
    console.log("empty array")
    await getKnex()(tabelWoning).where({
      woningID
    }).update({
      naamWoning,
      adres,
      prijsPerNachtPerPersoon,
      prijsAanpassing,
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
      regio_id,
      kortingPercent,
      kortingNachten,
      minimumAantalNachtenVerblijf,
      waarborg,
      bijkomendeKosten,
      maandKortingPercent
    });
  } else { //woningen zijn geupdate!
    await getKnex()(tabelWoning).where({
      woningID
    }).update({
      naamWoning,
      adres,
      prijsPerNachtPerPersoon,
      prijsAanpassing,
      aantalPersonen,
      wifi,
      zeezicht,
      zwembad,
      airco,
      korteBeschrijving,
      linkAfbeeldingen,
      beschrijving,
      oppervlakte,
      avontuur,
      reizen,
      culinair,
      ontspanning,
      sporten,
      regio_id,
      kortingPercent,
      kortingNachten,
      minimumAantalNachtenVerblijf,
      waarborg,
      bijkomendeKosten,
      maandKortingPercent
    });
  }

  //beschikbaarheden doorvoeren
  voerBeschikbaarhedenDoor({
    data: JSON.parse(nietBeschikbaar),
    woningID,
    userID,
  });

  return getWoningByID(woningID);
};

const createWoning = async (woningBody) => {
  const {
    woningID,
    userID,
    naamWoning,
    linkAfbeeldingen,
    adres,
    nietBeschikbaar,
    prijsPerNachtPerPersoon,
    prijsAanpassing,
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
    regioNaam,
    kortingPercent,
    kortingNachten,
    minimumAantalNachtenVerblijf,
    waarborg,
    bijkomendeKosten,
    maandKortingPercent
  } = woningBody;

  //regionaam: id zoeken
  const regio_id = (await findByRegio(regioNaam)).id;

  const ret = await getKnex()(tabelWoning).insert({
    woningID,
    userID,
    naamWoning,
    linkAfbeeldingen,
    adres,
    prijsPerNachtPerPersoon,
    prijsAanpassing,
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
    regio_id,
    kortingPercent,
    kortingNachten,
    minimumAantalNachtenVerblijf,
    waarborg,
    bijkomendeKosten,
    maandKortingPercent
  });

  //beschikbaarheden doorvoeren

  voerBeschikbaarhedenDoor({
    data: JSON.parse(nietBeschikbaar),
    woningID,
    userID,
  });


  if (!(nietBeschikbaar == "")) {
    let data = JSON.parse(nietBeschikbaar);
    await Promise.all(
      data.map(async (boekingData) => {
        const boekingsID = uuid.v4();
        const datumAankomst = formatDate(boekingData[0]);
        const datumVertrek = formatDate(boekingData[1]);

        await createBoeking({
          boekingsID,
          woningID,
          userID,
          datumAankomst,
          datumVertrek,
          aantalPersonenBoeking: 0,
          aantalNachten: 0,
          verzekering: "none",
          verzekeringsprijs: 0,
          reisPrijs: 0,
          totaalPrijs: 0,
        });
      })
    );
  }

  if (ret) {
    return await getWoningByID(woningID);
  }
};

const removeWoning = async (id) => {
  await getKnex().raw(`set foreign_key_checks = 0`);
  const ret = await getKnex()(tabelWoning)
    .where({
      woningID: id,
    })
    .del();

  await getKnex().raw(`set foreign_key_checks = 1`);

  if (ret === 0) {
    throw new Error(`woning met id ${id} niet gevonden`);
  }
};

const voegRatingToe = async (woning) => {
  woning.linkAfbeeldingen = JSON.parse(woning.linkAfbeeldingen);

  woning.adres = JSON.parse(woning.adres);

  const rating = await getKnex()(tables.beoordeling)
    .avg("aantalSterren as aantal")
    .where({
      woningID: woning.woningID,
    })
    .first();

  woning.rating = Math.round(Number(rating.aantal)) || null;

  return woning;
};

module.exports = {
  getAllWoningen,
  getWoningenByUser,
  getWoningByID,
  getWoningByIDNoRating,
  updateWoning,
  createWoning,
  removeWoning,
  getWoningenByIDS,
};