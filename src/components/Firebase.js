import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const settings = { merge: true };

const config = {
  apiKey: "AIzaSyDB-WFgQkWxR4CDCkvYc0_Kki49baoc5i4",//chave ton
  authDomain: "ton-mobilidade.firebaseapp.com",
  projectId: "ton-mobilidade",
  storageBucket: "ton-mobilidade.appspot.com",
  messagingSenderId: "141759714561",
  appId: "1:141759714561:web:dd4d3afb92ab538735b700",
  measurementId: "G-8LNCRN4D5D"
}

firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;