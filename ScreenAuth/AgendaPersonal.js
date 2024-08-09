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

LocaleConfig.locales['pt-br'] = ptBr
LocaleConfig.defaultLocale = 'pt-br'

const AgendaPersonal = ({ route, navigation }) => {

    const { getObject, signOut, storeObject, removeValue, getServices, formataNome, updtCadastro } = useContext(AuthContext)

    const [user, setUser] = useState(null)
    const [day, setDay] = useState(null)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            //setLoading(true)
            const usuario = await getObject('@user')
            if (usuario !== undefined) {
                setUser(usuario)
            }
            //setLoading(false)
            setTimeout(() => {
                //setLoading(false);
            }, 1000);
        })
        return unsubscribe
    }, [navigation])

    return (
        <SafeAreaView style={styles.safeContainer}>

            <View style={styles.wrapperContent}>
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
                        onDayPress={setDay}
                        markedDates={day && {
                            [day.dateString]: { selected: true }
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
                    <Text style={[styles.textoLabel, { color: '#FFF', lineHeight: 80, }]}>Agenda do dia {day?.dateString}</Text>
                </TouchableOpacity>
                <View style={{}}>
                    <Text style={[styles.textoRegular, { color: '#FFF' }]}>09:00 - Academia Um - Treino Funcional</Text>
                    <Text style={[styles.textoRegular, { color: '#FFF' }]}>11:00 - Academia Dois - Personal</Text>
                </View>

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