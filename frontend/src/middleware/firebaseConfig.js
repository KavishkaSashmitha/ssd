import { initializeApp } from 'firebase/app';

// const firebaseConfig = {
//   apiKey: 'AIzaSyC_E2o026Y58jQO8FQXsxnHNyeKSe6SKKM',
//   authDomain: 'herbalheaven-d8cb9.firebaseapp.com',
//   projectId: 'herbalheaven-d8cb9',
//   storageBucket: 'herbalheaven-d8cb9.appspot.com',
//   messagingSenderId: '654458706208',
//   appId: '1:654458706208:web:f122ff742b6c8151cd9f45',
// };

// Using environment variables for Firebase configuration - IA
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const firebase = initializeApp(firebaseConfig);

export default firebase;
