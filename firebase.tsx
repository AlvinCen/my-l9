// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDLVJfpo5_gADbuzFYoPbul9u0C4nBouXo",
    authDomain: "l9-companion.firebaseapp.com",
    projectId: "l9-companion",
    storageBucket: "l9-companion.firebasestorage.app",
    messagingSenderId: "18530209756",
    appId: "1:18530209756:web:7680483b7055ac39af0919",
    measurementId: "G-QE37LNF692"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);