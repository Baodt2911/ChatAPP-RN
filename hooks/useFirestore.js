import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, limitToLast } from "firebase/firestore";
import { db } from "../firebase";
const useFirestore = (collectionValue, condition, sortOrder, toLastMessage) => {
    const [data, setData] = useState([])
    useEffect(() => {
        /*condition
            {
                fieldName:'abc',
                operator:'=='.
                value:'uid'
            }
        sortOrder : {
            fieldValue:'createdAt'
            sort:'desc'
        }
        */
        let collectionRef = null
        if (condition) {
            if (!condition.value || !condition.value.length) {
                return
            }
            if (toLastMessage) {
                collectionRef = query(collection(db, collectionValue), where(condition.fieldName, condition.operator, condition.value), orderBy(sortOrder.fieldValue, sortOrder.sort), limitToLast(1))//Get last Message
            }
            if (typeof sortOrder != "object") {
                collectionRef = query(collection(db, collectionValue), where(condition.fieldName, condition.operator, condition.value))
            }
            else {
                collectionRef = query(collection(db, collectionValue), where(condition.fieldName, condition.operator, condition.value), orderBy(sortOrder.fieldValue, sortOrder.sort))
            }
        }
        const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
            const document = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            if (!document.length) {
                return
            }
            setData(document)
        })
        return unsubscribe
    }, [collectionValue, condition, sortOrder, toLastMessage])
    return data
}
export default useFirestore