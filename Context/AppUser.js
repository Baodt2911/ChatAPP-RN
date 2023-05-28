import React, { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/native";
export const AppContext = createContext()
export const AppUser = ({ children }) => {
    const navigation = useNavigation()
    const [user, setUser] = useState()
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const { displayName, email, photoURL, uid } = user
                setUser({ displayName, email, photoURL, uid })
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Welcome' }]
                })
            }
        })
        return () => unsubscribe()
    }, [])
    return (<AppContext.Provider value={{ user }}>
        {children}
    </AppContext.Provider>)
}
