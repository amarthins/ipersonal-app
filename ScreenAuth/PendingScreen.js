import React, { useState, useEffect, useContext, useRef } from "react"
import { View, Text, ImageBackground, StatusBar, KeyboardAvoidingView, ScrollView, Image, TouchableOpacity } from 'react-native'
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

import backgroundImage from '../src/assets/personal-aluna.png'

const PendingScreen = ({ route, navigation }) => {

    const { getObject, storeObject, removeValue, getServices, formataNome, updtCadastro } = useContext(AuthContext)

    const [grupo, setGrupo] = useState(null)
    const [isSecure, setIsSecure] = useState(true)
    const [msgError, setMsgError] = useState('')
    const [maskedValue, setMaskedValue] = useState('')
    const [dados, setDados] = useState(null)

    const [categorias, setCategorias] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
    const [servicoSelecionado, setServicoSelecionado] = useState(null)
    const [foto, setFoto] = useState(null)
    const [novaImagemSelecionada, setNovaImagemSelecionada] = useState(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            //setLoading(true)
            const valores = await getObject('@user')
            const grupo = valores.groupid === 4 ? 'personal' : 'aluno'
            setGrupo(grupo)
            setDados(valores)


            const foto = await getObject('@avatar')

            if (foto?.uri !== '' && foto?.uri !== undefined) {

                //await removeValue('@avatar')
                const novoObjeto = {
                    ...valores,
                    avatar: foto?.uri
                };
                //console.log('dados',valores)
                //console.log('novoObjeto',novoObjeto)

                setDados(novoObjeto)
            }

            const services = await getServices()

            setCategorias(services.categorias);
            setServicos(services.servicos);

            setTimeout(() => {
                //setLoading(false);
            }, 1000);
        })
        return unsubscribe
    }, [navigation])

    const handleCategoriaChange = (categoria) => {
        setCategoriaSelecionada(categoria);
        const servicosFiltrados = servicos.filter((servico) => servico.id_categoria === categoria.id);
        setServicoSelecionado(null);
    };

    const handleServicoChange = (servico) => {
        setServicoSelecionado(servico);
    };

    const updateFields = async (item, campo) => {

        //const values = dados

        if (campo === 'nome') {
            setDados({ ...dados, nome: item })
        } else if (campo === 'id_categoria') {
            setDados({ ...dados, id_categoria: item })
        } else if (campo === 'id_servico') {
            setDados({ ...dados, id_servico: item })
        }
        await storeObject('@user', dados)
        //setDados(values)
    }

    const handleAccess = async () => {

        setMsgError('')

        let error = ''
        if (grupo === 3) {

        } else {

            if (!dados.id_categoria || dados?.id_categoria === '') {
                error += 'Selecione a Categoria\n'
            }
            if (!dados.id_servico || dados?.id_servico === '') {
                error += 'Selecione o serviço\n'
            }

        }
        if (dados.nome === '') {
            error += 'O nome não pode ficar em branco\n'
        }
        if (dados.avatar === '' || dados.avatar === undefined) {
            error += 'Selecione a sua foto!\n'
        }

        if (error !== '') {
            setMsgError(error)
            return
        }

        const atualiza = await updtCadastro(dados)
        if (atualiza.status !== 200) {
            setMsgError(atualiza.mensagem)
        }
    }

    const RenderPicker = (item) => {
        let retorno = []
        for (let key in categorias) {
            retorno.push(<Picker.Item label={categorias[key].nome} value={categorias[key].id} key={key} />)
        }
        return retorno
    }

    const RenderService = (item) => {
        const servicosFiltrados = servicos.filter((servico) => servico.id_categoria === dados.id_categoria);
        let retorno = []
        for (let key in servicosFiltrados) {
            retorno.push(<Picker.Item label={servicosFiltrados[key].nome} value={servicosFiltrados[key].id} key={key} />)
        }
        return retorno
    }

    return (
        <SafeAreaView style={{ flex: 1, }}>
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
                                onChangeText={(item) => updateFields(item, 'nome')}
                                value={dados?.nome}
                                keyboardType="default"
                            />

                            {route.params?.opcao === 'aluno' ?
                                <TextInput
                                    label="Telefone"
                                    mode="flat"
                                    style={[styles.inputFlat, { marginBottom: 20 }]}
                                    underlineColor="transparent"
                                    activeUnderlineColor="transparent"
                                    onChangeText={(text) => handleChange(text, 'number')}
                                    value={dados?.login}
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
                                    value={dados?.login}
                                    keyboardType="default"
                                />}


                            <View style={{ height: 50, backgroundColor: '#FFF', borderRadius: 50, }}>
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
                            </View>

                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, }}>

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

                            </View>


                            <View style={styles.wrapperError}>
                                {msgError ? <Text style={[styles.msgError, { color: '#FCA' }]}>{msgError}</Text> : null}
                            </View>
                            <TouchableOpacity
                                style={[styles.btnStandard, { marginBottom: 10 }]}
                                onPress={handleAccess}>
                                <Text style={styles.textoBtn}>Atualizar</Text>
                            </TouchableOpacity>
                        </ScrollView>

                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
    )
}
export default PendingScreen