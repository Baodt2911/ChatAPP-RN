import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyCLQMrKMIBQ1SSaVXnYOIA7xRWnaujqs3k",
    authDomain: "chat-app-db76c.firebaseapp.com",
    databaseURL: "https://chat-app-db76c-default-rtdb.firebaseio.com",
    projectId: "chat-app-db76c",
    storageBucket: "chat-app-db76c.appspot.com",
    messagingSenderId: "229921808609",
    appId: "1:229921808609:web:810c43199698879db457a0",
    measurementId: "G-XLGK7BY9GY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)