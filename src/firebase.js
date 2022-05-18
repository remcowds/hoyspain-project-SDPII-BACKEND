const firebase = require('firebase-admin');

const installFirebase = async () => {
  firebase.initializeApp({
    credential: firebase.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: 'reactbackendimages-672cb.appspot.com'
  });
  console.log('\x1b[32m%s\x1b[0m', '[firebase] Connected to Firebase')
};

const getFirebase = async () => {
  return firebase;
};

module.exports = {
  installFirebase,
  getFirebase
}