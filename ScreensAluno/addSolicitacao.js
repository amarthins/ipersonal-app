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

const AddSolicitacao = ({ route, navigation }) => {

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

    const handleAccess = async () => {
        console.log('salvar')
    }

    return (
        <SafeAreaView style={styles.safeContainer}>

            <View style={styles.wrapperContent}>

                <Text style={[styles.textoLabel, { marginTop: 30 }]}>Solicitação de Serviços</Text>
                <Text style={styles.textoRegular}>Dia:</Text>
                <Text style={styles.textoRegular}>Mês:</Text>
                <Text style={styles.textoRegular}>Ano:</Text>

                <Text style={styles.textoRegular}>Selecione o local ou pesquise por profissionais na proximidade</Text>
                <Text style={styles.textoRegular}>Selecione a categoria</Text>
                <Text style={styles.textoRegular}>Selecione a atividade</Text>

                <View style={styles.divisionLine} />

                <Text style={styles.textoRegular}>Seleção realizada:</Text>
                <Text style={styles.textoRegular}>Dia xx/xx/aaaa  Atividade: treino funcional Local: Academia Um
                    Profissional: Personal Um</Text>

                <TouchableOpacity
                    style={[styles.btnStandard, { marginTop: 20 }]}
                    onPress={handleAccess}>
                    <Text style={styles.textoBtn}>Entrar</Text>
                </TouchableOpacity>

                <View style={[styles.divisionLine, { marginBottom: 30 }]} />

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
export default AddSolicitacao