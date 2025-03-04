import React, { useState, useEffect, useContext, useRef } from "react"
import { View, Text, FlatList, ImageBackground, StatusBar, KeyboardAvoidingView, ScrollView, Image, TouchableOpacity } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import { ptBr } from '../src/utils/localeCalendarConfig'
import { SafeAreaView } from "react-native-safe-area-context"
import config from '../src/config/index.json'
import { TextInput } from 'react-native-paper'
import styles from '../src/styles';
import { Ionicons } from "@expo/vector-icons"
import { AuthContext } from '../src/context/auth'
import { unMask, mask } from 'remask'
import validate from 'validate.js'
import backgroundImage from '../src/assets/personal-aluna.png'
import moment from 'moment'
import { FlashList } from "@shopify/flash-list"
import { Picker } from '@react-native-picker/picker'
import avatarDefault from '../src/assets/avatar.png'

const AddAgendaAluno = ({ route, navigation }) => {

    const { getObject, signOut, salvaEntradaAgenda, formatCurrency, valorFlutuante, formataIntl, getProfLocaisByServ, getServices, storeObject, removeValue, formataNome, updtCadastro } = useContext(AuthContext)

    const [user, setUser] = useState(null)
    const [day, setDay] = useState(route.params?.data)
    const [servicos, setServicos] = useState(null)
    const [servSelected, setServSelected] = useState(null)
    const [nearProf, setNearProf] = useState(null)
    const [profSelected, setProfSelected] = useState(null)
    const [lista, setLista] = useState(null)

    const pickerRef = useRef();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            //setLoading(true)
            const usuario = await getObject('@user')
            if (usuario !== undefined) {
                setUser(usuario)
            }
            const services = await getServices()
            setServicos(services.servicos)
            //setLoading(false)
            setTimeout(() => {
                //setLoading(false);
            }, 1000);
        })
        return unsubscribe
    }, [navigation])

    useEffect(() => {
        const fetchData = async () => {
            if (servSelected) {
                try {
                    const dados = await getProfLocaisByServ(servSelected)
                    const parsedData = Object.entries(dados.profissionais)
                    setLista(parsedData)
                    //DataList(parsedData)
                } catch (error) {
                    setMsgError('Falha')
                }
            }
        };
        fetchData();
        return () => { };
    }, [servSelected]);

    const DataList = ({ data }) => {
        if (!data) {
            return null;
        }
        return data.map((el, inx) => {
            const selectedImage = el[1][0].avatar === null ?
                Image.resolveAssetSource(avatarDefault).uri :
                config.site_url + '/public/images/avatar/' + el[1][0].avatar
            return (
                <View key={inx} style={[styles.wrapperProfessional, { marginTop: 10, marginBottom: 10 }]}>
                    <View style={styles.columnAvatar}>
                        <View style={styles.wrapperAvatarAluno}>
                            <Image source={{ uri: selectedImage }} style={styles.avatarLista} />
                            <TouchableOpacity
                                style={styles.iconCamera}
                                onPress={() => console.log(true)}
                            >
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ width: '70%', paddingLeft: 10 }}>
                        <Text>{el[1][0].nome}</Text>
                        <Text>{el[1][0].nome_local}</Text>
                        <Text style={[styles.textoRegular, { color: '#333' }]}>{formataIntl(el[1][0].valor)}</Text>
                    </View>
                    <TouchableOpacity style={[styles.columnAvatar, { width: '10%' }]}
                        onPress={() => navigation.navigate('ShowGridProfessional', {
                            servico: el[1][0].servico,
                            id_membro: el[1][0].id_membro, nome: el[1][0].nome, dia: day, local: el[1][0].nome_local,
                            id_local: el[1][0].id_local, id_item: el[1][0].id_item
                        })}
                    >
                        <Ionicons name="add-circle" size={25} color={'#0F0'} />
                    </TouchableOpacity>
                </View>
            );
        })
    }

    function open() {
        pickerRef.current.focus();
    }

    function close() {
        pickerRef.current.blur();
    }

    const RenderPicker = () => {
        let retorno = []
        for (let key in servicos) {
            retorno.push(<Picker.Item label={servicos[key].nome} style={{ height: 45, maxHeight: 45 }} value={servicos[key].id} key={key} />)
        }
        return retorno
    }

    const handleSelect = async (item) => {
        console.log('item', item)
    }

    const handleAccess = async () => {
        console.log('salvar')
    }

    return (
        <SafeAreaView style={styles.safeContainer}>

            <View style={[styles.wrapperContent, { flex: 1 }]}>
                <ScrollView style={{ width: '100%' }}>
                    <Text style={[styles.textoLabel, { marginTop: 30 }]}>Solicitação de Serviços</Text>
                    <Text style={styles.textoRegular}>Dia:{'   '}{moment(day).format('DD/MM/YYYY')}</Text>

                    <Text style={[styles.textoLabel, { marginTop: 20, marginBottom: 20 }]}>Selecione o serviço para encontrar profissionais próximos a você</Text>

                    <View style={[styles.picker, { width: '100%', backgroundColor: '#FFF', height: 45 }]}>
                        <Picker
                            ref={pickerRef}
                            selectedValue={servSelected}
                            onValueChange={(item) => setServSelected(item)}>
                            <Picker.Item label="Selecione um serviço.." style={{}} value="null" key="-1" />
                            {RenderPicker()}
                        </Picker>
                    </View>

                    <View style={styles.divisionLine} />

                    <DataList data={lista} />

                    <View style={styles.divisionLine} />

                </ScrollView>
            </View>

            <View style={styles.lineBottom}>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => { }}>
                    <Ionicons name={'calendar'} size={30} style={{ color: '#888', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => navigation.navigate('HistoricoAluno')}>
                    <Ionicons name={'timer'} size={30} style={{ color: '#0F0', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => navigation.navigate('DashAluno')}>
                    <Ionicons name={'home'} size={30} style={{ color: '#F54', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => navigation.navigate('AccountAluno')}>
                    <Ionicons name={'person'} size={30} style={{ color: '#0F0', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => signOut()}>
                    <Ionicons name={'power'} size={30} style={{ color: '#F00', }} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )

}
export default AddAgendaAluno