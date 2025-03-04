import React, { useState, useEffect, useContext, useRef } from "react"
import { View, Text, FlatList, Dimensions, ImageBackground, StatusBar, KeyboardAvoidingView, ScrollView, Image, TouchableOpacity } from 'react-native'
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
import ModalComponent from "../src/components/ModalComponent"

LocaleConfig.locales['pt-br'] = ptBr
LocaleConfig.defaultLocale = 'pt-br'
let { width, height } = Dimensions.get("window");

const ShowGridProfessional = ({ route, navigation }) => {

    const { getObject, signOut, salvaEntradaAgenda, gradeProfissionalDia, formatCurrency, valorFlutuante, formataIntl, getProfLocaisByServ, getServices, storeObject, removeValue, formataNome, updtCadastro } = useContext(AuthContext)

    const [user, setUser] = useState(null)
    const [day, setDay] = useState(route.params?.dia)
    const [local, setLocal] = useState(route.params?.local)
    const [idLocal, setIdLocal] = useState(route.params?.id_local)
    const [servico, setServico] = useState(route.params?.servico)
    const [item, setItem] = useState(route.params?.id_item)
    const [profissional, setProfissional] = useState(route.params?.id_membro)
    const [lista, setLista] = useState(null)
    const [horas, setHoras] = useState(null)
    const [visible, setVisible] = useState(false)
    const [titleModal, setTitleModal] = useState(false)
    const [contentModal, setContentModal] = useState(false)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            //setLoading(true)
            const usuario = await getObject('@user')
            if (usuario !== undefined) {
                setUser(usuario)
            }
            const grid = await gradeProfissionalDia(profissional, day)
            console.log('retorn grid',grid )
            setLista(grid.grade)
            setTimeout(() => {
                //setLoading(false);
            }, 1000);
        })
        return unsubscribe
    }, [navigation])

    const MontaLista = ({ data }) => {
        if (!data) {
            return null;
        }
        return data.map((el, i) => {
            return (
                <View key={i} style={{
                    backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-between',
                    alignItems: 'center', marginTop: 10, padding: 10
                }}>
                    <Text>{el}</Text>
                    <TouchableOpacity
                        onPress={() => handleChoice(el)}
                    >
                        <Ionicons name="add-circle" size={25} color="#F54" />
                    </TouchableOpacity>
                </View>
            )
        })
    }

    const closeModal = () => {
        setVisible(false)
    }

    const handleChoice = async (horario) => {
        setHoras(horario)
        setTitleModal('Confirmação')
        setContentModal('Confirma salvar a solicitação de agendamento?')
        setVisible(true)
    }

    const onPressConfirm = async () => {
        setVisible(false)
        const result = await salvaEntradaAgenda(horas, day, profissional, local, idLocal, item)
        if (result.status === 200) {
            navigation.navigate('DashAluno')
        } else {
            alert('falha')
        }
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <ModalComponent visible={visible} closeModal={closeModal} title={titleModal} content={contentModal} onPressConfirm={onPressConfirm} />
            <View style={[styles.wrapperContent, { flex: 1 }]}>
                <ScrollView style={{ width: '100%' }}>
                    <Text style={[styles.textoLabel, { marginTop: 30 }]}>Solicitação de Serviços</Text>
                    <Text style={styles.textoRegular}>Dia:{'   '}{moment(day).format('DD/MM/YYYY')}</Text>
                    <Text style={styles.textoRegular}>Atividade:{servico}</Text>
                    <Text style={styles.textoRegular}>Local: {local}</Text>

                    <View style={[styles.divisionLine, { marginBottom: 30 }]} />
                    {lista?.length > 0 && <Text style={styles.textoLabel}>Horários disponíveis </Text>}
                    {lista?.length === 0 && <Text style={styles.textoLabel}>Nenhum horário disponível </Text>}

                    {lista && <MontaLista data={lista} />}

                    <View style={[styles.divisionLine, { marginBottom: 30 }]} />
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
export default ShowGridProfessional