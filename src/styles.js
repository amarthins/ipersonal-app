import { StyleSheet, Dimensions } from 'react-native'

let { width, height } = Dimensions.get("window");
let numberGrid = 2;
let widthGrid = (width - 45) / numberGrid;
let itemHeight = height / 3 - 100;
let middleHight = height / 2 - 100;
let listHeight = height * 0.71 - 24

const accent = '#282828'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        color: '#FFF',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '100%',
        paddingTop: 20,
        paddingBottom: 0,
        marginBottom: 0,
    },
    safeContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#282828'
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: "cover",
        backgroundColor: '#282828'
    },
    wrapperLogo: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    wrapperContent: {
        width: '94%',
        backgroundColor: '#000',
        borderRadius: 20,
        justifyContent: 'center',
        padding: '5%',
        marginTop: 40,
        alignItems: 'flex-start',
        maxHeight: height * 0.75
    },
    wrapperError: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    wrapperScroll: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        backgroundColor: 'transparent',
    },
    blockLogin: {
        flex: 2,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: 20,
        justifyContent: 'space-between',
        borderRadius: 40,
        height: 400,
        minHeight: 400,
        maxHeight: 400,
    },
    blockInputsLogin: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    blockFull: {
        flex: 1,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: 20,
        justifyContent: 'space-between',
        borderRadius: 40,
        marginTop: 30,
        marginBottom: 30,
    },
    wrapperBottom: {
        flex: 1,
        width: '100%',
        paddingLeft: '5%',
        paddingRight: '5%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: '10%'
    },
    cameraInBound: {
        flex: 1
    },
    wrapperBtnCamera: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 30,
    },
    containerScreen: {
        flex: 1,
        width: null,
        height: height,
        backgroundColor: '#FFF',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    wrapperList: {
        height: listHeight,
        minHeight: listHeight,
        width: '100%',
        paddingLeft: '3%',
        paddingRight: '3%',
        paddingTop: 10,
        zIndex: 1,
        backgroundColor: '#FFF',
    },
    lineTitle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        maxHeight: 50,
    },
    lineFiles: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 120,
        maxHeight: 120,
    },
    containerLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: accent,
    },
    lineBottom: {
        height: height * 0.1,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: '3%',
        paddingLeft: '3%',
        backgroundColor: '#282828'
    },



    /*IMAGENS */
    logoWelcome: {
        width: '50%',
        minWidth: '50%',
        height: '50%',
        minHeight: '50%',
        resizeMode: 'contain',
    },
    logo: {
        width: '50%',
        maxWidth: '50%',
        resizeMode: 'contain',
    },
    logoTransp: {
        width: 100,
        height: 100,
        resizeMode: 'contain'
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },

    /*BOTOES*/
    btnStandard: {
        backgroundColor: '#BDFF00',
        height: 50,
        minHeight: 50,
        maxHeight: 50,
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        marginTop: 5,
        marginBottom: 5,
        borderColor: '#E2E2E2',
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 20,
        },
        shadowOpacity: 0.43,
        shadowRadius: 9.51,
        elevation: 6,
    },
    btnFiles: {
        borderWidth: 0,
        padding: 10,
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 60
    },
    btnScreen: {
        borderWidth: 1,
        borderColor: '#FFF',
        height: 45,
        maxHeight: 45,
        width: '60%',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
    },
    btnBottom: {
        width: 60,
        height: 60,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
    },

    /* TEXTOS */
    textoHeader: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    textoLabel: {
        fontSize: 18,
        fontWeight: '600'
    },
    textoInput: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333'
    },
    textoBtn: {
        fontSize: 22,
        fontWeight: '500',
        color: '#333'
    },
    textoRegular: {
        fontSize: 16,
        color: '#000',
        fontWeight: '500',
        lineHeight: 26,
    },
    msgError: {
        color: 'red',
        fontSize: 12,
    },

    /* COMPONENTES */
    calendar: {
        width: '100%',
        backgroundColor: 'transparent',
    },
    divisionLine: {
        height: 1,
        width: '100%',
        backgroundColor: '#CCC',
        marginTop: 10,
        marginBottom: 10,
    },
    inputLoginPaper: {
        backgroundColor: '#FFF',
        width: '100%',
        color: '#222',
        fontSize: 16,
        height: 50,
        minHeight: 50,
        maxHeight: 50,
        marginTop: 5,
        marginBottom: 5,
        paddingLeft: 10,
        borderRadius: 30,
        borderColor: '#E2E2E2',
        borderWidth: 0,
    },
    inputFlat: {
        borderRadius: 0,
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 50,
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50,
        backgroundColor: '#FFF',
        height: 50,
    },
    wrapperModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: '3%',
        paddingRight: '3%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        width: '100%'
    },
    modalContent: {
        width: '90%',
        maxHeight: height,

        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: '#FFF',
        borderRadius: 10,
    },
    wrapperBtnModal: {
        height: 60,
        marginTop: 15,
    },







})
export default styles