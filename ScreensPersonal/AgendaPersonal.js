import React, { useState, useEffect, useContext, useRef } from "react"
import { View, Text, Modal, ImageBackground, StatusBar, KeyboardAvoidingView, ScrollView, Image, TouchableOpacity } from 'react-native'
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

LocaleConfig.locales['pt-br'] = ptBr
LocaleConfig.defaultLocale = 'pt-br'

const AgendaPersonal = ({ route, navigation }) => {
    
    const { getObject, signOut, getAgendaDiaProfissional, confirmaAgenda, storeObject, removeValue, getServices, formataNome, updtCadastro } = useContext(AuthContext)

    const [user, setUser] = useState(null)
    const [day, setDay] = useState(null)
    const [lista, setLista] = useState(null)
    const [visible, setVisible] = useState(false)
    const [content, setContent] = useState(null)
    const [itemSelected, setItemSelected] = useState(null)
    const [selecionado,setSelecionado] = useState(true)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            //setLoading(true)
            const usuario = await getObject('@user')
            if (usuario !== undefined) {
                setUser(usuario)
                const currentDate = moment().format('YYYY-MM-DD')
                setDay(currentDate)
                if (currentDate !== null) {
                    const pendentes = await getAgendaDiaProfissional(currentDate)
                    setLista(pendentes.dados)
                }
            }
            //setLoading(false)
            setTimeout(() => {
                //setLoading(false);
            }, 1000);
        })
        return unsubscribe
    }, [navigation])

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (day !== null) {
                    const pendentes = await getAgendaDiaProfissional(day)
                    setLista(pendentes?.dados)
                }
            } catch (error) {
                console.log('Falha')
            }
            //setLoading(false)
        };
        fetchData();
        return () => { };
    }, [day,selecionado])

    const changeDay = (day) => {
        setDay(day.dateString);
    }

    const closeModal = () => {
        setVisible(false)
    }

    const handlePending = (item) => {
        const conteudo = (
            <Text style={[styles.textoRegular, { color: '#333' }]}>Confirma o agendamento da aula
                {item.nome_servico} para {item.nome_cliente}
                no dia {moment(item.dia).format('MM/DD/YYYY')} às {item.hora.substring(0, 5)}?</Text>
        )
        setContent(conteudo)
        setItemSelected(item)
        setVisible(true)
    }

    const onPressConfirm = async (opcao) => {
        const confirmacao = await confirmaAgenda(itemSelected.id, opcao)
        setItemSelected(null)
        setVisible(false)
        if (confirmacao.status === 200) {
            const currentDate = moment().format('YYYY-MM-DD')
            setDay(currentDate)
            setSelecionado(!selecionado)
        } else {
            alert('Ocorreu um erro ao confirmar o agendamento')
        }
    }

    const DataList = ({ data }) => {
        const pending = !data || data.length === 0 ? [] : data.filter((item) => item.posicao === 'pendente');
        const abertos = !data || data.length === 0 ? [] : data.filter((item) => item.posicao === 'aberto')

        return (
            <View>
                <Text style={[styles.textoRegular, { color: '#F00', lineHeight: 40 }]}>Aulas Pendentes</Text>
                {pending.length === 0 ? <Text style={styles.textoRegular}>Nenhuma solicitação pendente</Text> : ''}
                {pending.map((item, index) => {
                    const dataFormatada = item.hora.substring(0, 5)
                    return (
                        <View key={index}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity
                                    style={{ width: 35 }}
                                    onPress={() => handlePending(item)}
                                >
                                    <Ionicons name={'checkmark-done-circle-outline'} size={26} color='#F00' />
                                </TouchableOpacity>
                                <Text style={[styles.textoRegular, { width: 50 }]}>{dataFormatada}</Text>
                                <Text style={[styles.textoRegular, {}]}>{item.nome_cliente} - {item.nome_servico}</Text>
                            </View>
                            <Text style={[styles.textoRegular, { paddingLeft: 90, fontStyle: 'italic' }]}>{item.nome_local}</Text>
                        </View>
                    )
                })}

                <View style={styles.divisionLine} />

                <Text style={[styles.textoRegular, { color: '#BDFF00', lineHeight: 40 }]}>Aulas Agendadas</Text>
                {abertos.length === 0 ? <Text style={styles.textoRegular}>Nenhuma aula encontrada</Text> : ''}
                {abertos.map((item, index) => {
                    return (
                        <View key={index}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.textoRegular, { width: 50 }]}>{item.hora.substring(0, 5)}</Text>
                                <Text style={[styles.textoRegular, {}]}>{item.nome_cliente} - {item.nome_servico}</Text>
                            </View>
                            <Text style={[styles.textoRegular, { paddingLeft: 50, fontStyle: 'italic' }]}>{item.nome_local}</Text>
                        </View>
                    )
                })}
                <View style={styles.divisionLine} />
            </View>
        )
    }


    return (
        <SafeAreaView style={styles.safeContainer}>
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={visible}
                onRequestClose={closeModal}
            >
                <View style={styles.wrapperModal}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.btnCloseModalAbs}
                            onPress={closeModal}
                        >
                            <Ionicons name="close-circle" size={25} color="#F00" />
                        </TouchableOpacity>
                        <Text style={[styles.textoHeader, { color: '#333' }]}>Aceitar agenda</Text>
                        {content}

                        <View style={styles.lineBtnModal}>
                            <TouchableOpacity
                                onPress={() => onPressConfirm('recusado')}
                                style={[styles.btnStandard, { backgroundColor: '#F00', maxWidth: '48%' }]}>
                                <Text style={[styles.textoBtn, { color: '#FFF' }]}>Recusar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.btnStandard, { backgroundColor: '#BDFF00', maxWidth: '48%' }]}
                                onPress={() => onPressConfirm('aberto')}
                            >
                                <Text style={styles.textoBtn}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={styles.wrapperContent}>
                <ScrollView style={{ width: '100%' }}>
                    <View style={{ width: '100%' }}>
                        <Calendar
                            style={styles.calendar}
                            headerStyle={{
                                borderBottomWidth: 0.5,
                                borderBottomColor: '#E8E8E8',
                                paddingBottom: 10,
                                marginBottom: 10,
                            }}
                            theme={{
                                textMonthFontSize: 18,
                                monthTextColor: '#E8E8E8',
                                todayTextColor: '#F54',
                                selectedDayBackgroundColor: '#0F0',
                                selectedDayTextColor: '#000',
                                arrowColor: '#0F0',
                                arrowStyle: {
                                    margin: 0,
                                    padding: 0,
                                },
                                calendarBackground: 'transparent',
                                dayTextColor: '#E8E8E8',
                                textDisabledColor: '#717171'
                            }}
                            minDate={new Date().toDateString()}
                            hideExtraDays
                            onDayPress={(day) => changeDay(day)}
                            markedDates={day && {
                                [day]: { selected: true }
                            }}
                        />
                    </View>

                    <TouchableOpacity
                        style={{
                            width: '100%', alignItems: 'center', justifyContent: 'flex-start',
                            flexDirection: 'row'
                        }}
                        onPress={() => console.log('chama agenda')}>
                        <Ionicons name={'calendar-outline'} size={22} style={{ marginRight: 10, color: '#F42302', }} />
                        <Text style={[styles.textoLabel, { color: '#FFF', lineHeight: 60, }]}>Agenda do dia {moment(day).format('DD/MM/YYYY')}</Text>
                    </TouchableOpacity>

                    <View style={styles.divisionLine} />

                    <DataList data={lista} />
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
                    onPress={() => navigation.navigate('SettingsPersonal')}>
                    <Ionicons name={'settings'} size={30} style={{ color: '#0F0', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => navigation.navigate('DashPersonal')}>
                    <Ionicons name={'home'} size={30} style={{ color: '#F54', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => navigation.navigate('AccountPersonal')}>
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
export default AgendaPersonal