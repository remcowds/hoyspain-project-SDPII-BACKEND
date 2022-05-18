const {
  Knex
} = require("knex");
const {
  tables
} = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.woning, (table) => {
      table.string('woningID').primary();
      table.uuid('userID');
      table.string('naamWoning', 100).notNullable();
      table.string('linkAfbeeldingen', 8192).notNullable();
      table.string('adres', 100).notNullable();
      //standaardprijs
      table.decimal('prijsPerNachtPerPersoon', 10, 2).notNullable();
      //JSON: array van objects bv {data: ['2020-01-01', '2020-01-31'], prijsPerNachtPerPersoon: 69.69}
      table.string('prijsAanpassing');
      //boolean -> tinyint -> false = 0, true = 1
      table.integer('aantalPersonen').notNullable();
      table.boolean('wifi').notNullable();
      table.boolean('zeezicht').notNullable();
      table.boolean('zwembad').notNullable();
      table.boolean('airco').notNullable();
      table.string('korteBeschrijving').notNullable();
      table.text('beschrijving').notNullable();
      table.decimal('oppervlakte', 10, 2).notNullable();
      table.boolean('avontuur').notNullable();
      table.boolean('reizen').notNullable();
      table.boolean('culinair').notNullable();
      table.boolean('ontspanning').notNullable();
      table.boolean('sporten').notNullable();
      table.string('regio_id', 255).notNullable();
      //vanaf x dagen x korting
      table.integer('kortingPercent');
      table.integer('kortingNachten');
      table.integer('maandKortingPercent')
      table.integer('minimumAantalNachtenVerblijf');
      table.decimal('waarborg');
      //json met bijkomende kosten
      table.string('bijkomendeKosten');

      //Foreign Keys
      table.foreign('userID', 'fk_woning_gebruiker').references('gebruiker.userID');

      table.foreign('regio_id', 'fk_woning_regio')
        .references(`regio.id`)
    })
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.woning);
  }
}