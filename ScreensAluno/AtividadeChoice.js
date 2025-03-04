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

LocaleConfig.locales['pt-br'] = ptBr
LocaleConfig.defaultLocale = 'pt-br'

const AtividadeChoice = ({ route, navigation }) => {

    const { getObject, signOut, } = useContext(AuthContext)

    const [day, setDay] = useState(moment().format('YYYY-MM-DD'))
    const [selectedActivity, setSelectedActivity] = useState(null)
    const [selectedLocal, setSelectedLocal] = useState(null)
    const [profissional, setProfissional] = useState(null)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            const usuario = await getObject('@user')
            if (usuario !== undefined) {
                const prof = await getObject('@profissional')
                setProfissional(prof)
            }
        })
        return unsubscribe
    }, [navigation])

    const handleDayPress = (day) => {
        setDay(day.dateString)
    }

    const ListaAtividades = ({ data }) => {
        if (!data || !data.especialidades) {
            return null;
        }

        return data.especialidades.map((atividade, index) => (
            <TouchableOpacity
                key={index}
                style={[styles.itemAtividade,
                    selectedActivity?.nome === atividade.nome && styles.itemAtividadeSelecionado
                ]}
                onPress={() => setSelectedActivity(atividade)}
            >
                <View style={styles.radioContainer}>
                    <View style={styles.radio}>
                        {selectedActivity?.nome === atividade.nome && (
                            <View style={styles.radioSelected} />
                        )}
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.textoLabel,{color:'#333'}]}>{atividade.nome}</Text>
                    <Text style={[styles.textoRegular,{color:'#333'}]}>R$ {atividade.valor.toFixed(2)}</Text>
                </View>
            </TouchableOpacity>
        ));
    }

    const ListaLocais = ({ data }) => {
        if (!data || !data.locais) {
            return null;
        }

        return data.locais.map((local, index) => (
            <TouchableOpacity
                key={index}
                style={[
                    styles.itemAtividade,
                    selectedLocal?.id === local.id && styles.itemAtividadeSelecionado
                ]}
                onPress={() => setSelectedLocal(local)}
            >
                <View style={styles.radioContainer}>
                    <View style={styles.radio}>
                        {selectedLocal?.id === local.id && (
                            <View style={styles.radioSelected} />
                        )}
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.textoLabel,{color:'#333'}]}>{local.nome}</Text>
                    {/* <Text style={[styles.textoRegular,{color:'#333'}]}>{local.endereco}</Text> */}
                </View>
            </TouchableOpacity>
        ));
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
                            onDayPress={handleDayPress}
                            markedDates={day && {
                                [day]: { selected: true }
                            }}
                        />
                        <Text style={[styles.textoLabel, { 
                            textAlign: 'center', 
                            marginTop: 10,
                            color: '#E8E8E8' 
                        }]}>
                            {moment(day).format('DD/MM/YYYY')}
                        </Text>
                    </View>

                    <View style={{ paddingVertical: 20 }}>
                        <Text style={[styles.textoLabel, { marginBottom: 10 }]}>
                            Selecione o local:
                        </Text>
                        <ListaLocais data={profissional} />

                        <Text style={[styles.textoLabel, { marginBottom: 10, marginTop: 20 }]}>
                            Selecione uma atividade:
                        </Text>
                        <ListaAtividades data={profissional} />
                    </View>

                    {selectedActivity && selectedLocal && (
                        <TouchableOpacity
                            style={styles.btnStandard}
                            onPress={() => {
                                navigation.navigate('ShowGridProfessional', {
                                    dia: day,
                                    id_local:selectedLocal.id,
                                    id_item:selectedActivity.id_item,
                                    servico: selectedActivity.nome,
                                    local: selectedLocal.nome,
                                    id_membro: profissional.id,
                                    nome: profissional.nome
                                })
                            }}
                        >
                            <Text style={styles.textoBtn}>Continuar</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}
export default AtividadeChoice
/* 
   salvaEntradaAgenda {
    "dia": "2024-11-11", 
    "id_item": 1, 
    "id_local": "12", 
    "id_membro": 41, 
    "local": "Academia Paulista de Esgrima", 
    "nome": "personal um", 
    "servico": "Reeducação alimentar"
} 
    "dia": "2024-11-11", 
    "id_item": undefined, 
    "id_local": 12, 
    "id_membro": 41, 
    "local": "Academia Paulista de Esgrima", 
    "servico": "Fisioculturismo",
    "nome": "personal um"







*/