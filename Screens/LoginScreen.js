import React, { useState, useEffect, useContext, useRef } from "react"
import { View, Text, ImageBackground, ActivityIndicator, StatusBar, KeyboardAvoidingView, ScrollView, Image, TouchableOpacity } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { SafeAreaView } from "react-native-safe-area-context"
import { TextInput } from 'react-native-paper'
import styles from '../src/styles';
import { Ionicons } from "@expo/vector-icons"
import { AuthContext } from '../src/context/auth'
import { unMask, mask } from 'remask'
import validate from 'validate.js'
import backgroundImage from '../src/assets/personal-aluna.png'

const LoginScreen = ({ route, navigation }) => {

    const { signIn } = useContext(AuthContext)

    const [senha, setSenha] = useState('1234')
    const [isSecure, setIsSecure] = useState(true)
    const [error, setError] = useState(null)
    const [msgErrorSenha, setMsgErrorSenha] = useState('')
    const [maskedValue, setMaskedValue] = useState('amarthins2010@gmail.com')
    const [loading, setLoading] = useState(true)

    const constraints = {
        email: {
            email: true,
        },
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        })
        return unsubscribe
    }, [navigation])


    const isEmail = (value) => {
        return !validate({ email: value }, constraints);
    }

    const isPhone = (value) => {
        const phoneRegex = /^(?:\(\d{2}\)\s?)?\d{4,5}-\d{4}$/;
        return phoneRegex.test(value);
    }

    const formatPhone = (value) => {
        const originalFone = unMask(value);
        const maskedFone = mask(originalFone, ['(99) 9999-9999', '(99) 99999-9999']);
        return maskedFone;
    }

    const handleChange = (value) => {
        setError('')
        const rawValue = unMask(value)
        const isNumeric = /^\d+$/.test(rawValue)

        if (isNumeric) {
            const formattedPhone = formatPhone(value)
            setMaskedValue(formattedPhone)
        } else {
            setMaskedValue(value)
        }
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
    }


    const handleAccess = async () => {
        setMsgErrorSenha('')

        const rawValue = unMask(maskedValue)
        const isNumeric = /^\d+$/.test(rawValue)

        let valida = true
        let msgErro = ''
        let login = null

        if (isNumeric) {
            if (rawValue.length < 10 || rawValue.length > 11) {
                valida = false
                msgErro = 'O telefone não está correto.'
            } else {
                login = rawValue
            }
        } else {
            valida = isEmail(maskedValue)
            if (!valida) {
                valida = false
                msgErro += '\nO e-mail não está correto.'
            }
            login = maskedValue
        }

        if (senha.trim().length !== 4) {
            msgErro = 'Corrija o valor da senha'
            valida = false
        }

        if (!valida) {
            setMsgErrorSenha(msgErro)
            return
        }

        const logar = await signIn(login, senha)

        if (logar.status === 201) {
            setMsgErrorSenha('Usuário não identificado')
            return
        } else if (logar.status === 202) {
            setMsgErrorSenha('Senha não confere')
            return
        }

        setMsgErrorSenha('Falha ao logar')

    }

    if (loading) {
        return (
            <View style={styles.containerLoading}>
                <ActivityIndicator size="large" color="#FFF" />
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, }}>
            <ImageBackground
                source={backgroundImage}
                style={[styles.background, { paddingLeft: '5%', paddingRight: '5%' }]}>

                <View style={styles.wrapperLogo}>
                    <Animatable.Image
                        delay={300}
                        animation="flipInY"
                        style={[styles.logo, { height: 100, marginTop: 40 }]}
                        source={require('../src/assets/logo-negativo.png')}
                    />
                </View>

                <KeyboardAvoidingView style={styles.blockLogin}>

                    <View style={{ height: 100, backgroundColor: 'transparent' }}>
                        <Text style={[styles.textoLabel, { color: '#FFF' }]}>Seja Bem-vindo</Text>
                        <Text style={[styles.textoLabel, { color: '#FFF' }]}>Acesse seu cadastro de forma rápida e segura!</Text>
                    </View>

                    <View style={styles.blockInputsLogin}>
                        <TextInput
                            label="E-mail ou Telefone"
                            mode="flat"
                            style={styles.inputFlat}
                            underlineColor="transparent"
                            activeUnderlineColor="transparent"
                            onChangeText={handleChange}
                            value={maskedValue}
                            left={<TextInput.Icon icon="phone" style={{ paddingTop: 10 }} size={25} />}
                            keyboardType="default"
                        />
                        <View style={styles.wrapperError}>
                            {error && <Text style={styles.msgError}>{error}</Text>}
                        </View>

                        <TextInput
                            label="Senha de 4 números (9999)"
                            mode="flat"
                            style={styles.inputFlat}
                            underlineColor="transparent"
                            activeUnderlineColor="transparent"
                            value={senha}
                            //value={'1234'}
                            secureTextEntry={isSecure}
                            maxLength={4}
                            onChangeText={(val) => validaSenha(val)}
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
                            <Text style={styles.textoBtn}>Entrar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                            <Text style={[styles.textoRegular, { color: '#FF0' }]}>Esqueceu sua senha?</Text>
                        </TouchableOpacity>
                    </View>

                </KeyboardAvoidingView>

                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                    <Text style={[styles.textoRegular, { color: '#FFF', }]}>Não tem conta?</Text>
                    <TouchableOpacity
                        style={{ paddingTop: 0 }}
                        onPress={() => navigation.navigate('WelcomeScreen')}>
                        <Text style={[styles.textoRegular, { color: '#FFF', paddingTop: 0, }]}>{'  '}Crie agora</Text>
                    </TouchableOpacity>
                </View>

            </ImageBackground>
        </SafeAreaView>
    )
}
export default LoginScreen;