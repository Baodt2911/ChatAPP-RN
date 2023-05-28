import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
export const addDocument = (collectionValue, data) => {
    addDoc(collection(db, collectionValue), data)
}