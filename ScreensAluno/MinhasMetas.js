import React, { useState, useEffect, useContext, useRef } from "react"
import { View, Text, ImageBackground, Dimensions, StatusBar, BackHandler, KeyboardAvoidingView, ScrollView, Image, TouchableOpacity } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { SafeAreaView } from "react-native-safe-area-context"
import { TextInput, Avatar, Select, SelectItem, } from 'react-native-paper'
import styles from '../src/styles';
import { Ionicons } from "@expo/vector-icons"
import { AuthContext } from '../src/context/auth'
import { unMask, mask } from 'remask'
import validate from 'validate.js'
import { FlashList } from '@shopify/flash-list'
import { Picker } from '@react-native-picker/picker'
import config from '../src/config/index.json'
import backgroundImage from '../src/assets/personal-aluna.png'
import avatarDefault from '../src/assets/avatar.png'
import moment from 'moment'
import * as Localization from 'expo-localization'
import { i18n } from 'expo-localization';

const MinhasMetas = ({ route, navigation }) => {

    const { getObject, retornaMetasAluno, signOut, getAgendaDia, checkFile, storeObject, removeValue, getServices, formataNome, updtCadastro } = useContext(AuthContext)

    const [user, setUser] = useState(null)
    const [lista, setLista] = useState(null)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            const usuario = await getObject('@user')
            if (usuario !== undefined) {
                setUser(usuario)
                const metas = await retornaMetasAluno(usuario.id)
                setLista(metas)
            }
            //setLoading(false)
            setTimeout(() => {
                //setLoading(false);
            }, 1000);
        })
        return unsubscribe
    }, [navigation])

    const DataList = ({ data }) => {
        const valores = data.dados
        if (!data || data.dados?.length == 0) {
            return null;
        }
        return valores.map((item, index) => {

            return (
                <View key={index} style={styles.lineMeta}>
                        <Text>{item.definicao}</Text>
                        <Text>{item.posicao}</Text>
                </View>
            );
        })
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar style={{}} />
            <View style={[styles.wrapperAvatar, { flexDirection: 'row',marginTop:30,marginBottom:30, }]}>
                <Text style={[styles.textoLabel, { color: '#FFF' }]}>Minhas Metas</Text>
                <TouchableOpacity
                    style={styles.iconAdd}
                    onPress={() => navigation.navigate('AddMetas')}
                >
                    <Ionicons name={'add-circle'} size={30} color="#F54" />
                </TouchableOpacity>
            </View>

            {lista && <View style={{paddingHorizontal:'5%'}}><DataList data={lista} /></View>}
            {lista&&lista.dados?.length===0?<Text style={[styles.textoLabel, { color: '#FFF',paddingTop:50 }]}>Nenhuma meta definida</Text>:''}
        </SafeAreaView>)
}
export default MinhasMetas