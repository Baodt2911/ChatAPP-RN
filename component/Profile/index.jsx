import { View, Text, SafeAreaView, Image, Button, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useContext, useState } from 'react'
import styles from './style'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import { AppContext } from '../../Context/AppUser'
const Profile = () => {
    const { user: { displayName, photoURL, email } } = useContext(AppContext)
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
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ alignItems: 'center' }}>
                {
                    photoURL ?
                        <Image
                            source={require('../../assets/icon/Bao.jpg')}
                            style={styles.imageUser}
                            resizeMode='cover' /> :
                        <View style={styles.imageUser}>
                            <Text style={styles.imageText}>{displayName?.charAt(0).toUpperCase()}</Text>
                        </View>
                }
                <View style={styles.content}>
                    <Text style={styles.nameUser}>{displayName}</Text>
                    <Text style={styles.textEmail}>Email: {email}</Text>
                </View>
                <TouchableOpacity style={styles.btnLogout} >
                    <Button title='Đăng xuất' onPress={alertLogout} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Profile