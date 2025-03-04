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

const TreinosAlunos = ({ route, navigation }) => {

    const { getObject, retornaListaTreinosPorPersonal, salvaMetaAluno, checkFile, storeObject, removeValue, getServices, formataNome, updtCadastro } = useContext(AuthContext)

    const [user, setUser] = useState(null)
    const [alunoSelected,setAlunoSelected] = useState(null)
    const [alunos,setAlunos] = useState([])

    const pickerRef = useRef();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            const usuario = await getObject('@user')
            if (usuario !== undefined) {
                const clientes = await retornaListaTreinosPorPersonal(usuario.id)
                setAlunos(clientes)
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
        for (let key in alunos) {
            //retorno.push(<Picker.Item label={metas[key].definicao} style={{ height: 45, maxHeight: 45 }} value={metas[key].id} key={key} />)
        }
        return retorno
    }

    const handlePost = async () => {

        return
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
                <View style={[styles.wrapperAvatar, { flexDirection: 'row',marginTop:30,marginBottom:30, }]}>
                <Text style={[styles.textoLabel, { color: '#FFF' }]}>Treinos</Text>
                <TouchableOpacity
                    style={styles.iconAdd}
                    onPress={() => navigation.navigate('AddTreinosAlunos')}
                >
                    <Ionicons name={'add-circle'} size={30} color="#F54" />
                </TouchableOpacity>
            </View>

                    <Picker
                        style={{ backgroundColor: '#FFF', marginTop: 30 }}
                        ref={pickerRef}
                        selectedValue={alunoSelected}
                        onValueChange={(item) => setAlunoSelected(item)}>
                        <Picker.Item label="Selecione um aluno.." style={{}} value="null" key="-1" />
                        {RenderPicker()}
                    </Picker>

                    {/*<TouchableOpacity
                        style={[styles.btnStandard, { marginTop: 40 }]}
                        onPress={handlePost}
                    >
                        <Text style={styles.textoBtn}>Incluir</Text>
                    </TouchableOpacity>*/}
                </ScrollView>
            </View>
        </SafeAreaView>)
}
export default TreinosAlunos