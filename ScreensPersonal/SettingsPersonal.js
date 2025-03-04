import React, { useState, useEffect, useContext, useRef } from "react"
import { View, Text, Modal, ImageBackground, StatusBar, KeyboardAvoidingView, ScrollView, Image, TouchableOpacity } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import { ptBr } from '../src/utils/localeCalendarConfig'
import { SafeAreaView } from "react-native-safe-area-context"
import config from '../src/config/index.json'
import { TextInput } from 'react-native-paper'
import styles from '../src/styles';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { AuthContext } from '../src/context/auth'
import { unMask, mask } from 'remask'
import validate from 'validate.js'
import backgroundImage from '../src/assets/personal-aluna.png'
import { FlashList } from '@shopify/flash-list'

const SettingsPersonal = ({ route, navigation }) => {

    const { getObject, deleteOption, signOut, getSettings, storeObject, removeValue, getServices, formataNome, updtCadastro } = useContext(AuthContext)

    const [user, setUser] = useState({
        name: '',
        cpf: '',
        email: '',
        avatar: null
    });
    const [locais, setLocais] = useState(null)
    const [servicos, setServicos] = useState(null)
    const [atende, setAtende] = useState(null)
    const [visible, setVisible] = useState(false)
    const [options, setOptions] = useState(null)
    const [type, setType] = useState(null)
    const [value, setValue] = useState(null)
    const [refresh, setRefresh] = useState(false)
    const [visibleDados, setVisibleDados] = useState(false)
    const [visibleRedes, setVisibleRedes] = useState(false)
    const [informacao, setInformacao] = useState(null)
    const [redes, setRedes] = useState([{ insta: '', face: '' }])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            try {
                const userData = await getObject('@user');
                const settings = await getSettings()

                //if (settings.localizacao.length > 0) {
                if (settings.localizacao?.cep !== undefined && settings.localizacao?.cep !== null) {
                    const originalLoc = unMask(settings.localizacao?.cep)
                    const mskLoc = mask(originalLoc, ['99.999-999'])
                    setAtende({ cep: mskLoc, bairro: settings.localizacao?.bairro })
                }
                setLocais(settings.locais)
                setServicos(settings.especialidades)
                if (userData) {
                    setUser(userData)
                }
            } catch (error) {
                console.error('Failed to load user data from storage:', error);
            }
            setTimeout(() => {
            }, 1000);
        })
        return unsubscribe
    }, [navigation])

    const showModal = async (tipo, id) => {
        let content = tipo === 'local' ? 'Confirma exclusão desse local?' : 'Confirma exclusão deste Serviço?'
        setOptions(content)
        setType(tipo)
        setValue(id)
        setVisible(true)
    }

    const handleChange = (key, value) => {
        setUser({ ...user, [key]: value });
    };

    const renderLocais = (data) => {
        return (
            <TouchableOpacity onPress={() => showModal('local', data.id)}>
                <View style={[styles.linha, { marginLeft: 30 }]}>
                    <Ionicons name={'close-circle'} size={24} color="#F00" />
                    <Text style={[styles.textoRegular, { paddingLeft: 10 }]}>{data.nome}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderServicos = (data) => {
        return (
            <TouchableOpacity onPress={() => showModal('servicos', data.id)}>
                <View style={[styles.linha, { marginLeft: 30 }]}>
                    <Ionicons name={'close-circle'} size={22} color="#F00" />
                    <Text style={[styles.textoRegular, { paddingLeft: 10 }]}>{data.nome_item}</Text>
                </View>
            </TouchableOpacity >
        )
    }

    useEffect(() => {
        const atualiza = async () => {
            //const settings = await getSettings()

            //const originalLoc = unMask(settings.localizacao?.cep)
            //const mskLoc = mask(originalLoc, ['99.999-999'])
            //setLocais(settings.locais)
            //setServicos(settings.especialidades)
            //setAtende({ cep: mskLoc, bairro: settings.localizacao?.bairro })
        }
        atualiza()
    }, [refresh])

    const handleSave = async (tipo, id) => {
        const result = await deleteOption(tipo, id)
        if (result.status === 200) {
            setVisible(false)
            setRefresh(!refresh)
        } else {
            alert('erro')
        }
    };

    const onChangeRede = (rede, valor) => {
        setRedes(prevRedes => {
            return prevRedes.map(item => ({ ...item, [rede]: valor }));
        });
    };

    const handleSaveDados = async () => {
        if (informacao == '' || informacao === null) {
            alert('digite a informação')
            return
        }
        console.log('type', informacao)
    }

    const handleSaveRedes = async () => {

        if (redes == '' || redes === null) {
            alert('digite a informação')
            return
        }
        console.log('redes = ', redes)
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={visible}
                onRequestClose={() => setVisible(false)}
            >
                <View style={styles.wrapperModal}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.btnCloseModal}
                            onPress={() => setVisible(false)}
                        >
                            <Ionicons name="close-circle" size={25} color="#F00" />
                        </TouchableOpacity>

                        <Text style={[styles.textoHeader, { color: '#333' }]}>{options}</Text>
                        <Text style={[styles.textoRegular, { paddingTop: 10 }]}></Text>

                        <View style={styles.wrapperBtnModal}>
                            <TouchableOpacity
                                style={[styles.btnStandard, { width: '48%', backgroundColor: '#FF0', position: 'absolute', bottom: 10 }]}
                                onPress={() => setVisible(false)}
                            >
                                <Text style={styles.textoBtn}>Fechar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.btnStandard, { width: '48%', backgroundColor: '#BDFF00', position: 'absolute', right: 0, bottom: 10 }]}
                                onPress={() => handleSave(type, value)}
                            >
                                <Text style={styles.textoBtn}>Confirma</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={visibleDados}
                onRequestClose={() => setVisibleDados(false)}
            >
                <View style={styles.wrapperModal}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.btnCloseModal}
                            onPress={() => setVisibleDados(false)}
                        >
                            <Ionicons name="close-circle" size={25} color="#F00" />
                        </TouchableOpacity>

                        <Text style={[styles.textoHeader, { color: '#333' }]}>Dados do Profissional</Text>
                        <Text style={[styles.textoRegular, { paddingTop: 10, color: '#333' }]}>
                            Faça uma descrição sua para ser apresentada aos alunos
                        </Text>

                        <TextInput
                            label="Minha Informação"
                            //value={text}
                            onChangeText={text => setInformacao(text)}
                            multiline
                            numberOfLines={4}
                            //style={styles.textInput}
                            mode="outlined"
                        />

                        <View style={styles.wrapperBtnModal}>
                            <TouchableOpacity
                                style={[styles.btnStandard, { width: '48%', backgroundColor: '#FF0', position: 'absolute', bottom: 10 }]}
                                onPress={() => setVisibleDados(false)}
                            >
                                <Text style={styles.textoBtn}>Fechar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.btnStandard, { width: '48%', backgroundColor: '#BDFF00', position: 'absolute', right: 0, bottom: 10 }]}
                                onPress={handleSaveDados}
                            >
                                <Text style={styles.textoBtn}>Confirma</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType={"slide"}
                transparent={true}
                visible={visibleRedes}
                onRequestClose={() => setVisibleRedes(false)}
            >
                <View style={styles.wrapperModal}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.btnCloseModal}
                            onPress={() => setVisibleRedes(false)}
                        >
                            <Ionicons name="close-circle" size={25} color="#F00" />
                        </TouchableOpacity>

                        <Text style={[styles.textoHeader, { color: '#333' }]}>Redes Sociais</Text>

                        <TextInput
                            label="Instagram"
                            //value={text}
                            onChangeText={text => onChangeRede('insta', text)}
                            //style={styles.textInput}
                            mode="outlined"
                        />

                        <TextInput
                            label="Facebook"
                            //value={text}
                            onChangeText={text => onChangeRede('face', text)}
                            //style={styles.textInput}
                            mode="outlined"
                        />

                        <View style={styles.wrapperBtnModal}>
                            <TouchableOpacity
                                style={[styles.btnStandard, { width: '48%', backgroundColor: '#FF0', position: 'absolute', bottom: 10 }]}
                                onPress={() => setVisibleRedes(false)}
                            >
                                <Text style={styles.textoBtn}>Fechar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.btnStandard, { width: '48%', backgroundColor: '#BDFF00', position: 'absolute', right: 0, bottom: 10 }]}
                                onPress={handleSaveRedes}
                            >
                                <Text style={styles.textoBtn}>Confirma</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={styles.wrapperContent}>
                <ScrollView style={{ width: '100%' }}>
                    <Text style={[styles.textoHeader, { textAlign: 'center', marginBottom: 20, color: '#FFF' }]}>Configurações</Text>

                    <View style={styles.linha}>
                        <View style={{ width: 30 }}>
                            <Ionicons name={'home'} size={22} color="#BDFF00" />
                        </View>
                        <Text style={[styles.textoRegular, { color: '#FFF', lineHeight: 50 }]}>Locais Atendidos</Text>
                        <TouchableOpacity
                            style={[styles.iconAdd, { position: 'absolute', right: 0 }]}
                            //onPress={() => navigation.navigate('EditSettings', { opcao: 'locais' })}
                            onPress={() => navigation.navigate('LocaisMap', { opcao: 'locais' })}
                        >
                            <Ionicons name={'add-circle'} size={30} color="#F54" />
                        </TouchableOpacity>
                    </View>
                    {locais?.length && locais?.length > 0 ?
                        <FlashList
                            data={locais}
                            renderItem={({ item }) => renderLocais(item)}
                            estimatedItemSize={200}
                        /> : <></>}

                    <View style={styles.divisionLine} />

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <View style={{ width: 30 }}>
                            <Ionicons name={'accessibility'} size={22} color="#BDFF00" />
                        </View>
                        <Text style={[styles.textoRegular, { color: '#FFF', lineHeight: 50 }]}>Serviços Oferecidos</Text>
                        <TouchableOpacity
                            style={[styles.iconAdd, { position: 'absolute', right: 0 }]}
                            onPress={() => navigation.navigate('EditSettings', { opcao: 'servicos' })}
                        >
                            <Ionicons name={'add-circle'} size={30} color="#F54" />
                        </TouchableOpacity>
                    </View>
                    {servicos?.length && servicos.length > 0 ?
                        <FlashList
                            data={servicos}
                            renderItem={({ item }) => renderServicos(item)}
                            estimatedItemSize={200}
                        /> : <></>}

                    <View style={styles.divisionLine} />

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <View style={{ width: 30 }}>
                            <Ionicons name={'earth'} size={22} color="#BDFF00" />
                        </View>
                        <Text style={[styles.textoRegular, { color: '#FFF', lineHeight: 50, }]}>Área de Atendimento</Text>
                        <TouchableOpacity
                            style={[styles.iconAdd, { position: 'absolute', right: 0 }]}
                            onPress={() => navigation.navigate('EditSettings', { opcao: 'area' })}
                        >
                            <Ionicons name={'add-circle'} size={30} color="#F54" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.linha}
                    //onPress={() => navigation.navigate('EditSettings', { opcao: 'cep' })}
                    >
                        <View style={[styles.linha, { paddingLeft: 30 }]}>
                            <MaterialCommunityIcons name={'circle-edit-outline'} size={22} color="#F00" />
                            <Text style={[styles.textoRegular, { color: '#FFF', }]}>{' '}CEP: {atende?.cep}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.linha}
                    >
                        <View style={[styles.linha, { paddingLeft: 30 }]}>
                            <MaterialCommunityIcons name={'circle-edit-outline'} size={22} color="#F00" />
                            <Text style={[styles.textoRegular, { color: '#FFF', }]}>{' '}Bairro: {atende?.bairro}</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.divisionLine} />

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <View style={{ width: 30 }}>
                            <Ionicons name={'calendar-outline'} size={22} color="#BDFF00" />
                        </View>
                        <Text style={[styles.textoRegular, { color: '#FFF', lineHeight: 50, }]}>Grade de Horários</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.linha}
                        onPress={() => navigation.navigate('EditShowGrade')}
                    >
                        <View style={[styles.linha, { paddingLeft: 30 }]}>
                            <MaterialCommunityIcons name={'eye'} size={22} color="#F00" />
                            <Text style={[styles.textoRegular, { color: '#FFF', }]}>{' '}Mostra Grade</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.divisionLine} />

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <View style={{ width: 30 }}>
                            <Ionicons name={'book'} size={22} color="#BDFF00" />
                        </View>
                        <Text style={[styles.textoRegular, { color: '#FFF', lineHeight: 50, }]}>Sobre o Profissional</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.linha}
                        onPress={() => setVisibleDados(true)}
                    >
                        <View style={[styles.linha, { paddingLeft: 30 }]}>
                            <MaterialCommunityIcons name={'circle-edit-outline'} size={22} color="#F00" />
                            <Text style={[styles.textoRegular, { color: '#FFF', }]}>{' '}Dados do Profissional</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.linha}
                        onPress={() => setVisibleRedes(true)}
                    >
                        <View style={[styles.linha, { paddingLeft: 30 }]}>
                            <MaterialCommunityIcons name={'circle-edit-outline'} size={22} color="#F00" />
                            <Text style={[styles.textoRegular, { color: '#FFF', }]}>{' '}Redes Sociais</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.divisionLine} />

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <View style={{ width: 30 }}>
                            <Ionicons name={'videocam-outline'} size={22} color="#BDFF00" />
                        </View>
                        <Text style={[styles.textoRegular, { color: '#FFF', lineHeight: 50, }]}>Vídeos e Aulas</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.linha}
                        onPress={() => navigation.navigate('VideosScreen')}
                    >
                        <View style={[styles.linha, { paddingLeft: 30 }]}>
                            <Ionicons name={'arrow-redo-circle'} size={22} color="#F00" />
                            <Text style={[styles.textoRegular, { color: '#FFF', }]}>{' '}Acessar Vídeos e Aulas</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.divisionLine} />

                </ScrollView>
            </View >

            <View style={styles.lineBottom}>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => navigation.navigate('AgendaPersonal')}>
                    <Ionicons name={'calendar'} size={30} style={{ color: '#0F0', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => { }}>
                    <Ionicons name={'settings'} size={30} style={{ color: '#888', }} />
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
        </SafeAreaView >
    )
}
export default SettingsPersonal