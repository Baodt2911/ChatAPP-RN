import React, { useContext, useMemo, useState, useCallback } from 'react'
import { View, FlatList, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeaderChatRight, ScreenHeaderChatLeft, MessageMember, MessageUser } from '../../assets/theme';
import Intive from '../Invite';
import styles from './style';
import SEND from '../../assets/icon/send-message.png'
import useFirestore from '../../hooks/useFirestore';
import { AppContext } from '../../Context/AppUser';
import { serverTimestamp } from 'firebase/firestore';
import { addDocument } from '../../hooks/services';
const Chat = ({ route, navigation }) => {
    const { roomCode, photoURL, roomName } = route.params
    const { user } = useContext(AppContext)
    const [textMessage, SetTextMessage] = useState('')
    const [textPlaceholder, setTextPlaceHolder] = useState('Aa')
    const [showInvite, setShowInvite] = useState(false)
    const customFocusPlaceholder = () => {
        setTextPlaceHolder('Nhập tin nhắn')
    }
    const customBlurPlaceholder = () => {
        setTextPlaceHolder('Aa')
    }
    const handleSendMessage = () => {
        if (textMessage) {
            addDocument("messages",
                {
                    createdAt: serverTimestamp(),
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    roomCode: roomCode,
                    text: textMessage,
                    uid: user.uid
                }
            )
            SetTextMessage('')
        }
    }
    const conditionMessage = useMemo(() => {
        return {
            fieldName: 'roomCode',
            operator: '==',
            value: roomCode
        }
    }, [roomCode])
    const sortOderMessage = useMemo(() => {
        return {
            fieldValue: 'createdAt',
            sort: 'asc'
        }
    }, [])
    const dataMessage = useFirestore("messages", conditionMessage, sortOderMessage, false)
    const members = useFirestore("rooms", conditionMessage, true, false)
    console.log('re-render');
    const renderItem = useCallback(({ item }) => {
        if (item.uid == user.uid) {
            return (
                <MessageUser text={item.text} timeSend={item.createdAt?.seconds} />
            )
        }
        return (
            <MessageMember text={item.text} displayName={item.displayName} photoURL={item.photoURL} timeSend={item.createdAt?.seconds} />
        )
    }, [])
    return (
        <SafeAreaView style={styles.container}>
            {showInvite ? <Intive roomCode={roomCode} handleCloseInvite={() => setShowInvite(false)} /> : <></>}
            <View style={styles.header}>
                <ScreenHeaderChatLeft
                    handleBack={() => navigation.goBack()}
                    roomName={`${roomName}`}
                    photoURL={{ uri: `${photoURL}` }}
                />
                <ScreenHeaderChatRight handleOpenInvite={() => setShowInvite(true)} handleShowMember={() => navigation.navigate('ShowMember', { members: members[0].members })} />
            </View>
            <View style={styles.chat}>
                <View>
                    {
                        !dataMessage.length ? <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 24, fontFamily: 'SairaCondensed-SemiBold', opacity: 0.5 }}>Chưa có tin nhắn nào</Text>
                        </View>
                            :
                            <FlatList
                                style={styles.mainChat}
                                data={dataMessage}
                                renderItem={renderItem}
                                keyExtractor={item => item.id}
                            />
                    }
                </View>
            </View>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.messageInput}
            >
                <TextInput
                    placeholder={textPlaceholder}
                    multiline
                    style={styles.textInputMessage}
                    onChangeText={(text) => SetTextMessage(text)}
                    value={textMessage}
                    onFocus={customFocusPlaceholder}
                    onBlur={customBlurPlaceholder}
                />
                <TouchableOpacity onPress={handleSendMessage}>
                    <Image
                        source={SEND}
                        style={styles.iconSend}
                    />
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default Chat