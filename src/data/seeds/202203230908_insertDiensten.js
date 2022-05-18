const {
  tables
} = require("..")

module.exports = {
  seed: async (knex) => {
    //om leeg te maken eerst de FK check uitzetten
    await knex.raw(`set foreign_key_checks = 0`);

    //delete
    await knex(tables.dienst).del();

    //FK weer aanzetten
    await knex.raw(`set foreign_key_checks = 1`);

    //data toevoegen
    await knex(tables.dienst).insert([{
      dienstID: 'dienstID-1',
      dienstNaam: 'Auto',
      beschrijvingDienst: `dienst om auto's te huren`
    }, {
      dienstID: 'dienstID-2',
      dienstNaam: 'Onderhoud',
    }, {
      dienstID: 'dienstID-3',
      dienstNaam: 'Poetshulp',
      beschrijvingDienst: `dienst voor schoonmaken v/d woning`
    }, {
      dienstID: 'dienstID-4',
      dienstNaam: 'Verzekering',
    }
  ])
  }
}