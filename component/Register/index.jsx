import React, { useState } from 'react'
import {
    View,
    Text,
    KeyboardAvoidingView,
    Image,
    TouchableOpacity,
    TextInput,
    Platform,
    Alert,
    ActivityIndicator
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './style'
import GOOGLE from '../../assets/icon/google.png'
import FACEBOOK from '../../assets/icon/facebook.png'
import EMAIL from '../../assets/icon/mail.png'
import PASSWORD from '../../assets/icon/password.png'
import SHOW_PASSWORD from '../../assets/icon/show-pass.png'
import HIDDEN_PASSWORD from '../../assets/icon/hidden-pass.png'
import NAME from '../../assets/icon/name.png'
import { auth } from '../../firebase'
import { createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
const Register = ({ navigation }) => {
    const [textFirstName, setTextFirstName] = useState('')
    const [textLastName, setTextLastName] = useState('')
    const [textEmail, setTextEmail] = useState('')
    const [textPassword, setTextPassword] = useState('')
    const [textRetypePassword, setTextRetypePassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [showPassRetype, setShowPassRetype] = useState(false)
    const [iconPass, setIconPass] = useState(HIDDEN_PASSWORD)
    const [iconPassRetype, setIconPassRetype] = useState(HIDDEN_PASSWORD)
    const [isFirstName, setIsFirstName] = useState(false)
    const [isLastName, setIsLastName] = useState(false)
    const [isEmail, setIsEmail] = useState(false)
    const [isPassword, setIsPassword] = useState(false)
    const [isRetypePassword, setIsRetypePassword] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const validateFirstName = (text) => {
        const regexFirstName = /^[\p{L}\p{M}]+$/u;
        return regexFirstName.test(text)
    }
    const validateLastName = (text) => {
        const regexLastName = /^[\p{L}\p{M}\p{Pd}]+$/u;
        return regexLastName.test(text)
    }
    const validationEmail = (text) => {
        const regexEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        return regexEmail.test(text)
    }
    const validationPassword = (text) => {
        const regexPassword = /^(?=.{6,20}$)[a-zA-Z0-9._]+$/
        return regexPassword.test(text)
    }
    const valiadtionRetypePassword = (text) => {
        return text == textPassword
    }
    const validationAll = () => {
        return isFirstName && isLastName && isEmail && isPassword && isRetypePassword
    }
    const resetForm = () => {
        setTextFirstName('')
        setTextLastName('')
        setTextEmail('')
        setTextPassword('')
        setTextRetypePassword('')
        setShowPass(false)
        setShowPassRetype(false)
    }
    const handleRegister = () => {
        if ((textFirstName == '' && textLastName == '' && textPassword == '' && textRetypePassword == '')) {
            Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin', [{ text: 'OK', onPress: () => { } }])
            return
        }
        if (!validationAll()) {
            setIsLoading(false)
            createUserWithEmailAndPassword(auth, textEmail, textPassword)
                .then((userCredential) => {
                    setIsLoading(true)
                    updateProfile(auth.currentUser, {
                        displayName: `${textFirstName} ${textLastName}`,
                    }).then(() => {
                        Alert.alert('Thông báo', `Đăng ký thành công`, [{ text: 'OK', onPress: () => { } }])
                        resetForm()
                    }).catch((error) => {
                        Alert.alert('Thông báo', 'Lỗi không xác định', [{ text: 'OK', onPress: () => { } }])
                    })
                    signOut(auth).then(() => {
                        navigation.navigate('Login')
                    })
                }).catch((error) => {
                    setIsLoading(true)
                    Alert.alert('Thông báo', `${error.message}`, [{ text: 'OK', onPress: () => { } }])
                    resetForm()
                })
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            >
                <Text style={styles.titleRegister}>Đăng ký</Text>
                <View style={styles.main}>
                    <View style={styles.inputFullName}>
                        <View style={styles.inputFirstName}>
                            <Image
                                source={NAME}
                                resizMode='contain'
                                style={styles.icon}
                            />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Họ"
                                onChangeText={text => {
                                    setTextFirstName(text)
                                    validateFirstName(text) ? setIsFirstName(false) : setIsFirstName(true)
                                }}
                                value={textFirstName}
                            />
                            {
                                isFirstName ? <Text style={styles.textError}>Họ không hợp lệ</Text> : <></>
                            }
                        </View>
                        <View style={styles.inputLastName}>
                            <Image
                                source={NAME}
                                resizMode='contain'
                                style={styles.icon}
                            />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Tên"
                                onChangeText={text => {
                                    setTextLastName(text)
                                    validateLastName(text) ? setIsLastName(false) : setIsLastName(true)
                                }}
                                value={textLastName} />
                            {
                                isLastName ? <Text style={styles.textError}>Tên không hợp lệ</Text> : <></>
                            }
                        </View>
                    </View>
                    <View style={styles.input}>
                        <Image
                            source={EMAIL}
                            resizMode='contain'
                            style={styles.icon}
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Email"
                            onChangeText={text => {
                                setTextEmail(text)
                                validationEmail(text) ? setIsEmail(false) : setIsEmail(true)
                            }}
                            value={textEmail}
                        />
                        {
                            isEmail ? <Text style={styles.textError}>Sai định dạng</Text> : <></>
                        }

                    </View>
                    <View style={styles.input}>
                        <Image
                            source={PASSWORD}
                            resizMode='contain'
                            style={styles.icon}
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Mật khẩu"
                            onChangeText={text => {
                                setTextPassword(text)
                                validationPassword(text) ? setIsPassword(false) : setIsPassword(true)
                            }}
                            value={textPassword}
                            secureTextEntry={!showPass}
                        />
                        <TouchableOpacity onPress={() => {
                            setShowPass(!showPass)
                            if (!showPass) {
                                setIconPass(SHOW_PASSWORD)
                            } else {
                                setIconPass(HIDDEN_PASSWORD)
                            }
                        }
                        }>
                            <Image
                                source={iconPass}
                                resizMode='contain'
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                        {
                            isPassword ? <Text style={styles.textError}>Mật khẩu phải từ 6-20 ký tự, bao gồm chữ cái và số</Text> : <></>
                        }

                    </View>
                    <View style={styles.input}>
                        <Image
                            source={PASSWORD}
                            resizMode='contain'
                            style={styles.icon}
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Nhập lại mật khẩu"
                            onChangeText={text => {
                                setTextRetypePassword(text)
                                valiadtionRetypePassword(text) ? setIsRetypePassword(false) : setIsRetypePassword(true)
                            }}
                            value={textRetypePassword}
                            secureTextEntry={!showPassRetype}
                        />
                        <TouchableOpacity onPress={() => {
                            setShowPassRetype(!showPassRetype)
                            if (!showPassRetype) {
                                setIconPassRetype(SHOW_PASSWORD)
                            } else {
                                setIconPassRetype(HIDDEN_PASSWORD)
                            }
                        }}>
                            <Image
                                source={iconPassRetype}
                                resizMode='contain'
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                        {
                            isRetypePassword ? <Text style={styles.textError}>Mật khẩu không khớp</Text> : <></>
                        }
                    </View>
                </View>
                {
                    isLoading ?
                        <TouchableOpacity style={styles.btnRegister} onPress={handleRegister}>
                            <Text style={styles.textBtn}>Đăng ký</Text>
                        </TouchableOpacity>
                        :
                        <ActivityIndicator color='gray' />
                }
                <Text style={styles.textOR}>___OR___</Text>
                <View style={styles.orSignUp}>
                    <TouchableOpacity>
                        <Image
                            source={GOOGLE}
                            resizeMode='contain'
                            style={styles.iconLogin}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image
                            source={FACEBOOK}
                            resizeMode='contain'
                            style={styles.iconLogin}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.account}>
                    <Text style={styles.textAccount}>Bạn đã tài khoản?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.textBtnLogin}>Đăng nhập</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default Register