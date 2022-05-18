const {
  getFirebase
} = require('../firebase');
const fs = require('fs');

const createImage = async (image) => {
  
  //legt verbinding met firebase initiatie
  const firebase = await getFirebase();
  const name = image.filename;
  const bucket = firebase.storage().bucket();

  //manier om aan de storage te geraken is via bucket
  let feedback = await bucket.upload('uploads/' + name).then(file => {
    return bucket.file(name).getSignedUrl({
      action: 'read',
      expires: '03-09-2491'
    }).then(signedUrls => {
      try {
        // verwijdert afbeelding na gebruik lokaal
        fs.unlinkSync(`./uploads/${name}`);
        console.log(`uploads/${name} is deleted`);
        //retourneert deze url:
        return signedUrls[0];
    } catch (error) {
        console.log(error);
        return 'something went wrong...'
    }
    })
  })
  return feedback;
};

const createImageBedrijf = async (image) => {
  //legt verbinding met firebase initiatie
  const firebase = await getFirebase();
  const name = image.filename;
  const bucket = firebase.storage().bucket();
  //manier om aan de storage te geraken is via bucket
  let feedback = await bucket.upload('bedrijfsUploads/' + name).then(file => {
    return bucket.file(name).getSignedUrl({
      action: 'read',
      expires: '03-09-2491'
    }).then(signedUrls => {
      try {
        // verwijdert afbeelding na gebruik lokaal
        fs.unlinkSync(`./bedrijfsUploads/${name}`);
        console.log(`bedrijfsUploads/${name} is deleted`);
        //retourneert deze url:
        return signedUrls[0];
    } catch (error) {
        console.log(error);
        return 'something went wrong...'
    }
    })
  })
  return feedback;
};

module.exports = {
  createImage,
  createImageBedrijf
}