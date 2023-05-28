import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    itemRoom: {
        width: 350,
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        gap: 10,
        paddingHorizontal: 10,
        marginBottom: 20
    },
    imgRoom: {
        width: 50,
        height: 50,
        borderRadius: 100,
    },
    titleRoom: {
        width: 250,
    },
    nameRoom: {
        fontSize: 24,
        fontFamily: 'SairaCondensed-SemiBold',
    },
    message: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    currentMessage: {
        fontSize: 16,
        fontFamily: 'SairaCondensed-Medium',
    },
    textMessage: {
        fontSize: 12,
        fontWeight: '300',
        fontFamily: 'SairaCondensed-Regular',
    },
    timeSend: {
        fontSize: 12,
        fontFamily: 'SairaCondensed-Medium',
    }
})
export default styles