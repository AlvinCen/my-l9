import { initializeApp, setLogLevel } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDLVJfpo5_gADbuzFYoPbul9u0C4nBouXo",
    authDomain: "l9-companion.firebaseapp.com",
    projectId: "l9-companion",
    storageBucket: "l9-companion.firebasestorage.app",
    messagingSenderId: "18530209756",
    appId: "1:18530209756:web:7680483b7055ac39af0919",
    measurementId: "G-QE37LNF692",
};

setLogLevel("debug");

const app = initializeApp(firebaseConfig);

// 🔴 sebelumnya
// export const db = getFirestore(app);

// 🟢 ganti jadi pakai DB bernama "my-l9"
export const db = getFirestore(app, "my-l9");
