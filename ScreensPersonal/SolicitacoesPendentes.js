import React, { useState, useEffect, useContext, useRef } from "react"
import { View, Text,Modal, ImageBackground, Dimensions, StatusBar, BackHandler, KeyboardAvoidingView, ScrollView, Image, TouchableOpacity } from 'react-native'
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
import moment from 'moment'

let { width, height } = Dimensions.get("window");

const SolicitacoesPendentes = ({ route, navigation }) => {

    const { getObject, signOut, getHistoricoAulasProfissional, storeObject, removeValue, getServices, formataNome, updtCadastro } = useContext(AuthContext)

    const [user, setUser] = useState(null)
    const [lista, setLista] = useState([])
    const [visible, setVisible] = useState(false)
    const [content, setContent] = useState(null)
    const [itemSelected, setItemSelected] = useState(null)
    const [selecionado,setSelecionado] = useState(true)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            //setLoading(true)
            const usuario = await getObject('@user')
            if (usuario !== undefined) {
                const pending = await getHistoricoAulasProfissional(usuario.id)
                const dados = pending.dados
                const filteredItems = dados.filter(item => item.posicao === 'pendente');
                setLista(filteredItems)
                setUser(usuario)
            }
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
            return null;
        }
        return data.map((item, index) => {
            const day = moment(item.dia.date).format('DD/MM/YYYY')
            const [hours, minutes] = item.hora.split(':');
            const hora = `${hours}:${minutes}`;
            return (
                <View key={index}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textoRegular, { width: 100 }]}>Data:</Text>
                        <Text style={styles.textoRegular}>{day} - {hora}</Text>

                        <TouchableOpacity
                        style={{position:'absolute',right:0}}
                        onPress={() => handlePending(item)}
                        >
                            <Ionicons name={'checkmark-circle-outline'} size={24} color="#0F0" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textoRegular, { width: 100 }]}>Local:</Text>
                        <Text style={styles.textoRegular}>{item.nome_local}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textoRegular, { width: 100 }]}>Aluno:</Text>
                        <Text style={styles.textoRegular}>{item.nome_cliente}</Text>
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
    
    const closeModal = () => {
        setVisible(false)
    }

    const handlePending = (item) => {
        const conteudo = (
            <Text style={[styles.textoRegular, { color: '#333' }]}>Confirma o agendamento da aula
                {' '+item.nome_servico} para {item.nome_cliente+' '}
                no dia {moment(item.dia.date).format('MM/DD/YYYY')} às {item.hora.substring(0, 5)}?</Text>
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

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar style={{}} />
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
                    <TouchableOpacity
                        style={{
                            width: '100%', alignItems: 'center', justifyContent: 'flex-start',
                            flexDirection: 'row'
                        }}
                        onPress={() => console.log('chama agenda')}>
                        <Ionicons name={'calendar-outline'} size={22} style={{ marginRight: 10, color: '#F42302', }} />
                        <Text style={[styles.textoLabel, { color: '#FFF', lineHeight: 50, }]}>Solicitações Pendentes</Text>
                    </TouchableOpacity>

                    <View style={styles.divisionLine} />

                    <DataList data={lista} />

                    {/*
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textoRegular, { width: 100 }]}>Data:</Text>
                        <Text style={styles.textoRegular}>13/08/2024 - 09:00</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textoRegular, { width: 100 }]}>Local:</Text>
                        <Text style={styles.textoRegular}>Academia Um</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textoRegular, { width: 100 }]}>Profissional:</Text>
                        <Text style={styles.textoRegular}>Presonal Um</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textoRegular, { width: 100 }]}>Tipo:</Text>
                        <Text style={styles.textoRegular}>Treino Funcional</Text>
                    </View>

                    <View style={styles.divisionLine} />

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textoRegular, { width: 100 }]}>Data:</Text>
                        <Text style={styles.textoRegular}>12/08/2024 - 11:00</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textoRegular, { width: 100 }]}>Local:</Text>
                        <Text style={styles.textoRegular}>Academia Um</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textoRegular, { width: 100 }]}>Profissional:</Text>
                        <Text style={styles.textoRegular}>Presonal Um</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textoRegular, { width: 100 }]}>Tipo:</Text>
                        <Text style={styles.textoRegular}>Treino Funcional</Text>
                    </View>

                    <View style={styles.divisionLine} />

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textoRegular, { width: 100 }]}>Data:</Text>
                        <Text style={styles.textoRegular}>10/08/2024 - 12:00</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textoRegular, { width: 100 }]}>Local:</Text>
                        <Text style={styles.textoRegular}>Academia Um</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textoRegular, { width: 100 }]}>Profissional:</Text>
                        <Text style={styles.textoRegular}>Presonal Um</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textoRegular, { width: 100 }]}>Tipo:</Text>
                        <Text style={styles.textoRegular}>Treino Funcional</Text>
                    </View>

                    <View style={styles.divisionLine} />*/}
                </ScrollView>
            </View>

            {/*<View style={styles.lineBottom}>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => navigation.navigate('AgendaPersonal')}>
                    <Ionicons name={'calendar'} size={30} style={{ color: '#0F0', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => navigation.navigate('SettingsPersonal')}>
                    <Ionicons name={'settings'} size={30} style={{ color: '#0F0', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => { }}>
                    <Ionicons name={'home'} size={30} style={{ color: '#888', }} />
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
            </View>*/}
        </SafeAreaView>
    );
}

export default SolicitacoesPendentes