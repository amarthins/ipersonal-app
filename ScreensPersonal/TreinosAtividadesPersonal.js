import React, { useState, useEffect, useContext } from "react"
import { View, Text, StatusBar, ScrollView, Image, TouchableOpacity, Modal } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import moment from 'moment'
import { AuthContext } from '../src/context/auth'
import styles from '../src/styles'
import config from '../src/config/index.json'
import avatarDefault from '../src/assets/avatar.png'
import { RadioButton } from 'react-native-paper';

const TreinosAtividadesPersonal = ({ route, navigation }) => {

    const { treino } = route.params
    const { getAtividadesTreino, getObject, atualizaStatusAtividade } = useContext(AuthContext)
    const [atividades, setAtividades] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedAtividade, setSelectedAtividade] = useState(null)
    const [checked, setChecked] = useState('pendente')
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            const usuario = await getObject('@user')
            if (usuario !== undefined) {
                const response = await getAtividadesTreino(treino.id)
                if (response) {
                    setAtividades(response)
                }
            }
        })
        return unsubscribe
    }, [navigation])

    useEffect(() => {
        if (selectedAtividade) {
            setChecked(selectedAtividade.posicao)
        }
    }, [selectedAtividade])

    useEffect(() => {
        const carregarAtividades = async () => {
            const response = await getAtividadesTreino(treino.id)
            if (response) {
                console.log('altero')
                setAtividades(response)
            }
        }
        carregarAtividades()
    }, [refresh])

    const handleStatusChange = async (novoStatus) => {
        if (selectedAtividade) {
            try {
                const response = await atualizaStatusAtividade(selectedAtividade.id, novoStatus)
                if (response.status === 200) {
                    const atividadesAtualizadas = await getAtividadesTreino(treino.id)
                    if (atividadesAtualizadas && atividadesAtualizadas.dados) {
                        setAtividades(atividadesAtualizadas.dados)
                    }
                }
            } catch (error) {
                console.error('Erro ao atualizar status:', error)
            }
            setModalVisible(false)
            setRefresh(!refresh)
        }
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar style={{}} />
            <View style={styles.wrapperAvatar}>
                <Text style={[styles.textoLabel, { color: '#FFF' }]}>Atividades do Treino</Text>
            </View>

            <ScrollView style={{ flex: 1, width: '100%' }}>
                <View style={{ padding: 20 }}>
                    {/* Cabeçalho com dados do treino */}
                    <View style={styles.blocoAtividades}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                            <Image
                                source={{
                                    uri: treino.avatar ?
                                        config.site_url + '/public/images/avatar/' + treino.avatar :
                                        Image.resolveAssetSource(avatarDefault).uri
                                }}
                                style={styles.avatarAtividades}
                                defaultSource={avatarDefault}
                            />
                            <Text style={[styles.textoLabel, { fontSize: 18, color: '#FFF' }]}>
                                {treino.nome_aluno}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                            <Text style={[styles.textoRegular, { lineHeight: 23, fontWeight: 'bold', color: '#666', width: 70, }]}>
                                Objetivo
                            </Text>
                            <Text style={styles.textoAtividades}>
                                {treino.objetivo}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'flex-start' }}>
                            <Text style={[styles.textoRegular, { lineHeight: 23, fontWeight: 'bold', color: '#666', width: 70, }]}>
                                Inclusão
                            </Text>
                            <Text style={styles.textoAtividades}>
                                {moment(treino.data_inclusao).format('DD/MM/YYYY')}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'flex-start' }}>
                            <Text style={[styles.textoRegular, { lineHeight: 23, fontWeight: 'bold', color: '#666', width: 70, }]}>
                                <Ionicons name="location" size={16} color="#666" />Local
                            </Text>
                            <Text style={styles.textoAtividades}>
                                {treino.local || 'Local não definido'}
                            </Text>
                        </View>
                    </View>

                    {/* Lista de Atividades */}
                    <Text style={[styles.textoLabel, { marginBottom: 15 }]}>Atividades</Text>

                    {atividades.map((atividade, index) => (
                        <View key={index} style={styles.blocoAtividades}>

                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                <Text style={[styles.textoRegular, { lineHeight: 23, fontWeight: 'bold', color: '#666', width: 70, }]}>
                                    Exercício
                                </Text>
                                <Text style={styles.textoAtividades}>
                                    {atividade.exercicio}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'flex-start' }}>
                                <Text style={[styles.textoRegular, { lineHeight: 23, fontWeight: 'bold', color: '#666', width: 70, }]}>
                                    Séries
                                </Text>
                                <Text style={styles.textoAtividades}>
                                    {atividade.series}
                                </Text>
                            </View>
                            {atividade.data_realizada && <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'flex-start' }}>
                                <Text style={[styles.textoRegular, { lineHeight: 23, fontWeight: 'bold', color: '#666', width: 70, }]}>
                                    Data
                                </Text>
                                <Text style={styles.textoAtividades}>
                                    {moment(atividade.data_realizada).format('DD/MM/YYYY')}
                                </Text>
                            </View>}
                            {atividade.comentarios && <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'flex-start' }}>
                                <Text style={[styles.textoRegular, { lineHeight: 23, fontWeight: 'bold', color: '#666', width: 70, }]}>
                                    Data
                                </Text>
                                <Text style={styles.textoAtividades}>
                                    {atividade.comentarios}
                                </Text>
                            </View>}
                            <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'flex-start' }}>
                                <Text style={[styles.textoRegular, { lineHeight: 23, fontWeight: 'bold', color: '#666', width: 70, }]}>
                                    Status
                                </Text>
                                <Text style={styles.textoAtividades}>
                                    {atividade.posicao}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedAtividade(atividade)
                                        setModalVisible(true)
                                    }}
                                    style={{ marginLeft: 10 }}
                                >
                                    <Ionicons name="create-outline" size={20} color="#F54" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.wrapperModal}>
                    <View style={styles.modalContent}>
                        <Text style={[styles.textoLabel, { color: '#333' }]}>
                            Alterar Status
                        </Text>

                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setChecked('pendente')}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RadioButton
                                    value="pendente"
                                    status={checked === 'pendente' ? 'checked' : 'unchecked'}
                                    onPress={() => setChecked('pendente')}
                                    color="#F54"
                                />
                                <Text style={[styles.textoRegular, { color: '#333' }]}>Pendente</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setChecked('concluido')}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RadioButton
                                    value="concluido"
                                    status={checked === 'concluido' ? 'checked' : 'unchecked'}
                                    onPress={() => setChecked('concluido')}
                                    color="#F54"
                                />
                                <Text style={[styles.textoRegular, { color: '#333' }]}>Concluído</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setChecked('cancelado')}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RadioButton
                                    value="cancelado"
                                    status={checked === 'cancelado' ? 'checked' : 'unchecked'}
                                    onPress={() => setChecked('cancelado')}
                                    color="#F54"
                                />
                                <Text style={[styles.textoRegular, { color: '#333' }]}>Cancelado</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 20,
                            marginBottom: 20,
                        }}>
                            <TouchableOpacity
                                style={styles.btnStandard}
                                onPress={() => handleStatusChange(checked)}
                            >
                                <Text style={styles.textoBtn}>Alterar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.btnStandard, { backgroundColor: '#666' }]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={[styles.textoBtn, { color: '#FFF' }]}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default TreinosAtividadesPersonal 