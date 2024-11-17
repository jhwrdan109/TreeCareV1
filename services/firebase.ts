import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';  // Importando o módulo de autenticação

const firebaseConfig = {
    apiKey: "AIzaSyCXRBuPqLSnxteRq8Fg6wnsgqlNhxOyp_0",
    authDomain: "treecare-6fe33.firebaseapp.com",
    projectId: "treecare-6fe33",
    storageBucket: "treecare-6fe33.firebasestorage.app",
    messagingSenderId: "551188495413",
    appId: "1:551188495413:web:8d1ebb6373662445dc857c",
    measurementId: "G-SSBHMT87ZQ"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

// Define o idioma para português (pt)
firebase.auth().languageCode = 'pt';

const database = firebase.database();
const auth = firebase.auth();  // Inicializando o serviço de autenticação

export { database, auth, firebase };
