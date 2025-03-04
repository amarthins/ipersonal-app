import React, { useState, useEffect, useContext, useRef } from "react"
import { View, Text, ImageBackground, StatusBar, KeyboardAvoidingView, ScrollView, Image, TouchableOpacity } from 'react-native'
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

LocaleConfig.locales['pt-br'] = ptBr
LocaleConfig.defaultLocale = 'pt-br'

const AgendaAluno = ({ route, navigation }) => {

    const { getObject, signOut, getAgendaAbertoAluno, storeObject, removeValue, getServices, formataNome, updtCadastro } = useContext(AuthContext)

    const [user, setUser] = useState(null)
    const [day, setDay] = useState(null)
    const [lista, setLista] = useState(null)

    const [servicos, setServicos] = useState(null)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            //setLoading(true)
            const usuario = await getObject('@user')
            if (usuario !== undefined) {
                setUser(usuario)
            }
            //const services = await getServices()
            const currentDate = moment().format('YYYY-MM-DD')
            setDay(currentDate)

            if (day !== null) {
                const pendentes = await getAgendaAbertoAluno(day)
                console.log('pendentes', pendentes)
                setLista(pendentes.dados)
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
                    const pendentes = await getAgendaAbertoAluno(day)
                    setLista(pendentes?.dados)
                }
            } catch (error) {
                //setMsgError('Falha')
            }
            //setLoading(false)
        };
        fetchData();
        return () => { };
    }, [day])

    const changeDay = (day) => {
        setDay(day.dateString);
    }

    const DataList = ({ data }) => {
        if (!data || data.length === 0) {
            return (
                <View>
                    <Text style={{ color: '#FFF' }}> -</Text>
                    <View style={styles.divisionLine} />
                </View>
            )
        }

        return data.map((item, index) => {
            const data = moment(item.dia).format('DD/MM/YYYY') + ' - ' + item.hora.substring(0, 5)
            return (
                <View key={index}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textoRegular, { width: 100 }]}>Data:</Text>
                        <Text style={styles.textoRegular}>{data}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textoRegular, { width: 100 }]}>Local:</Text>
                        <Text style={styles.textoRegular}>{item.nome_local}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textoRegular, { width: 100 }]}>Profissional:</Text>
                        <Text style={styles.textoRegular}>{item.nome_profissional}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textoRegular, { width: 100 }]}>Tipo:</Text>
                        <Text style={styles.textoRegular}>{item.nome_servico}</Text>
                    </View>
                    <View style={styles.divisionLine} />
                </View>
            );
        })
    }

    return (
        <SafeAreaView style={styles.safeContainer}>

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

                    <View style={{
                        height: 60,
                        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                        <TouchableOpacity
                            style={{ flexDirection: 'row' }}
                        >
                            <Ionicons name={'calendar-outline'} size={22} style={{ marginRight: 10, color: '#F42302', }} />
                            <Text style={styles.textoLabel}>Agenda do dia {moment(day).format('DD/MM/YYYY')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.iconAdd}
                            onPress={() => navigation.navigate('AddAgendaAluno', { data: day })}
                        >
                            <Ionicons name={'add-circle'} size={30} color="#F54" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divisionLine} />

                    <Text style={[styles.textoRegular, { color: '#F00', lineHeight: 40 }]}>Solicitações Pendentes</Text>

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
export default AgendaAluno