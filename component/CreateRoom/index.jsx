import React, { useState } from 'react';
import { Button, Image, View, Platform, ActivityIndicator, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native'
import styles from './style'
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
const CreateRoom = ({ navigation }) => {
    const [image, setImage] = useState(null);
    const [roomName, setRoomName] = useState('')
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };
    const handleCreateRoom = () => {
        Alert.alert('Thông báo', 'Đã tạo nhóm',
            [
                {
                    text: 'OK',
                    onPress: () => { navigation.navigate('Home') }
                }
            ])
    }
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ alignItems: 'center' }}>
                <TouchableOpacity style={styles.showImage} onPress={pickImage}>
                    {image && <Image source={{ uri: image }} style={styles.ImageRoom} resizeMode='cover' />}
                    {image ? <></> : <Text style={styles.textShowImage}>Chọn ảnh nhóm của bạn</Text>}
                </TouchableOpacity>
                <TextInput placeholder='Vui lòng nhập tên nhóm của bạn' style={styles.roomNameInput} value={roomName} onChangeText={(text) => setRoomName(text)} />
                <TouchableOpacity style={[styles.btnCreateRoom, , { backgroundColor: (image && roomName) ? '#0E8388' : '#CBE4DE' },]} disabled={!(image && roomName)} onPress={handleCreateRoom}>
                    <Text style={styles.textBtn}>Tạo nhóm</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView >

    )
}

export default CreateRoom