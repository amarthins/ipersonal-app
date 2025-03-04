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
import moment from "moment"

let { width, height } = Dimensions.get("window");

const HistoricoAluno = ({ route, navigation }) => {

    const { getObject, signOut, getHistoricoAluno, storeObject, removeValue, getServices, formataNome, updtCadastro } = useContext(AuthContext)

    const [user, setUser] = useState(null)
    const [lista, setLista] = useState(null)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            //setLoading(true)
            const usuario = await getObject('@user')
            if (usuario !== undefined) {
                setUser(usuario)
            }
            const history = await getHistoricoAluno()
            setLista(history.dados)
            //setLoading(false)
            setTimeout(() => {
                //setLoading(false);
            }, 1000);
        })
        return unsubscribe
    }, [navigation])

    useEffect(() => {
        const backAction = () => {
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );
        return () => backHandler.remove();
    }, [navigation]);

    const DataList = ({ data }) => {
        if (!data || data.length === 0) {
            return (<View><Text style={{ color: '#FFF' }}> Não foram encontradas nenhuma entrada na agenda</Text></View>)
        }

        const ativos = data.filter((item) => item.posicao === 'pendente' || item.posicao === 'aberto');
        const outros = data.filter((item) => item.posicao !== 'pendente' && item.posicao === 'aberto');

        return (
            <View>
                <Text style={[styles.textoRegular, { color: '#F00', lineHeight: 40 }]}>Aulas em aberto</Text>
                {ativos.length === 0 ? <Text style={styles.textoRegular}>Nenhuma aula em aberto</Text> : ''}
                {ativos.map((item, index) => {
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
                    )
                })}

                <Text style={[styles.textoRegular, { color: '#BDFF00', lineHeight: 40 }]}>Aulas realizadas</Text>
                {outros.map((item, index) => {
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
                    )
                })}
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar style={{}} />

            <View style={styles.wrapperContent}>
                <TouchableOpacity
                    style={{
                        width: '100%', alignItems: 'center', justifyContent: 'flex-start',
                        flexDirection: 'row',
                    }}
                    onPress={() => navigation.navigate('MinhasMetas')}
                >
                    <Ionicons name={'disc-outline'} size={22} style={{ marginRight: 10, color: '#F42302', }} />
                    <Text style={styles.textoLabel}>Minhas Metas</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.wrapperContent,{marginTop:20}]}>
                <TouchableOpacity
                    style={{
                        width: '100%', alignItems: 'center', justifyContent: 'flex-start',
                        flexDirection: 'row',
                    }}
                    onPress={() => navigation.navigate('TreinosListaAluno')}
                >
                    <Ionicons name={'barbell-outline'} size={22} style={{ marginRight: 10, color: '#F42302', }} />
                    <Text style={styles.textoLabel}>Meus Treinos</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.wrapperContent,{marginTop:20,maxHeight: height * 0.55}]}>
                <ScrollView style={{ width: '100%' }}>
                    <TouchableOpacity
                        style={{
                            width: '100%', alignItems: 'center', justifyContent: 'flex-start',
                            flexDirection: 'row'
                        }}
                        onPress={() => console.log('chama agenda')}>
                        <Ionicons name={'calendar-outline'} size={22} style={{ marginRight: 10, color: '#F42302', }} />
                        <Text style={[styles.textoLabel, { color: '#FFF', lineHeight: 50, }]}>Histórico de Aulas</Text>
                    </TouchableOpacity>

                    <View style={styles.divisionLine} />

                    <DataList data={lista} />

                </ScrollView>
            </View>

            <View style={styles.lineBottom}>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => navigation.navigate('AgendaAluno')}>
                    <Ionicons name={'calendar'} size={30} style={{ color: '#0F0', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => { }}>
                    <Ionicons name={'timer'} size={30} style={{ color: '#888', }} />
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
    );
}

export default HistoricoAluno