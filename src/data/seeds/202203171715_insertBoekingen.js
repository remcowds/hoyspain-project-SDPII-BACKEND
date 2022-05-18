const {
  tables
} = require("..")

module.exports = {
  seed: async (knex) => {
    //om leeg te maken eerst de FK check uitzetten
    await knex.raw(`set foreign_key_checks = 0`);

    //delete
    await knex(tables.boeking).del();

    //FK weer aanzetten
    await knex.raw(`set foreign_key_checks = 1`);

    //data toevoegen
    await knex(tables.boeking).insert([{
        boekingsID: 'boekingsID-1',
        userID: '4t9af21e-5a3d-445b-952c-0f8d2f679309',
        woningID: 'woningID-1',
        datumAankomst: '20220803',
        datumVertrek: '20220808',
        aantalPersonenBoeking: 4,
        aantalNachten: 3,
        verzekering: 'none',
        verzekeringsprijs: 0,
        reisPrijs: 200.95,
        totaalPrijs: 200.95
      }, {
        boekingsID: 'boekingsID-2',
        userID: '4t9af21e-5a3d-445b-952c-0f8d2f679309',
        woningID: 'woningID-2',
        datumAankomst: '20220815',
        datumVertrek: '20220817',
        aantalPersonenBoeking: 4,
        aantalNachten: 2,
        verzekering: 'standard',
        verzekeringsprijs: 20,
        reisPrijs: 200.99,
        totaalPrijs: 220.99
      }, {

        boekingsID: 'boekingsID-3',
        userID: '4t9af21e-5a3d-445b-952c-0f8d2f679309',
        woningID: 'woningID-3',
        datumAankomst: '20220825',
        datumVertrek: '20220829',
        aantalPersonenBoeking: 4,
        aantalNachten: 3,
        verzekering: 'allrisk',
        verzekeringsprijs: 50,
        reisPrijs: 200,
        totaalPrijs: 250
      }, {
        boekingsID: 'boekingsID-4',
        userID: '4t9af21e-5a3d-445b-952c-0f8d2f679309',
        woningID: 'woningID-4',
        datumAankomst: '20220924',
        datumVertrek: '20220930',
        aantalPersonenBoeking: 4,
        aantalNachten: 3,
        verzekering: 'none',
        verzekeringsprijs: 0,
        reisPrijs: 300,
        totaalPrijs: 300
      }, {
        boekingsID: 'boekingsID-5',
        userID: '8e47b46d-dc08-40ab-a71c-8e348f4e1ce1',
        woningID: 'woningID-2',
        datumAankomst: '20220801',
        datumVertrek: '20220809',
        aantalPersonenBoeking: 4,
        aantalNachten: 2,
        verzekering: 'none',
        verzekeringsprijs: 0,
        reisPrijs: 300,
        totaalPrijs: 300
      }, {
        boekingsID: 'boekingsID-6',
        userID: '8e47b46d-dc08-40ab-a71c-8e348f4e1ce1',
        woningID: 'woningID-1',
        datumAankomst: '20220901',
        datumVertrek: '20220909',
        aantalPersonenBoeking: 4,
        aantalNachten: 3,
        verzekering: 'standard',
        verzekeringsprijs: 30,
        reisPrijs: 400,
        totaalPrijs: 400
      }, {
        boekingsID: 'boekingsID-7',
        userID: '8e47b46d-dc08-40ab-a71c-8e348f4e1ce1',
        woningID: 'woningID-3',
        datumAankomst: '20220917',
        datumVertrek: '20220920',
        aantalPersonenBoeking: 4,
        aantalNachten: 3,
        verzekering: 'allrisk',
        verzekeringsprijs: 100,
        reisPrijs: 400,
        totaalPrijs: 500
      }, {
        boekingsID: 'boekingsID-8',
        userID: '8e47b46d-dc08-40ab-a71c-8e348f4e1ce1',
        woningID: 'woningID-4',
        datumAankomst: '20220921',
        datumVertrek: '20220926',
        aantalPersonenBoeking: 4,
        aantalNachten: 3,
        verzekering: 'none',
        verzekeringsprijs: 0,
        reisPrijs: 100,
        totaalPrijs: 100
      }

    ])
  }
}