import React, { useContext, useMemo, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, Image, Alert, ActivityIndicator } from 'react-native'
import styles from './style'
import CLOSE from '../../assets/icon/close.png'
import { AppContext } from '../../Context/AppUser'
import useFirestore from '../../hooks/useFireStore'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../../firebase'
const JoinRoom = ({ handleCloseJoinRoom }) => {
    const { user: { uid } } = useContext(AppContext)
    const [roomCode, setRoomCode] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const conditionGetRoom = useMemo(() => {
        return {
            fieldName: 'roomCode',
            operator: '==',
            value: roomCode.toUpperCase()
        }
    }, [roomCode])
    const getRoom = useFirestore("rooms", conditionGetRoom, true, false)
    const handleJoinRoom = async () => {
        if (roomCode.length < 6 || roomCode.length > 6) {
            return
        }
        setIsLoading(true)
        const ref = doc(db, "rooms", getRoom[0].id)
        try {
            await updateDoc(ref, {
                members: arrayUnion(uid)
            })
            setIsLoading(false)
            Alert.alert('Thông báo', 'Đã vào phòng', [{ text: 'OK', onPress: handleCloseJoinRoom }])
        } catch (error) {
            setIsLoading(false)
            Alert.alert('Thông báo', 'Vui lòng kiểm tra lại mã mời', [{ text: 'OK', onPress: () => { } }])
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.main}>
                <TouchableOpacity onPress={handleCloseJoinRoom}>
                    <Image
                        source={CLOSE}
                        resizeMode='contain'
                        style={styles.close}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>Nhập mã nhóm</Text>
                <TextInput
                    style={styles.inputCode}
                    placeholder='VD:HGTEAO'
                    onChangeText={(text) => setRoomCode(text)}
                    value={roomCode}
                />
                {
                    isLoading ? <ActivityIndicator color='gray' /> :
                        <TouchableOpacity style={styles.btnJoinRoom} onPress={handleJoinRoom}>
                            <Text style={styles.textBtn}>Vào nhóm</Text>
                        </TouchableOpacity>
                }
            </View>
        </View>
    )
}

export default JoinRoom