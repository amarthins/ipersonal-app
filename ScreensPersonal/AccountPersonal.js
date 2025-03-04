import React, { useState, useEffect, useContext, useRef } from "react"
import { View, Text, ImageBackground, Modal, StatusBar, KeyboardAvoidingView, ScrollView, Image, TouchableOpacity } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { SafeAreaView } from "react-native-safe-area-context"
import { TextInput } from 'react-native-paper'
import styles from '../src/styles';
import { Ionicons } from "@expo/vector-icons"
import { AuthContext } from '../src/context/auth'
import config from '../src/config/index.json'
import { unMask, mask } from 'remask'
import validate from 'validate.js'
import OverlayComponent from "../src/components/OverlayComponent"
import * as ImagePicker from 'expo-image-picker'
import avatarDefault from '../src/assets/avatar.png'


const AccountPersonal = ({ route, navigation }) => {

    const { getObject, checkFile, updtCadastro, removeValue, storeObject, signOut } = useContext(AuthContext)

    const [dados, setDados] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null)
    const [originalImage, setOriginalImage] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            try {
                const avatar = await getObject('@avatar')
                console.log('avatar', avatar)
                //await removeValue('@avatar')

                const userData = await getObject('@user');
                if (userData) {
                    const originalCpf = unMask(userData.cpf)
                    const maskedCpf = mask(originalCpf, ['999.999.999-99', '99.999.999/9999-99'])

                    const originalFone = unMask(userData.celular)
                    const maskedFone = mask(originalFone, ['(99) 9999-9999', '(99) 99999-9999'])

                    const originalLoc = unMask(userData.localizacao?.cep)
                    const mskLoc = mask(originalLoc, ['99.999-999'])

                    setDados({ ...userData, cpf: maskedCpf, celular: maskedFone, localizacao: { cep: mskLoc } })

                    if (avatar !== null) {
                        const verify = await checkFile(config.dir_fotos + avatar)
                        if (verify) {
                            setSelectedImage(config.dir_fotos + avatar)
                            setDados({ ...userData, avatar: avatar })
                        } else {
                            setSelectedImage(Image.resolveAssetSource(avatarDefault).uri)
                            setOriginalImage(Image.resolveAssetSource(avatarDefault).uri)
                        }
                    } else if (userData.avatar !== null) {
                        // verifica se é file
                        const verify = await checkFile(config.dir_fotos + userData.avatar)
                        if (verify) {
                            setSelectedImage(config.dir_fotos + userData.avatar);
                            setOriginalImage(userData.avatar);
                        } else {
                            setSelectedImage(Image.resolveAssetSource(avatarDefault).uri)
                            setOriginalImage(Image.resolveAssetSource(avatarDefault).uri)
                        }

                    } else {
                        setSelectedImage(Image.resolveAssetSource(avatarDefault).uri)
                        setOriginalImage(Image.resolveAssetSource(avatarDefault).uri)
                    }
                }
            } catch (error) {
                console.error('Failed to load user data from storage:', error);
            }
        })
        return unsubscribe

    }, [navigation])

    const closeModal = () => {
        setShowModal(false)
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

    const takePhoto = async (tipo) => {
        navigation.navigate('CameraScreen', { referencia: 'AccountPersonal', tipo: tipo });
    }

    const handleChange = (key, value) => {
        if (key == 'cpf') {
            const originalCpf = unMask(value)
            const maskedCpf = mask(originalCpf, ['999.999.999-99', '99.999.999/9999-99'])
            setDados({ ...dados, [key]: maskedCpf })
        } else if (key === 'localizacao') {
            const originalLoc = unMask(value)
            const mskLoc = mask(originalLoc, ['99.999-999'])
            setDados({ ...dados, [key]: mskLoc })
        } else {
            setDados({ ...dados, [key]: value });
        }
    };

    const changeFone = (value) => {
        const originalFone = unMask(value)
        const maskedFone = mask(originalFone, ['(99) 9999-9999', '(99) 99999-9999'])
        setDados({ ...dados, celular: maskedFone })
    }

    const handleSave = async () => {
        setIsVisible(true)
        try {
            const salvar = await updtCadastro(dados);

            if (salvar.status === 200) {
                await removeValue('@user')
                await storeObject('@user', salvar.usuario)
                navigation.navigate('DashPersonal')
            } else {
                console.log(salvar.mensagem)
            }
        } catch (error) {
            setIsVisible(false)
            console.error('Failed to save user data:', error);
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

    return (
        <SafeAreaView style={styles.safeContainer}>
            <OverlayComponent visible={isVisible} />
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

            <View style={styles.wrapperContent}>
                <ScrollView style={{ width: '100%' }}>
                    <Text style={[styles.textoHeader, { textAlign: 'center', marginBottom: 20, color: '#FFF' }]}>Editar Perfil</Text>
                    <TextInput
                        label="Nome"
                        mode="flat"
                        style={styles.inputFlat}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        onChangeText={(text) => handleChange('nome', text)}
                        value={dados?.nome}
                    />
                    <TextInput
                        label="cpf"
                        mode="flat"
                        style={[styles.inputFlat, { marginTop: 15 }]}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        onChangeText={(text) => handleChange('cpf', text)}
                        value={dados?.cpf}
                        keyboardType="number-pad"
                    />
                    <TextInput
                        label="E-mail"
                        mode="flat"
                        style={[styles.inputFlat, { marginTop: 15 }]}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        onChangeText={(text) => handleChange('email', text)}
                        value={dados?.email}
                        keyboardType="email-address"
                    />
                    <TextInput
                        label="Celular"
                        mode="flat"
                        style={[styles.inputFlat, { marginTop: 15 }]}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        onChangeText={(text) => changeFone(text)}
                        value={dados?.celular}
                        keyboardType="number-pad"
                    />
                    <TextInput
                        label="CEP - Localização"
                        mode="flat"
                        style={[styles.inputFlat, { marginTop: 15 }]}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        onChangeText={(text) => handleChange('localizacao', text)}
                        value={dados?.localizacao?.cep}
                        keyboardType="number-pad"
                    />

                    <View style={[styles.divisionLine, { marginTop: 20 }]} />

                    <Text style={[styles.textoRegular, { width: '100%' }]}>Avatar</Text>
                    <View style={styles.lineBtn}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            {selectedImage && (
                                <View style={styles.wrapperAvatarAccount}>
                                    <Image source={{ uri: selectedImage }} style={styles.avatar} />
                                    <TouchableOpacity
                                        style={styles.iconCamera}
                                        onPress={() => setShowModal(true)}
                                    >
                                        <Ionicons name={'camera'} size={35} color='#F54' />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={styles.divisionLine} />

                    <TouchableOpacity
                        style={[styles.btnStandard, { marginBottom: 10 }]}
                        onPress={handleSave}>
                        <Text style={styles.textoBtn}>Salvar</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <View style={styles.lineBottom}>
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
                    onPress={() => navigation.navigate('DashPersonal')}>
                    <Ionicons name={'home'} size={30} style={{ color: '#F54', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => { }}>
                    <Ionicons name={'person'} size={30} style={{ color: '#888', }} />
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
export default AccountPersonal