const {
  tables
} = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.bedrijf, (table) => {
      table.string('bedrijfsID').primary();
      table.string('dienstID').notNullable();
      table.string('bedrijfsNaam').notNullable();
      // table.string('telefoonBedrijf').notNullable();
      // table.string('emailBedrijf').notNullable();
      table.string('fotoBedrijf', 2000).notNullable();
      table.string('linkBedrijf').notNullable();
      table.string('tekstjeBedrijf').notNullable();

      //Foreign Keys
      table.foreign('dienstID', 'fk_dienst_bedrijf').references('dienst.dienstID');
    })
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.bedrijf);
  }
}