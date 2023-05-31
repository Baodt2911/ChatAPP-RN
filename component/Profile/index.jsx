import { View, Text, SafeAreaView, Image, Button, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import React, { useContext, useMemo, useState } from 'react'
import styles from './style'
import { signOut, updateProfile } from 'firebase/auth'
import { auth, db, storage } from '../../firebase'
import { AppContext } from '../../Context/AppUser'
import { ref, uploadBytes } from 'firebase/storage';
import useFirestore from '../../hooks/useFireStore';
import { doc, updateDoc } from 'firebase/firestore';
const Profile = () => {
    const { user: { displayName, photoURL, email, uid } } = useContext(AppContext)
    const [imageProfile, setImageProfile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const alertLogout = () => {
        Alert.alert('Thông Báo', 'Bạn có muốn đăng xuất không', [
            {
                text: 'Thoát',
                onPress: () => { },
                style: 'cancel',
            },
            { text: 'Đồng ý', onPress: () => { signOut(auth) } },
        ]);
    }
    const conditionUsers = useMemo(() => {
        return {
            fieldName: 'uid',
            operator: '==',
            value: uid
        }
    }, [uid])
    const getUser = useFirestore("users", conditionUsers, true, false)
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        setImageProfile(result.assets[0].uri);
    };
    const handleUpdateProfile = async () => {
        setIsLoading(true)
        const response = await fetch(imageProfile)
        const blob = await response.blob()
        const fileName = imageProfile.substring(imageProfile.lastIndexOf('/') + 1)
        const storageRef = ref(storage, fileName)
        const refUser = doc(db, "users", getUser[0].id)
        try {
            await uploadBytes(storageRef, blob)
            await updateProfile(auth.currentUser, {
                photoURL: `https://firebasestorage.googleapis.com/v0/b/chat-app-db76c.appspot.com/o/${fileName}?alt=media`,
            })
            await updateDoc(refUser, {
                photoURL: `https://firebasestorage.googleapis.com/v0/b/chat-app-db76c.appspot.com/o/${fileName}?alt=media`
            })
            setIsLoading(false)
            setImageProfile(null)
            Alert.alert('Thông báo', 'Cập nhật thành công', [{ text: 'OK', onPress: () => { } }])
        } catch (error) {
            setIsLoading(false)
            setImageProfile(null)
            Alert.alert('Thông báo', 'Cập nhật thất bại', [{ text: 'OK', onPress: () => { } }])
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity style={styles.imageUser} onPress={pickImage}>
                    {
                        photoURL ?
                            photoURL ?
                                <Image
                                    source={{ uri: imageProfile ? imageProfile : photoURL }}
                                    style={styles.imageUser}
                                    resizeMode='cover' /> :
                                imageProfile ? <Image source={{ uri: imageProfile }} style={styles.imageUser} resizeMode="cover" />
                                    :
                                    <Text style={styles.imageText}>{displayName?.charAt(0).toUpperCase()}</Text>
                            :
                            <ActivityIndicator color="gray" />
                    }
                </TouchableOpacity>
                <View style={styles.content}>
                    <Text style={styles.nameUser}>{displayName}</Text>
                    <Text style={styles.textEmail}>Email: {email}</Text>
                </View>
                <TouchableOpacity style={styles.btnLogout} >
                    {
                        imageProfile ?
                            isLoading ? <ActivityIndicator color="gray" /> : <Button title='Cập nhật' onPress={handleUpdateProfile} />
                            :
                            <Button title='Đăng xuất' onPress={alertLogout} />
                    }
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Profile