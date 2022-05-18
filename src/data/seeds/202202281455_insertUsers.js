const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    //om leeg te maken eerst de FK check uitzetten
    await knex.raw(`set foreign_key_checks = 0`);

    //delete
    await knex(tables.gebruiker).del();

    //FK weer aanzetten
    await knex.raw(`set foreign_key_checks = 1`);

    //data toevoegen
    await knex(tables.gebruiker).insert([
      {
        emailAdres: "admin@email.com",
        wachtwoordhash:
          "$argon2id$v=19$m=131072,t=6,p=1$toht8w0QjNaEwFlsQkR4rw$6QOK4pjiOHCpn1nUMi3hY4eot3N6ph/DtgiT8Z1h2uA",
        //ww = admini
        voornaam: "Bruno",
        achternaam: "Van Kampen",
        // adres: 'admin adres',
        telefoonnummer: "0469696969",
        // geboorteDatum: '20010420',
        role: "admin",
        userID: "4c9af21e-5a3d-442b-952c-0c8d2f679399",
      },
      {
        emailAdres: "bert@email.com",
        wachtwoordhash:
          "$argon2id$v=19$m=131072,t=6,p=1$toht8w0QjNaEwFlsQkR4rw$6QOK4pjiOHCpn1nUMi3hY4eot3N6ph/DtgiT8Z1h2uA",
        //ww = admini
        voornaam: "Bert",
        achternaam: "De Schepper",
        // adres: 'admin adres',
        telefoonnummer: "0415648469",
        // geboorteDatum: '20010420',
        role: "admin",
        userID: "4c9af21e-5a3d-445b-952c-0f8d2f679199",
      },
      {
        emailAdres: "hugo.demakelaar@gmail.com",
        wachtwoordhash:
          "$argon2id$v=19$m=131072,t=6,p=1$toht8w0QjNaEwFlsQkR4rw$6QOK4pjiOHCpn1nUMi3hY4eot3N6ph/DtgiT8Z1h2uA",
        //ww = admini
        voornaam: "Hugo",
        achternaam: "De Makelaar",
        // adres: 'admin adres',
        telefoonnummer: "0452668212",
        // geboorteDatum: '20010420',
        role: "admin",
        userID: "4c9af21e-5a3d-445g-951c-0f8d2f679199",
      },
      {
        emailAdres: "axel.vanbroeke@live.com",
        wachtwoordhash:
          "$argon2id$v=19$m=131072,t=6,p=1$toht8w0QjNaEwFlsQkR4rw$6QOK4pjiOHCpn1nUMi3hY4eot3N6ph/DtgiT8Z1h2uA",
        //ww = admini
        voornaam: "Axel",
        achternaam: "Van Broeke",
        // adres: 'admin adres',
        telefoonnummer: "0412152652",
        // geboorteDatum: '20010420',
        role: "admin",
        userID: "4c9af52e-5a3d-445g-951c-0f8d2f669999",
      },
      {
        emailAdres: "beheerder@email.com",
        wachtwoordhash:
          "$argon2id$v=19$m=131072,t=6,p=1$uQ9RdOiA0f2nI/T/HZv6wQ$+5Ai6atYVr1TjZTq+mw0S+kWlGVNKU0OOo69N7KowPI",
        //ww = beheerder
        voornaam: "Bart",
        achternaam: "Verschuren",
        // adres: 'beheerder adres',
        telefoonnummer: "beheerder tel",
        // geboorteDatum: '20010915',
        role: "owner",
        userID: "4c9af21e-5a3d-445b-972c-0f8d2f679309",
      },
      {
        emailAdres: "verhuurder@email.com",
        wachtwoordhash:
          "$argon2id$v=19$m=131072,t=6,p=1$oB5InMR84SXjwf4SFz581g$/oiienHInTvYawsDx7i20mXLsewQuvEhPOwKdEm9EQs",
        //ww = verhuurder
        voornaam: "Wout",
        achternaam: "De Ridder",
        // adres: 'verhuurder adres',
        telefoonnummer: "verhuurder tel",
        // geboorteDatum: '20010531',
        role: "user",
        userID: "4c9af21e-5a3d-445b-952c-0f8d2f679309",
      },
      {
        emailAdres: "verhuurder2@email.com",
        wachtwoordhash:
          "$argon2id$v=19$m=131072,t=6,p=1$oB5InMR84SXjwf4SFz581g$/oiienHInTvYawsDx7i20mXLsewQuvEhPOwKdEm9EQs",
        //ww = verhuurder
        voornaam: "Jan",
        achternaam: "De Gieter",
        // adres: 'verhuurder2 adres',
        telefoonnummer: "verhuurder2 tel",
        // geboorteDatum: '20001225',
        role: "user",
        userID: "7c9af21e-5a3d-445b-952c-0f8d2f679309",
      },

      {
        emailAdres: "huurder@email.com",
        wachtwoordhash:
          "$argon2id$v=19$m=131072,t=6,p=1$Qqn6MDa/vyA2yYw5gwtzOw$HVEBwJyP1whKzWWmcuhWxWMMtKD3UyrHTM4C3ko5XZM",
        //ww = huurder
        voornaam: "Emily",
        achternaam: "Dopper",
        // adres: 'huurder adres',
        telefoonnummer: "huurder tel",
        // geboorteDatum: '20010530',
        role: "user",
        userID: "4t9af21e-5a3d-445b-952c-0f8d2f679309",
      },
      {
        emailAdres: "huurder2@email.com",
        wachtwoordhash:
          "$argon2id$v=19$m=131072,t=6,p=1$YuCi6NOmTW+QE7571K4C3Q$x8ccFR/K/mXoqaskWW9CnNNrJeaKI/o2YABAMP50OSw",
        //ww = huurder2
        voornaam: "Marie",
        achternaam: "Lievens",
        // adres: 'beheerder adres',
        telefoonnummer: "huurder2 tel",
        // geboorteDatum: '20010915',
        role: "user",
        userID: "8e47b46d-dc08-40ab-a71c-8e348f4e1ce1",
      },
    ]);
  },
};
