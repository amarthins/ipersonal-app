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

const AddMetas = ({ route, navigation }) => {

    const { getObject, retornaMetas, salvaMetaAluno, checkFile, storeObject, removeValue, getServices, formataNome, updtCadastro } = useContext(AuthContext)

    const [user, setUser] = useState()
    const [metas, setMetas] = useState()
    const [metaSelected, setMetaSelected] = useState(null)

    const pickerRef = useRef();


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            const usuario = await getObject('@user')
            if (usuario !== undefined) {
                const meta = await retornaMetas()
                console.log('meta', meta)
                setMetas(meta)
                setUser(usuario)
            }
            //setLoading(false)
            setTimeout(() => {
                //setLoading(false);
            }, 1000);
        })
        return unsubscribe
    }, [navigation])

    function open() {
        pickerRef.current.focus();
    }

    function close() {
        pickerRef.current.blur();
    }

    const RenderPicker = () => {
        let retorno = []
        for (let key in metas) {
            retorno.push(<Picker.Item label={metas[key].definicao} style={{ height: 45, maxHeight: 45 }} value={metas[key].id} key={key} />)
        }
        return retorno
    }

    const handlePost = async () => {
        if(metaSelected===null)
        {
            alert('Selecione uma meta')
            return
        }
        const salvar = await salvaMetaAluno(metaSelected)
        if(salvar.status===200)
        {
            navigation.navigate('MinhasMetas')
        } else {
            alert('falha ao salvar')
        }
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar style={{}} />
            <View style={{ flex: 1, width: '100%', paddingHorizontal: '5%' }}>
                <ScrollView>
                    <Text style={[styles.textoLabel, { color: '#FFF', marginTop: 50 }]}>Incluir uma nova meta:</Text>

                    <Picker
                        style={{ backgroundColor: '#FFF', marginTop: 30 }}
                        ref={pickerRef}
                        selectedValue={metaSelected}
                        onValueChange={(item) => setMetaSelected(item)}>
                        <Picker.Item label="Selecione uma meta.." style={{}} value="null" key="-1" />
                        {RenderPicker()}
                    </Picker>

                    <TouchableOpacity
                        style={[styles.btnStandard, { marginTop: 40 }]}
                        onPress={handlePost}
                    >
                        <Text style={styles.textoBtn}>Incluir</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>)
}
export default AddMetas