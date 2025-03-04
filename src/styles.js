import { StyleSheet, Dimensions } from 'react-native'

let { width, height } = Dimensions.get("window");
let numberGrid = 2;
let widthGrid = (width - 45) / numberGrid;
let itemHeight = height / 3 - 100;
let middleHight = height / 2 - 100;
let listHeight = height * 0.71 - 24
const firstColumn = (width - width * 0.04) * 0.14
const columnWidth = (width - width * 0.04 - firstColumn) / 8
const columnOver = (width - width * 0.04)

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
    wrapperAvatar: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    wrapperAvatarAccount: {
        backgroundColor: '#FFF',
        width: 108,
        height: 108,
        borderRadius: 54,
        justifyContent: 'center',
        alignItems: 'center'
    },
    wrapperAvatarAluno: {
        backgroundColor: '#FFF',
        width: 68,
        height: 68,
        borderRadius: 34,
        justifyContent: 'center',
        alignItems: 'center'
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
    wrapperProfessional: {
        flex: 1,
        width: '100%',
        height: 100,
        minHeight: 100,
        maxHeight: 100,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 10,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#CCC',
        backgroundColor: '#FFF'
    },
    wrapperPersonal: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        minHeight: 80,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
        minHeight: 80,
        paddingHorizontal: 10
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
    containerCarousel: {
        height: 300,
        marginBottom: 20,
        marginTop: 25,
        alignItems: 'center'
    },
    wrapperCarousel: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 5,
        marginHorizontal: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    scrollGrid: {
        flex: 1,
        flexGrow: 1,
        flexShrink: 1,
        maxHeight: height * 0.7,
        paddingBottom: 10,
        backgroundColor: '#000',
        borderRadius: 10,
    },
    scrollContainerGrid: {
        paddingHorizontal: width * 0.025,
        paddingVertical: height * 0.035
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
    blocoAtividades: {
        backgroundColor: '#000',
        borderRadius: 30,
        padding: 15,
        marginBottom: 20,
        elevation: 5,
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
    blockDash: {
        backgroundColor: '#000',
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10,
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
    lineBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingTop: 20,
        paddingBottom: 20
    },
    lineBtnModal: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingTop: 10,
        paddingBottom: 10
    },
    modalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 0,
        paddingHorizontal: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#FFF',
    },
    columnAvatar: {
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    linha: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    linhaItem: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
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
    autoCompleteSuggestions: {
        position: 'absolute',
        top: 80,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        zIndex: 10,
    },
    containerGrid: {
        flex: 1,
        width: width,
        paddingLeft: width * 0.05,
        paddingRight: width * 0.05,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: height * 0.05,
        maxHeight: height * 0.9
    },
    wrapperHeaderGrid: {
        flexDirection: 'row',
        width: columnOver
    },
    lineHeaderLeft: {
        width: firstColumn,
        borderWidth: 1,
        borderColor: '#888',
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    lineHeader: {
        width: columnWidth,
        borderWidth: 1,
        borderColor: '#888',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridCell: {
        width: columnWidth,
        borderColor: '#000',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lineMeta: {
        flex: 1,
        width: '100%',
        minWidth: '100%',
        height: 60,
        minHeight: 60,
        maxHeight: 60,
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#CCC',
        backgroundColor: '#FFF'
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
        //resizeMode: 'contain',
        borderRadius: 50,
    },
    avatarLista: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    avatarAtividades: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15
    },
    imageCarousel: {
        width: '100%',
        height: '80%',
        borderRadius: 8,
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
    btnMessage: {
        backgroundColor: '#BDFF00',
        height: 50,
        minHeight: 50,
        maxHeight: 50,
        width: '100%',
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderColor: '#D7D7D7',
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
        width: 50,
        height: 50,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    btnCamera: {
        alignSelf: "flex-end",
        alignItems: "center",
        backgroundColor: "transparent",
    },
    btnCloseModal: {
        flex: 0,
        alignSelf: "flex-end",
        alignItems: "flex-end",
        backgroundColor: "transparent",
    },
    btnCloseModalAbs: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    iconCamera: {
        color: '#F50',
        position: 'absolute',
        paddingTop: 80,
        paddingLeft: 70,
    },


    /* TEXTOS */
    textoHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF'
    },
    textoLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFF',
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
        fontSize: 15,
        color: '#FFF',
        fontWeight: '400',
        lineHeight: 30,
    },
    textoFlat: {
        color: '#282828',
        fontSize: 15,
        lineHeight: 25,
    },
    textoGrid: {
        fontSize: 12,
        color: '#FFF'
    },
    msgError: {
        color: 'red',
        fontSize: 12,
    },
    textoAtividades: {
        fontSize: 15,
        color: '#FFF',
        fontWeight: '400',
        flex: 1,
        paddingLeft: 10,
        flexWrap: 'wrap',
        lineHeight: 23,
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
    inputFlatMulti: {
        borderRadius: 0,
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30,
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        backgroundColor: '#FFF',
    },
    inputAutocomplete: {
        height: 40,
        borderColor: '#DDD',
        borderWidth: 1,
        borderRadius: 0,
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
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
    wrapperContentMessage: {
        width: '100%',
        height: height * 0.4,
        maxHeight: height * 0.4,
        position: 'absolute',
        bottom: 0,
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        justifyContent: 'space-between',
        paddingTop: 30,
        paddingBottom: 30,
    },
    wrapperBtnModal: {
        height: 60,
        marginTop: 15,
    },
    iconAdd: {
        marginLeft: 20,
        width: 30,
        height: 30,
        borderRadius: 40,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center'
    },
    grade: {
        width: width * 0.1
    },



    containerBotoes: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        width: '100%'
    },
    botaoProximidade: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 8,
        flex: 2
    },
    textoBotao: {
        color: '#FFF',
        textAlign: 'center'
    },
    inputCep: {
        flex: 2,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10
    },
    containerCep: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        overflow: 'hidden',
    },
    inputCep: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        backgroundColor: '#FFF',
    },
    botaoPesquisa: {
        padding: 8,
        backgroundColor: '#FFF',
        /*height: '100%',*/
        justifyContent: 'center',
        borderLeftWidth: 1,
        borderLeftColor: '#ccc',
    },

    /* ESTILOS PARA ATIVIDADES */
    radioContainer: {
        marginRight: 10,
        justifyContent: 'center'
    },
    radio: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#0F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioSelected: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#0F0',
    },
    itemAtividade: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#FFF',
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#DDD'
    },
    itemAtividadeSelecionado: {
        borderColor: '#0F0',
        backgroundColor: '#F0FFF0'
    },
    botaoPrimario: {
        backgroundColor: '#0F0',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        margin: 20
    },





})
export default styles