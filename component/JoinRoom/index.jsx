import React, { useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native'
import styles from './style'
import CLOSE from '../../assets/icon/close.png'
const JoinRoom = ({ handleCloseJoinRoom }) => {
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
                />
                <TouchableOpacity style={styles.btnJoinRoom}>
                    <Text style={styles.textBtn}>Vào nhóm</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default JoinRoom