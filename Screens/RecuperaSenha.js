import React, { useState, useEffect, useContext, useRef } from "react"
import { View, Text, ImageBackground, ActivityIndicator, StatusBar, KeyboardAvoidingView, ScrollView, Image, TouchableOpacity } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { SafeAreaView } from "react-native-safe-area-context"
import { TextInput, Button } from 'react-native-paper'
import styles from '../src/styles';
import { Ionicons } from "@expo/vector-icons"
import { AuthContext } from '../src/context/auth'
import { unMask, mask } from 'remask'
import validate from 'validate.js'
import backgroundImage from '../src/assets/personal-aluna.png'
import MessageArea from "../src/components/MessageArea"
import ModalComponent from "../src/components/ModalComponent"

const RecuperaSenha = ({ route, navigation }) => {

    const { resetPassword } = useContext(AuthContext)

    const [error, setError] = useState(null)
    const [isEmail, setIsEmail] = useState(false);
    const [isPhone, setIsPhone] = useState(false);
    const [formattedValue, setFormattedValue] = useState(null)
    const [toggle, setToggle] = useState(true)
    const [mensagem, setMensagem] = useState(null)

    const handleChange = (value) => {
        setError('')
        setIsEmail(false);
        setIsPhone(false);
        setFormattedValue(null)
        const emailRegex = /\S+@\S+\.\S+/;
        //const phoneRegex = /^[0-9]*$/;
        const phoneRegex = /^\d+$/;//.test(value)
        const rawValue = unMask(value)
        const isNumeric = /^\d+$/.test(rawValue)

        if (isNumeric) {
            const formattedPhone = mask(rawValue, ['(99) 99999-9999'])
            setFormattedValue(formattedPhone)
            if (rawValue.length === 11) {
                if (phoneRegex.test(rawValue)) {
                    setIsEmail(false);
                    setIsPhone(true);
                }
            }
        } else {
            setFormattedValue(value)
            if (emailRegex.test(value)) {
                setIsEmail(true);
                setIsPhone(false);
            }
        }
    }

    const handleSubmit = async () => {
        const reset = await resetPassword(formattedValue)
        setToggle(false)
        if (reset.status === 200) {
            setMensagem('A nova senha foi enviada para o e-mail cadastrado no sistema.')
        } else {
            setMensagem(reset.mensagem)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, }}>
            <ImageBackground
                source={backgroundImage}
                style={[styles.background, { paddingLeft: '5%', paddingRight: '5%' }]}>


                <View style={[styles.wrapperLogo, { maxHeight: 150 }]}>
                    <Animatable.Image
                        delay={300}
                        animation="flipInY"
                        style={[styles.logo, { height: 100, marginTop: 40 }]}
                        source={require('../src/assets/logo-negativo.png')}
                    />
                </View>

                <View style={{ flex: 1, backgroundColor: 'transparent', width: '100%' }}>
                    {toggle && <><TouchableOpacity
                        style={{ position: 'absolute', top: 0, right: 0 }}
                        onPress={() => navigation.goBack()}>
                        <Ionicons name="close-circle-outline" size={40} color={'#FFF'} />
                    </TouchableOpacity>

                        <Text style={[styles.textoHeader, { marginTop: 80, marginBottom: 40 }]}>Informe os dados do seu login:</Text>

                        <TextInput
                            label="E-mail ou Telefone"
                            mode="flat"
                            style={styles.inputFlat}
                            underlineColor="transparent"
                            activeUnderlineColor="transparent"
                            onChangeText={(text) => handleChange(text)}
                            value={formattedValue}
                            left={<TextInput.Icon icon="account" style={{ paddingTop: 10 }} size={25} />}
                            keyboardType={isPhone ? 'phone-pad' : 'default'}
                        />
                        {isEmail && <Text style={styles.info}>Inserido um e-mail válido</Text>}
                        {isPhone && <Text style={styles.info}>Inserido um telefone válido</Text>}

                        <View style={styles.wrapperError}>
                            {error && <Text style={styles.msgError}>{error}</Text>}
                        </View>

                        {!isEmail && !isPhone ?
                            <TouchableOpacity
                                style={[styles.btnMessage, { backgroundColor: '#CCC', position: 'absolute', bottom: 40 }]}
                                onPress={() => console.log('nada')}
                            >
                                <Text style={[styles.textoLabel, { color: '#333' }]}>Continua</Text>
                            </TouchableOpacity> :
                            <TouchableOpacity
                                style={[styles.btnMessage, { position: 'absolute', bottom: 40 }]}
                                onPress={handleSubmit}
                            >
                                <Text style={[styles.textoLabel, { color: '#333' }]}>Continua</Text>
                            </TouchableOpacity>}</>}

                    {!toggle && <View>
                        <TouchableOpacity
                        style={{ position: 'absolute', top: 0, right: 0 }}
                        onPress={() => navigation.goBack()}>
                        <Ionicons name="close" size={40} color={'#F00'} />
                    </TouchableOpacity>
                        <Text style={[styles.textoHeader, { marginTop: 80, marginBottom: 40 }]}>{mensagem && mensagem}</Text>
                    </View>}

                </View>

            </ImageBackground>
        </SafeAreaView>
    )
}
export default RecuperaSenha;