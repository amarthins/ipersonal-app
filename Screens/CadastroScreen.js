import React, { useState, useEffect, useContext, useRef } from "react"
import { View, Text, ImageBackground, StatusBar, KeyboardAvoidingView, ScrollView, Image, TouchableOpacity } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { SafeAreaView } from "react-native-safe-area-context"
import { TextInput } from 'react-native-paper'
import styles from '../src/styles';
import { Ionicons } from "@expo/vector-icons"
import { AuthContext } from '../src/context/auth'
import { unMask, mask } from 'remask'
import validate from 'validate.js'
import backgroundImage from '../src/assets/personal-aluna.png'
import ModalComponent from '../src/components/ModalComponent'

const CadastroScreen = ({ route, navigation }) => {

    const { formataNome, signOn } = useContext(AuthContext)

    const [senha, setSenha] = useState('')
    const [confSenha, setConfSenha] = useState(null)
    const [isSecure, setIsSecure] = useState(true)
    const [error, setError] = useState(null)
    const [msgErrorSenha, setMsgErrorSenha] = useState('')
    const [maskedValue, setMaskedValue] = useState('')
    const [dados, setDados] = useState(null)

    const [modalVisible, setModalVisible] = useState(false)
    const [erroModal,setErroModal] = useState(null)

    const constraints = {
        email: {
            email: true,
        },
    }
    const isEmail = (value) => {
        if(value===undefined)
        {
            return false
        }
        return !validate({ email: value }, constraints);
    }

    const validaSenha = (val) => {

        const valor = val.replace(/[^0-9]/g, '')

        if (valor.trim().length < 4) {
            setMsgErrorSenha('A senha deve ter 4 números')
        } else if (valor.trim().length > 4) {
            setMsgErrorSenha('A senha deve ter no máximo 4 números')
        } else if (valor.trim().length === 4) {
            setMsgErrorSenha(null)
        }
        setSenha(valor)
        setDados({ ...dados, senha: val })
    }

    const validaConfirmacao = (val) => {
        const valor = val.replace(/[^0-9]/g, '')
        setConfSenha(valor)
    }

    const updateFields = async (item, campo) => {

        if (campo === 'nome') {
            setDados({ ...dados, nome: item })
        }
    }

    const formatPhone = (value) => {
        const originalFone = unMask(value);
        const maskedFone = mask(originalFone, ['(99) 9999-9999', '(99) 99999-9999']);
        return maskedFone;
    }

    const handleChange = (value, opcao) => {
        setError('')

        if (opcao === 'number') {
            const rawValue = unMask(value)
            const isNumeric = /^\d+$/.test(rawValue)
            if (!isNumeric) {
                setMsgErrorSenha('Digite apenas números')
                return
            }
            const formattedPhone = formatPhone(value)
            setMaskedValue(formattedPhone)
        } else {
            setMaskedValue(value)
        }
        setDados({ ...dados, login: value })
    }

    const closeModal = () => {
        setModalVisible(false);
    };

    const handleAccess = async () => {
        let error = null
        const grupo = route.params.opcao === 'aluno' ? 3 : 4

        if (dados?.nome === null || dados?.nome === undefined) {
            error = ' O nome não podem ser nulo'
        }      

        if (senha !== confSenha) {
            error !== null ? error = error + '\n As senhas não conferem' : error = ' As senhas não conferem'
        }

        if (route.params.opcao === 'aluno') {
            const rawValue = unMask(dados?.login)
            const isNumeric = /^\d+$/.test(rawValue)
            if (!isNumeric) {
                error !== null ? error = error + '\n Digite apenas números para o CPF' : error = error + ' Digite apenas números para o CPF'
                setMsgErrorSenha('Digite apenas números')
            }

        } else {
            const valida = isEmail(dados?.login)
            if (!valida) {
                error !== null ? error = error + '\n O e-mail não é válido' : error = error + ' O e-mail não é válido'
                setMsgErrorSenha('O E-mail não é válido')
            }
        }

        if (error !== null) {
            setErroModal(error)
            setModalVisible(true)
            setMsgErrorSenha('Preencha todos os dados')
            return
        }

        const cadastra = await signOn(dados.nome, dados.login, dados.senha, grupo)
        if (cadastra.status !== 200) {
            setMsgErrorSenha(cadastra.mensagem)
        }

    }

    return (
        <SafeAreaView style={{ flex: 1, }}>
            <ModalComponent
                visible={modalVisible}
                closeModal={closeModal}
                title='Atenção:'
                content={erroModal}
            />
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
                        <Text style={[styles.textoLabel, { color: '#FFF' }]}>Cadastro de {formataNome(route.params.opcao)}</Text>
                    </View>

                    <View style={styles.wrapperScroll}>
                        <ScrollView>

                            <TextInput
                                label="Nome"
                                mode="flat"
                                style={[styles.inputFlat, { marginBottom: 20 }]}
                                underlineColor="transparent"
                                activeUnderlineColor="transparent"
                                onChangeText={(item) => updateFields(item, 'nome')}
                                value={dados?.nome}
                                left={<TextInput.Icon icon="account" style={{ paddingTop: 10 }} size={25} />}
                                keyboardType="default"
                            />

                            {route.params.opcao === 'aluno' ?
                                <TextInput
                                    label="Telefone"
                                    mode="flat"
                                    style={[styles.inputFlat, { marginBottom: 20 }]}
                                    underlineColor="transparent"
                                    activeUnderlineColor="transparent"
                                    onChangeText={(text) => handleChange(text, 'number')}
                                    value={maskedValue}
                                    left={<TextInput.Icon icon="phone" style={{ paddingTop: 10 }} size={25} />}
                                    keyboardType="number-pad"
                                />
                                :
                                <TextInput
                                    label="E-mail"
                                    mode="flat"
                                    style={[styles.inputFlat, { marginBottom: 20 }]}
                                    underlineColor="transparent"
                                    activeUnderlineColor="transparent"
                                    onChangeText={(text) => handleChange(text, 'email')}
                                    value={maskedValue}
                                    left={<TextInput.Icon icon="email" style={{ paddingTop: 10 }} size={25} />}
                                    keyboardType="default"
                                />}

                            <TextInput
                                label="Senha de 4 números (9999)"
                                mode="flat"
                                style={[styles.inputFlat, { marginBottom: 0 }]}
                                underlineColor="transparent"
                                activeUnderlineColor="transparent"
                                value={senha}
                                secureTextEntry={isSecure}
                                maxLength={4}
                                onChangeText={(val) => validaSenha(val)}
                                left={<TextInput.Icon icon="lock" style={{ paddingTop: 10 }} size={25} />}
                                right={<TextInput.Icon icon="eye" style={{ paddingTop: 10 }} size={25} onPress={() => setIsSecure(!isSecure)} />}
                                keyboardType="number-pad"
                            />
                            <TextInput
                                label="Confirme sua senha"
                                mode="flat"
                                style={[styles.inputFlat, { marginTop: 20 }]}
                                underlineColor="transparent"
                                activeUnderlineColor="transparent"
                                value={confSenha}
                                secureTextEntry={isSecure}
                                maxLength={4}
                                onChangeText={(val) => validaConfirmacao(val)}
                                left={<TextInput.Icon icon="lock" style={{ paddingTop: 10 }} size={25} />}
                                right={<TextInput.Icon icon="eye" style={{ paddingTop: 10 }} size={25} onPress={() => setIsSecure(!isSecure)} />}
                                keyboardType="number-pad"
                            />
                            <View style={styles.wrapperError}>
                                {msgErrorSenha ? <Text style={[styles.msgError, { color: '#FCA' }]}>{msgErrorSenha}</Text> : null}
                            </View>
                            <TouchableOpacity
                                style={[styles.btnStandard, { marginBottom: 10 }]}
                                onPress={handleAccess}>
                                <Text style={styles.textoBtn}>Cadastrar</Text>
                            </TouchableOpacity>
                        </ScrollView>

                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
    )
}
export default CadastroScreen