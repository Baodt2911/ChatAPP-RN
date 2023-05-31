import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import JOINGROUP from '../../assets/icon/join.png'
import CREATEGROUP from '../../assets/icon/create.png'
import styles from './style'
import JoinRoom from '../JoinRoom';
import { AppContext } from '../../Context/AppUser';
import useFirestore from '../../hooks/useFireStore';
import { ItemRoom } from '../ItemRoom';
const Rooms = ({ navigation }) => {
    const { user: { uid } } = useContext(AppContext)
    const [isLoading, setIsLoading] = useState(true)
    const [joinRoom, setJoinRoom] = useState(false)
    const handleJoinRoom = () => {
        setJoinRoom(true)
    }
    const conditionRoom = useMemo(() => {
        return {
            fieldName: 'members',
            operator: 'array-contains',
            value: uid
        }
    }, [uid])
    const sortOderRoom = useMemo(() => {
        return {
            fieldValue: 'createdAt',
            sort: 'desc'
        }
    }, [])
    const roomList = useFirestore("rooms", conditionRoom, sortOderRoom, false)
    if (roomList) {
        useEffect(() => {
            setIsLoading(false)
        }, [])
    }
    const renderRoomList = useCallback(({ item }) =>
        <ItemRoom
            roomName={item.roomName}
            roomCode={item.roomCode}
            photoURL={item.photoURL}
        />, [])
    return (
        <SafeAreaView style={styles.conatiner}>
            {joinRoom ? <JoinRoom handleCloseJoinRoom={() => setJoinRoom(false)} /> : <></>}
            <View style={styles.header}>
                <TouchableOpacity style={styles.btnIcon} onPress={handleJoinRoom}>
                    <Image
                        source={JOINGROUP}
                        resizeMode='contain'
                        style={styles.icon}
                    />
                    <Text style={{ fontFamily: 'SairaCondensed-Medium', }}>Vào nhóm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnIcon} onPress={() =>
                    navigation.navigate('CreateRoom')}>
                    <Image source={CREATEGROUP}
                        resizeMode='contain'
                        style={styles.icon}
                    />
                    <Text style={{ fontFamily: 'SairaCondensed-Medium', }}>Tạo nhóm</Text>
                </TouchableOpacity>
            </View>
            {isLoading ?
                <ActivityIndicator size="large" color="gray" style={{ marginTop: 50 }} />
                :
                <FlatList style={styles.listRooms}
                    data={roomList}
                    renderItem={renderRoomList}
                    keyExtractor={item => item.id}
                />
            }

        </SafeAreaView>

    )
}

export default Rooms