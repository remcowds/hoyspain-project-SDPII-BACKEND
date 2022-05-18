const {
  tables
} = require("..")

module.exports = {
  seed: async (knex) => {
    //om leeg te maken eerst de FK check uitzetten
    await knex.raw(`set foreign_key_checks = 0`);

    //delete
    await knex(tables.bedrijf).del();

    //FK weer aanzetten
    await knex.raw(`set foreign_key_checks = 1`);

    //data toevoegen
    await knex(tables.bedrijf).insert([{
      bedrijfsID: 'bedrijfsID-1',
      dienstID: 'dienstID-1',
      bedrijfsNaam: 'Turo Car Dealership',
      // telefoonBedrijf: '+32123456789',
      // emailBedrijf: 'tcd@email.com',
      fotoBedrijf: 'https://techcrunch.com/wp-content/uploads/2016/08/turo-porsche.jpg',
      linkBedrijf: 'https://turo.com/us/en/car-rental/united-states',
      tekstjeBedrijf: 'beschrijving / tekstje bij Turo Car Dealership'
    }, {
      bedrijfsID: 'bedrijfsID-2',
      dienstID: 'dienstID-1',
      bedrijfsNaam: 'Avis Car Rental',
      // telefoonBedrijf: '+32234567891',
      // emailBedrijf: 'acr@email.com',
      fotoBedrijf: 'https://festivalboca.org/sites/FestivalBoca/cache/file/72619ADF-0837-D005-8CD4DDDCB2A4EEA8.jpg',
      linkBedrijf: 'https://www.avis.be/en/',
      tekstjeBedrijf: 'beschrijving / tekstje bij Avis Car Rental'
    }, {
      bedrijfsID: 'bedrijfsID-3',
      dienstID: 'dienstID-2',
      bedrijfsNaam: 'Onderhoudsbedrijf',
      // telefoonBedrijf: '+32345678912',
      // emailBedrijf: 'onderhoud@email.com',
      fotoBedrijf: 'https://www.cvf-technics.be/images/services/onderhoud.jpg',
      linkBedrijf: 'https://google.com',
      tekstjeBedrijf: 'beschrijving / tekstje bij onderhoudsbedrijf'
    }, {
      bedrijfsID: 'bedrijfsID-4',
      dienstID: 'dienstID-3',
      bedrijfsNaam: 'Poetsbedrijf',
      // telefoonBedrijf: '+32456789123',
      // emailBedrijf: 'poets@email.com',
      fotoBedrijf: 'https://pbs.twimg.com/profile_images/1485431598417858566/qYljl7pW_400x400.jpg',
      linkBedrijf: 'https://google.com',
      tekstjeBedrijf: 'beschrijving / tekstje bij Poetsbedrijf'
    }, {
      bedrijfsID: 'bedrijfsID-5',
      dienstID: 'dienstID-4',
      bedrijfsNaam: 'Verzekeringsbedrijf',
      // telefoonBedrijf: '+32567891234',
      // emailBedrijf: 'verzekering@email.com',
      fotoBedrijf: 'https://firebasestorage.googleapis.com/v0/b/reactbackendimages-672cb.appspot.com/o/vado2.png?alt=media&token=b2d0bed5-408c-4076-8f48-a07681f4aa3f',
      linkBedrijf: 'https://google.com',
      tekstjeBedrijf: 'beschrijving / tekstje bij Verzekeringsbedrijf'
    }])
  }
}