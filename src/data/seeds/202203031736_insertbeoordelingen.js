const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    //om leeg te maken eerst de FK check uitzetten
    await knex.raw(`set foreign_key_checks = 0`);

    //delete
    await knex(tables.beoordeling).del();

    //FK weer aanzetten
    await knex.raw(`set foreign_key_checks = 1`);

    //data toevoegen

    await knex(tables.beoordeling).insert([
      {
        beoordelingsID: "ID van beoordeling 1",
        woningID: "woningID-1",
        userID: "7c9af21e-5a3d-445b-952c-0f8d2f679309",
        aantalSterren: 4,
        tekst: "Dit was de beste vakantie ooit!",
        datumBeoordeling: "20220917",
      },
      {
        beoordelingsID: "ID van beoordeling 2",
        woningID: "woningID-1",
        userID: "4t9af21e-5a3d-445b-952c-0f8d2f679309",
        aantalSterren: 3,
        tekst: "Heel gezellig huisje..",
        datumBeoordeling: "20220918",
      },
      {
        beoordelingsID: "ID van beoordeling 3",
        woningID: "woningID-2",
        userID: "4t9af21e-5a3d-445b-952c-0f8d2f679309",
        aantalSterren: 5,
        tekst: "Dit was super gezellig!",
        datumBeoordeling: "20220920",
      },
      {
        beoordelingsID: "ID van beoordeling 4",
        woningID: "woningID-2",
        userID: "7c9af21e-5a3d-445b-952c-0f8d2f679309",
        aantalSterren: 5,
        tekst: "Heel leuk!",
        datumBeoordeling: "20220930",
      },
      {
        beoordelingsID: "ID van beoordeling 5",
        woningID: "woningID-3",
        userID: "7c9af21e-5a3d-445b-952c-0f8d2f679309",
        aantalSterren: 5,
        tekst: "Mooi!",
        datumBeoordeling: "20221005",
      },
      {
        beoordelingsID: "ID van beoordeling 6",
        woningID: "woningID-4",
        userID: "7c9af21e-5a3d-445b-952c-0f8d2f679309",
        aantalSterren: 5,
        tekst: "Leuke sfeer!",
        datumBeoordeling: "20220211",
      },
      {
        beoordelingsID: "ID van beoordeling 7",
        woningID: "woningID-5",
        userID: "4t9af21e-5a3d-445b-952c-0f8d2f679309",
        aantalSterren: 4,
        tekst: "Nette kamer.",
        datumBeoordeling: "20220826",
      },
      {
        beoordelingsID: "ID van beoordeling 8",
        woningID: "woningID-6",
        userID: "4t9af21e-5a3d-445b-952c-0f8d2f679309",
        aantalSterren: 1,
        tekst: "Heel slechte kamer, niet beloofd wat de koper had verteld...",
        datumBeoordeling: "20220826",
      },
    ]);
  },
};

