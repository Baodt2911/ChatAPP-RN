import React, { useContext, useState } from 'react';
import { Button, Image, View, Platform, ActivityIndicator, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native'
import styles from './style'
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ref, uploadBytes } from "firebase/storage";
import { storage } from '../../firebase';
import { randomRoomCode } from '../../hooks/randomCode';
import { addDocument } from '../../hooks/services';
import { serverTimestamp } from 'firebase/firestore';
import { AppContext } from '../../Context/AppUser';
const CreateRoom = ({ navigation }) => {
    const { user: { uid } } = useContext(AppContext)
    const roomCode = randomRoomCode()
    const [imageUpload, setImageUpload] = useState(null);
    const [roomName, setRoomName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        setImageUpload(result.assets[0].uri);
    };
    const handleCreateRoom = async () => {
        setIsLoading(true)
        const response = await fetch(imageUpload)
        const blob = await response.blob()
        const fileName = imageUpload.substring(imageUpload.lastIndexOf('/') + 1)
        const storageRef = ref(storage, fileName)
        try {
            await uploadBytes(storageRef, blob)
            addDocument("rooms", {
                createdAt: serverTimestamp(),
                roomCode: roomCode,
                roomName: roomName,
                photoURL: `https://firebasestorage.googleapis.com/v0/b/chat-app-db76c.appspot.com/o/${fileName}?alt=media`,
                members: [uid]
            })
            Alert.alert('Thông báo', 'Đã tạo nhóm',
                [
                    {
                        text: 'OK',
                        onPress: () => { navigation.navigate('Home') }
                    }
                ])
            setIsLoading(false)
        } catch (error) {
            Alert.alert('Thông báo', 'Tạo nhóm thất bại',
                [
                    {
                        text: 'OK',
                        onPress: () => { navigation.navigate('Home') }
                    }
                ])
            setIsLoading(false)
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ alignItems: 'center' }}>
                <TouchableOpacity style={styles.showImage} onPress={pickImage}>
                    {imageUpload && <Image source={{ uri: imageUpload }} style={styles.ImageRoom} resizeMode='cover' />}
                    {imageUpload ? <></> : <Text style={styles.textShowImage}>Chọn ảnh nhóm của bạn</Text>}
                </TouchableOpacity>
                <TextInput placeholder='Vui lòng nhập tên nhóm của bạn' style={styles.roomNameInput} value={roomName} onChangeText={(text) => setRoomName(text)} />
                {
                    isLoading ? <ActivityIndicator color="gray" /> :
                        <TouchableOpacity style={[styles.btnCreateRoom, , { backgroundColor: (imageUpload && roomName) ? '#0E8388' : '#CBE4DE' },]} disabled={!(imageUpload && roomName)} onPress={handleCreateRoom}>
                            <Text style={styles.textBtn}>Tạo nhóm</Text>
                        </TouchableOpacity>
                }
            </KeyboardAvoidingView>
        </SafeAreaView >

    )
}

export default CreateRoom