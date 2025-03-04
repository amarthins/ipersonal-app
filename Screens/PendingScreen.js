import React, { useState, useEffect, useContext, useRef } from "react"
import { View, Text, ImageBackground, Modal, StatusBar, KeyboardAvoidingView, ScrollView, Image, TouchableOpacity } from 'react-native'
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
import * as ImagePicker from 'expo-image-picker'
import ModalComponent from "../src/components/ModalComponent"
import backgroundImage from '../src/assets/personal-aluna.png'

const PendingScreen = ({ route, navigation }) => {

    const { getObject, storeObject, getCep, removeValue, signOut, formataNome, updtCadastro } = useContext(AuthContext)

    const [grupo, setGrupo] = useState(null)
    const [isSecure, setIsSecure] = useState(true)
    const [msgError, setMsgError] = useState('')
    const [maskedValue, setMaskedValue] = useState('')
    const [dados, setDados] = useState({})

    const [selectedImage, setSelectedImage] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [visible, setVisible] = useState(false)
    const [titleModal, setTitleModal] = useState(false)
    const [contentModal, setContentModal] = useState(false)

    const [nome, setNome] = useState(null)
    const [celular, setCelular] = useState(null)
    const [email, setEmail] = useState(null)
    const [cep, setCep] = useState(null)

    const [endereco, setEndereco] = useState('')
    const [numero, setNumero] = useState('')
    const [complemento, setComplemento] = useState('')
    const [bairro, setBairro] = useState('')
    const [cidade, setCidade] = useState('')
    const [uf, setUf] = useState('')

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            const valores = await getObject('@user')
            const grupo = valores.groupid === 4 ? 'personal' : 'aluno'
            setGrupo(grupo)

            const temp = await getObject('@dataTemp')

            console.log('temp pending',temp)


            if (temp !== null) {
                await removeValue('@dataTemp')
                const objeto = {
                    id: temp.id,
                    nome: temp.nome,
                    celular: temp.celular,
                    email: temp.email,
                    cep: temp.cep,
                    endereco: temp.endereco,
                    numero: temp.numero,
                    complemento: temp.complemento,
                    bairro: temp.bairro,
                    cidade: temp.cidade,
                    uf: temp.estado,
                    groupid: valores.groupid,
                    grupo: temp.grupo,
                    login: temp.login
                }
                console.log('objeto pending',objeto)
                setDados(objeto)
                setNome(temp.nome)
                setCelular(temp.celular)
                setEmail(temp.email)
                setCep(temp.cep)
                setEndereco(temp.endereco)
                setNumero(temp.numero)
                setBairro(temp.bairro)
                setCidade(temp.cidade)
                setUf(temp.uf)
            } else {
                console.log( 'valores pending',valores )
                setDados(valores)
                setNome(valores.nome)
                setCelular(valores?.celular)
                setCep(valores?.cep)
                setEmail(valores?.email)
                setEndereco(valores?.endereco)
                setBairro(valores?.bairro)
                setCidade(valores?.cidade)
                setUf(valores?.uf)
            }

            const avatar = await getObject('@avatar')
            await removeValue('@avatar')
            if (avatar !== null) {
                setSelectedImage(avatar)
                setDados({ ...dados, avatar: avatar })
            }

            setTimeout(() => { }, 1000);
        })
        return unsubscribe
    }, [navigation])

    const closeModal = () => {
        setShowModal(false)
        setVisible(false)
    }

    const handleChange = async (value, key) => {
        if (key === 'cep') {
            const originalCep = unMask(value)
            const maskedCep = mask(originalCep, ['99.999-999'])

            if (originalCep.length === 8) {
                const local = await getCep(originalCep)
                if (!local?.erro) {
                    setEndereco(local.logradouro)
                    setBairro(local.bairro)
                    setCidade(local.localidade)
                    setUf(local.estado)
                }
            }
            setCep(maskedCep)
            setDados({ ...dados, [key]: maskedCep })
        } else if (key === 'celular') {
            const originalCel = unMask(value)
            const mskCel = mask(originalCel, ['(99) 9999-9999', '(99) 99999-9999'])
            setDados({ ...dados, [key]: mskCel })
            setCelular(mskCel)
        } else {
            setDados({ ...dados, [key]: value });
        }
    }

    const takePhoto = async (tipo) => {
        const temp = {
            id: dados.id,
            nome: nome,
            celular: celular,
            email: email,
            avatar: dados.avatar,
            cep: cep,
            endereco: endereco,
            numero: numero,
            complemento: complemento,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            groupid: dados.groupid,
            grupo: dados.grupo,
            login: dados.login
        }
        await storeObject('@dataTemp', temp)
        navigation.navigate('CameraScreen', { referencia: 'PendingScreen', tipo: tipo });
    }

    const pickImage = async (tipo) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            if (tipo === 'avatar') {
                setDados({ ...dados, avatar: result.assets[0].uri })
                setSelectedImage(result.assets[0].uri);
            } else {
                alert('outro ' + tipo)
            }
        }
    }

    const handleClick = (acao) => {
        if (acao === 'pick') {
            setShowModal(false)
            pickImage('avatar')
        } else if (acao === 'take') {
            setShowModal(false)
            takePhoto('avatar')
        }
    }

    const handleSubmit = async () => {
        setMsgError('')
        let error = ''

        const saida = {
            id: dados.id,
            nome: nome,
            celular: celular,
            email: email,
            avatar: dados.avatar,
            cep: cep,
            endereco: endereco,
            numero: numero,
            complemento: complemento,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            groupid: dados.groupid,
            grupo: dados.grupo,
            login: dados.login
        }

        if (saida !== null) {
            Object.keys(saida).forEach((key) => {
                if (key === 'avatar') {
                    //saida[key] === '' ? error += '\n' + key + ' não pode ficar em branco' : ''
                } else if (key === 'endereco') {
                    saida[key] === '' ? error += '\n' + key + ' não pode ficar em branco' : ''
                } else if (key === 'bairro') {
                    saida[key] === '' ? error += '\n' + key + ' não pode ficar em branco' : ''
                } else if (key === 'cidade') {
                    saida[key] === '' ? error += '\n' + key + ' não pode ficar em branco' : ''
                } else if (key === 'uf') {
                    saida[key] === '' ? error += '\n' + key + ' não pode ficar em branco' : ''
                } else if (saida[key] === null || saida[key] === '' || saida[key] === undefined) {
                    if (key !== 'cpf' && key !== 'grupo' && key !== 'avatar' && key !== 'complemento' && key !== 'acesso' && key !== 'numero') {
                        error += '\n' + key + ' não pode ficar em branco'
                    }
                }
            });
        }
        if (error !== '') {
            setTitleModal('Atenção:')
            setContentModal(error)
            setVisible(true)
            setMsgError(error)
            return
        }

        const atualiza = await updtCadastro(saida)
        if (atualiza.status !== 200) {
            setTitleModal('Atenção:')
            setContentModal(atualiza.mensagem)
            setVisible(true)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, }}>
            <ModalComponent visible={visible} closeModal={closeModal} title={titleModal} content={contentModal} />
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={showModal}
                onRequestClose={closeModal}
            >
                <View style={styles.wrapperModal}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.btnCloseModal}
                            onPress={closeModal}
                        >
                            <Ionicons name="close-circle" size={25} color="#F00" />
                        </TouchableOpacity>

                        <Text style={[styles.textoLabel, { color: '#333' }]}>Selecione uma imagem</Text>

                        <View style={{
                            height: 100, flexDirection: 'row',
                            justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <TouchableOpacity
                                onPress={() => handleClick('pick')}
                            >
                                <Ionicons name={'image'} size={35} color='#F08F00' />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleClick('take')}
                            >
                                <Ionicons name={'camera'} size={35} color='#F54' />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <ImageBackground
                source={backgroundImage}
                style={[styles.background, { paddingLeft: '5%', paddingRight: '5%' }]}>

                <View style={styles.blockFull}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 30, }}>
                        <Animatable.Image
                            delay={300}
                            animation="flipInY"
                            style={[styles.logo, { width: 100, height: 50, marginTop: 0 }]}
                            source={require('../src/assets/logo-negativo.png')}
                        />
                    </View>

                    <View style={{ height: 100, backgroundColor: 'transparent' }}>
                        <Text style={[styles.textoLabel, { color: '#FFF' }]}>Cadastro de {grupo}</Text>
                        <Text style={[styles.textoLabel, { color: '#FFF' }]}>{formataNome(dados?.nome)}, complete o seu cadastro:</Text>
                    </View>

                    <View style={styles.wrapperScroll}>
                        <ScrollView>

                            <TextInput
                                label="Nome"
                                mode="flat"
                                style={[styles.inputFlat, { marginBottom: 20 }]}
                                underlineColor="transparent"
                                activeUnderlineColor="transparent"
                                onChangeText={(item) => setNome(item)}
                                value={dados?.nome}
                                keyboardType="default"
                            />
                            <TextInput
                                label="Celular"
                                mode="flat"
                                style={[styles.inputFlat, { marginBottom: 20 }]}
                                underlineColor="transparent"
                                activeUnderlineColor="transparent"
                                onChangeText={(text) => handleChange(text, 'celular')}
                                value={celular}
                                keyboardType="number-pad"
                            />
                            <TextInput
                                label="E-mail"
                                mode="flat"
                                style={[styles.inputFlat, { marginBottom: 20 }]}
                                underlineColor="transparent"
                                activeUnderlineColor="transparent"
                                onChangeText={(text) => setEmail(text)}
                                value={email}
                                keyboardType="default"
                            />
                            <View style={{ width: '50%' }}>
                                <TextInput
                                    label="CEP"
                                    mode="flat"
                                    style={[styles.inputFlat, { marginBottom: 20 }]}
                                    underlineColor="transparent"
                                    activeUnderlineColor="transparent"
                                    onChangeText={(text) => handleChange(text, 'cep')}
                                    value={cep}
                                    keyboardType="number-pad"
                                />
                            </View>
                            <TextInput
                                label="Endereço"
                                mode="flat"
                                style={[styles.inputFlat, { marginBottom: 20 }]}
                                underlineColor="transparent"
                                activeUnderlineColor="transparent"
                                onChangeText={(text) => setEndereco(text)}
                                value={endereco}
                                keyboardType="default"
                            />
                            <View style={{ width: '50%' }}>
                                <TextInput
                                    label="Número"
                                    mode="flat"
                                    style={[styles.inputFlat, { marginBottom: 20 }]}
                                    underlineColor="transparent"
                                    activeUnderlineColor="transparent"
                                    onChangeText={(text) => setNumero(text)}
                                    value={numero}
                                    keyboardType="default"
                                />
                            </View>
                            <TextInput
                                label="Complemento"
                                mode="flat"
                                style={[styles.inputFlat, { marginBottom: 20 }]}
                                underlineColor="transparent"
                                activeUnderlineColor="transparent"
                                onChangeText={(text) => setComplemento(text)}
                                value={complemento}
                                keyboardType="default"
                            />
                            <TextInput
                                label="Bairro"
                                mode="flat"
                                style={[styles.inputFlat, { marginBottom: 20 }]}
                                underlineColor="transparent"
                                activeUnderlineColor="transparent"
                                onChangeText={(text) => setBairro(text)}
                                value={bairro}
                                keyboardType="default"
                            />
                            <TextInput
                                label="Cidade"
                                mode="flat"
                                style={[styles.inputFlat, { marginBottom: 20 }]}
                                underlineColor="transparent"
                                activeUnderlineColor="transparent"
                                onChangeText={(text) => setCidade(text)}
                                value={cidade}
                                keyboardType="default"
                            />
                            <TextInput
                                label="UF"
                                mode="flat"
                                style={[styles.inputFlat, { marginBottom: 20 }]}
                                underlineColor="transparent"
                                activeUnderlineColor="transparent"
                                onChangeText={(text) => setUf(text)}
                                value={uf}
                                keyboardType="default"
                            />
                            {/*<View style={{ height: 50, backgroundColor: '#FFF', borderRadius: 50, }}>
                                <Picker
                                    selectedValue={dados?.id_categoria}
                                    onValueChange={(item) => updateFields(item, 'id_categoria')}>
                                    <Picker.Item label="Selecione uma categoria.." value="" key="-1" />
                                    {RenderPicker()}
                                </Picker>
                            </View>

                            <View style={{ height: 50, backgroundColor: '#FFF', borderRadius: 50, marginTop: 20 }}>
                                <Picker
                                    selectedValue={dados?.id_servico}
                                    onValueChange={(item) => updateFields(item, 'id_servico')}>
                                    <Picker.Item label="Selecione um serviço.." value="" key="-1" />
                                    {RenderService()}
                                </Picker>
                            </View>*/}
                            <Text style={[styles.textoRegular, { width: '100%' }]}>Avatar</Text>
                            <View style={[styles.lineBtn, { paddingBottom: 0, paddingTop: 0 }]}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                    <View style={styles.wrapperAvatarAccount}>
                                        <Image source={{ uri: selectedImage }} style={styles.avatar} />
                                        <TouchableOpacity
                                            style={styles.iconCamera}
                                            onPress={() => setShowModal(true)}
                                        >
                                            <Ionicons name={'camera'} size={35} color='#F54' />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            {/*<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, }}>
                                <TouchableOpacity
                                    style={{
                                        height: 50, backgroundColor: '#FFF', marginTop: 20, borderRadius: 50,
                                        justifyContent: 'center', paddingLeft: 20, width: '70%',
                                    }}
                                    onPress={() => navigation.navigate('SelectImageScreen', { referencia: 'PendingScreen' })}
                                >
                                    <Text>Selecione ou tire uma foto</Text>
                                </TouchableOpacity>
                                <Avatar.Image size={80} source={{ uri: dados?.avatar }} />
                                </View>*/}

                            <View style={styles.wrapperError}>
                                {msgError ? <Text style={[styles.msgError, { color: '#FCA' }]}>{msgError}</Text> : null}
                            </View>
                            <TouchableOpacity
                                style={[styles.btnStandard, { marginBottom: 10 }]}
                                onPress={handleSubmit}>
                                <Text style={styles.textoBtn}>Atualizar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.btnStandard, { marginBottom: 10, backgroundColor: '#FFF', borderColor: '#BDFF00' }]}
                                onPress={signOut}>
                                <Text style={styles.textoBtn}>Sair</Text>
                            </TouchableOpacity>
                        </ScrollView>

                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
    )
}
export default PendingScreen