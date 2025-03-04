import React, { useState, useEffect, useContext } from "react"
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from 'expo-status-bar'
import styles from '../src/styles'
import { AuthContext } from '../src/context/auth'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import { ptBr } from '../src/utils/localeCalendarConfig'
import moment from 'moment'

LocaleConfig.locales['pt-br'] = ptBr
LocaleConfig.defaultLocale = 'pt-br'

const PersonalAtividade = ({ navigation }) => {
    const { getObject, getServices, getProfissionaisByItem, storeObject, removeValue } = useContext(AuthContext)

    const [servicos, setServicos] = useState([])
    const [selectedService, setSelectedService] = useState(null)
    const [showServices, setShowServices] = useState(true)
    const [profissionais, setProfissionais] = useState([])
    const [selectedProfissional, setSelectedProfissional] = useState(null)
    const [showProfissionais, setShowProfissionais] = useState(true)
    const [selectedLocal, setSelectedLocal] = useState(null)
    const [showLocais, setShowLocais] = useState(true)
    const [showCalendar, setShowCalendar] = useState(true)
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'))
    const [dateConfirmed, setDateConfirmed] = useState(false)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            const usuario = await getObject('@user')
            if (usuario !== undefined) {
                const atividades = await getServices()
                setServicos(atividades.servicos)
            }
        })
        return unsubscribe
    }, [navigation])

    const handleContinuar = async () => {
        try {
            setShowServices(false)
            const response = await getProfissionaisByItem(selectedService.id)
            setProfissionais(response.profissionais)
        } catch (error) {
            console.error('Erro ao buscar profissionais:', error)
        }
    }

    const handleSelecionarProfissional = async () => {
        try {
            await storeObject('@profissional_selecionado', selectedProfissional)
            setShowProfissionais(false)
        } catch (error) {
            console.error('Erro ao salvar profissional:', error)
        }
    }

    const ListaServicos = ({ data }) => {
        if (!data) {
            return null;
        }

        return data.map((servico, index) => (
            <TouchableOpacity
                key={index}
                style={[
                    styles.itemAtividade,
                    (showServices && selectedService?.id === servico.id) ||
                    (showProfissionais && selectedProfissional?.id === servico.id) ||
                    (!showServices && !showProfissionais && selectedLocal?.id === servico.id) &&
                    styles.itemAtividadeSelecionado
                ]}
                onPress={() => {
                    if (showServices) {
                        setSelectedService(servico)
                    } else if (showProfissionais) {
                        setSelectedProfissional(servico)
                    } else {
                        setSelectedLocal(servico)
                    }
                }}
            >
                <View style={styles.radioContainer}>
                    <View style={styles.radio}>
                        {((showServices && selectedService?.id === servico.id) ||
                            (showProfissionais && selectedProfissional?.id === servico.id) ||
                            (!showServices && !showProfissionais && selectedLocal?.id === servico.id)) && (
                                <View style={styles.radioSelected} />
                            )}
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.textoLabel, { color: '#333' }]}>{servico?.nome}</Text>
                </View>
            </TouchableOpacity>
        ));
    }

    const handleLimpar = async () => {
        try {
            await removeValue('@data_selecionada')
            await removeValue('@profissional_selecionado')
            await removeValue('@local_selecionado')

            setShowServices(true)
            setShowProfissionais(true)
            setShowLocais(true)
            setShowCalendar(true)
            
            setSelectedService(null)
            setSelectedProfissional(null)
            setSelectedLocal(null)
            setSelectedDate(moment().format('YYYY-MM-DD'))
            setDateConfirmed(false)

            setProfissionais([])
            
            console.log('Todos os dados foram limpos')
        } catch (error) {
            console.error('Erro ao limpar dados:', error)
        }
    }

    const handleConfirmar = async () => {
        navigation.navigate('ShowGridProfessional', {
            dia: selectedDate,
            id_item: selectedService.id,
            id_local: selectedLocal.id,
            id_membro: selectedProfissional.id,
            local: selectedLocal.nome,
            nome: selectedProfissional.nome,
            servico: selectedService.nome
        })
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar style="light" />
            <View style={styles.wrapperAvatar}>
                <Text style={[styles.textoLabel, { color: '#FFF' }]}>Personal Atividade</Text>
            </View>

            <ScrollView style={{ flex: 1, width: '100%', padding: 20 }}>
                {showServices ? (
                    <>
                        <Text style={[styles.textoLabel, { marginBottom: 10 }]}>
                            Selecione um objetivo:
                        </Text>
                        <ListaServicos data={servicos} />

                        {selectedService && (
                            <TouchableOpacity
                                style={[styles.btnStandard, { marginTop: 20 }]}
                                onPress={handleContinuar}
                            >
                                <Text style={styles.textoBtn}>Continuar</Text>
                            </TouchableOpacity>
                        )}
                    </>
                ) : showProfissionais ? (
                    <>
                        <Text style={[styles.textoLabel, { marginBottom: 20 }]}>
                            Objetivo selecionado: {selectedService.nome}
                        </Text>

                        <Text style={[styles.textoLabel, { marginBottom: 10 }]}>
                            Selecione um profissional:
                        </Text>
                        <ListaServicos data={profissionais} />

                        {selectedProfissional && (
                            <TouchableOpacity
                                style={[styles.btnStandard, { marginTop: 20 }]}
                                onPress={handleSelecionarProfissional}
                            >
                                <Text style={styles.textoBtn}>Continuar</Text>
                            </TouchableOpacity>
                        )}
                    </>
                ) : (
                    <>
                        <Text style={[styles.textoLabel, { marginBottom: 10 }]}>
                            Objetivo selecionado: {selectedService.nome}
                        </Text>
                        <Text style={[styles.textoLabel, { marginBottom: 20 }]}>
                            Profissional selecionado: {selectedProfissional.nome}
                        </Text>

                        {showLocais ? (
                            <>
                                <Text style={[styles.textoLabel, { marginBottom: 10 }]}>
                                    Locais de atendimento:
                                </Text>
                                <ListaServicos data={selectedProfissional.locais} />

                                {selectedLocal && (
                                    <TouchableOpacity
                                        style={[styles.btnStandard, { marginTop: 20 }]}
                                        onPress={async () => {
                                            await storeObject('@local_selecionado', selectedLocal)
                                            setShowLocais(false)
                                        }}
                                    >
                                        <Text style={styles.textoBtn}>Continuar</Text>
                                    </TouchableOpacity>
                                )}
                            </>
                        ) : (
                            <>
                                <Text style={[styles.textoLabel, { marginBottom: 20 }]}>
                                    Local selecionado: {selectedLocal.nome}
                                </Text>

                                {showCalendar ? (
                                    <>
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
                                            onDayPress={day => setSelectedDate(day.dateString)}
                                            markedDates={{
                                                [selectedDate]: { selected: true }
                                            }}
                                        />

                                        <TouchableOpacity
                                            style={[styles.btnStandard, { marginTop: 20 }]}
                                            onPress={async () => {
                                                await storeObject('@data_selecionada', selectedDate)
                                                setShowCalendar(false)
                                                setDateConfirmed(true)
                                            }}
                                        >
                                            <Text style={styles.textoBtn}>Selecionar</Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <>
                                        <Text style={[styles.textoLabel, { marginBottom: 20 }]}>
                                            Data selecionada: {moment(selectedDate).format('DD/MM/YYYY')}
                                        </Text>

                                        {dateConfirmed && <>
                                            <TouchableOpacity
                                                style={[styles.btnStandard, { marginTop: 20 }]}
                                                onPress={handleConfirmar}
                                            >
                                                <Text style={styles.textoBtn}>Confirmar</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.btnStandard, { marginTop: 20, backgroundColor: '#FFF' }]}
                                                onPress={handleLimpar}
                                            >
                                                <Text style={styles.textoBtn}>Limpar</Text>
                                            </TouchableOpacity>
                                        </>}
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}
export default PersonalAtividade


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

salvaEntradaAgenda: {
    "dia": "2024-11-13", 
    "id_item": 3, 
    "id_local": "12", 
    "id_membro": 41, 
    "local": "Academia Paulista de Esgrima", 
    "nome": "personal um", 
    "servico": "Treino funcional"
}

*/