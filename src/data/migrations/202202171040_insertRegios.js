const {
  tables
} = require("..")

module.exports = {
  up: async (knex) => {
    //om leeg te maken eerst de FK check uitzetten
    await knex.raw(`set foreign_key_checks = 0`);

    //delete
    await knex(tables.regio).del();

    //FK weer aanzetten
    await knex.raw(`set foreign_key_checks = 1`);

    //data toevoegen
    await knex(tables.regio).insert([{
        id: '1',
        regio: 'Andalusië',
      },
      {
        id: '2',
        regio: 'Aragón',
      },
      {
        id: '3',
        regio: 'Asturië',
      },
      {
        id: '4',
        regio: 'Balearen',
      },
      {
        id: '5',
        regio: 'Baskenland',
      },
      {
        id: '6',
        regio: 'Canarische Eilanden',
      },
      {
        id: '7',
        regio: 'Cantabrië',
      },
      {
        id: '8',
        regio: 'Castilië-La Mancha',
      },
      {
        id: '9',
        regio: 'Castilië en León',
      },
      {
        id: '10',
        regio: 'Catalonië',
      },
      {
        id: '11',
        regio: 'Extremadura',
      },
      {
        id: '12',
        regio: 'Galicië',
      },
      {
        id: '13',
        regio: 'Madrid',
      },
      {
        id: '14',
        regio: 'Murcia',
      },
      {
        id: '15',
        regio: 'Navarra',
      },
      {
        id: '16',
        regio: 'La Rioja',
      },
      {
        id: '17',
        regio: 'Valencia',
      },
    ])
  },
  down: async (knex) => {
    return await knex(tables.regio).del();
  }
}