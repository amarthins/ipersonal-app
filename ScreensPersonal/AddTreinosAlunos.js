import React, { useState, useEffect, useContext } from "react"
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context"
import { TextInput } from 'react-native-paper'
import moment from 'moment'
import { AuthContext } from '../src/context/auth'
import { Ionicons } from "@expo/vector-icons"
import ModalComponent from '../src/components/ModalComponent'
import styles from '../src/styles'

const AddTreinosAlunos = ({ route, navigation }) => {
    const { getObject, salvarTreino } = useContext(AuthContext)
    const [user, setUser] = useState(null)
    const [objetivo, setObjetivo] = useState('')
    const [local, setLocal] = useState('')
    const [atividades, setAtividades] = useState([])
    
    // Estados do Modal
    const [modalVisible, setModalVisible] = useState(false)
    const [modalTitle, setModalTitle] = useState('')
    const [modalContent, setModalContent] = useState('')
    const [modalConfirmAction, setModalConfirmAction] = useState(null)

    useEffect(() => {
        const loadUser = async () => {
            const usuario = await getObject('@user')
            setUser(usuario)
        }
        loadUser()
    }, [])

    const adicionarAtividade = () => {
        setAtividades([...atividades, {
            exercicio: '',
            series: '',
            comentarios: ''
        }])
    }

    const atualizarAtividade = (index, campo, valor) => {
        const novasAtividades = [...atividades]
        novasAtividades[index][campo] = valor
        setAtividades(novasAtividades)
    }

    const validarCampos = () => {
        if (!objetivo.trim()) {
            showModal('Atenção', 'Por favor, preencha o objetivo do treino.')
            return false
        }
        if (atividades.length === 0) {
            showModal('Atenção', 'Por favor, adicione pelo menos uma atividade.')
            return false
        }
        return true
    }

    const showModal = (title, content, confirmAction = null) => {
        setModalTitle(title)
        setModalContent(content)
        setModalConfirmAction(confirmAction)
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false)
        setModalConfirmAction(null)
    }

    const handleSave = async () => {
        if (!validarCampos()) return
        const dadosTreino = {
            id_profissional: user?.id,
            id_membro: route.params?.aluno?.id_cliente,
            data_inclusao: moment().format('YYYY-MM-DD'),
            objetivo: objetivo.trim(),
            local: local.trim(),
            atividades: atividades,
            posicao: 'pendente'
        }

        try {
            const response = await salvarTreino(dadosTreino)
            
            if (response.status === 200) {
                navigation.navigate('DashPersonal')
            } else {
                showModal(
                    'Erro', 
                    response?.mensagem || 'Erro ao salvar treino. Tente novamente.'
                )
            }
        } catch (error) {
            console.error('Erro ao salvar treino:', error)
            showModal('Erro', 'Ocorreu um erro ao salvar o treino.')
        }
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={[styles.wrapperAvatar,{marginTop: 40}]}>
                <Text style={[styles.textoLabel, { color: '#FFF' }]}>Novo Treino</Text>
            </View>

            <View style={[styles.wrapperScroll,{paddingHorizontal: '5%'}]}>
                <ScrollView>
                    <Text style={[styles.textoLabel, { marginVertical: 20 }]}>
                        Aluno: {route.params?.aluno?.nome_cliente}
                    </Text>

                    <TextInput
                        label="Objetivo"
                        mode="flat"
                        style={[styles.inputFlatMulti, { marginBottom: 20, }]}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        value={objetivo}
                        onChangeText={setObjetivo}
                        multiline
                        numberOfLines={4}
                        left={<TextInput.Icon icon="text" style={{ paddingTop: 10 }} size={25} />}
                    />

                    <TextInput
                        label="Local"
                        mode="flat"
                        style={[styles.inputFlat, { marginBottom: 20 }]}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        value={local}
                        onChangeText={setLocal}
                        left={<TextInput.Icon icon="map-marker" style={{ paddingTop: 10 }} size={25} />}
                    />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20 }}>
                        <Text style={styles.textoLabel}>Atividades</Text>
                        <TouchableOpacity onPress={adicionarAtividade}>
                            <Ionicons name="add-circle" size={30} color="#F54" />
                        </TouchableOpacity>
                    </View>

                    {atividades.map((atividade, index) => (
                        <View key={index} style={{ marginBottom: 20, backgroundColor: '#000', padding: 15, borderRadius: 8 }}>
                            <Text style={[styles.textoLabel, { marginBottom: 10 }]}>Atividade {index + 1}</Text>
                            
                            <TextInput
                                label="Exercício"
                                mode="flat"
                                style={[styles.inputFlat, { marginBottom: 10 }]}
                                value={atividade.exercicio}
                                onChangeText={(text) => atualizarAtividade(index, 'exercicio', text)}
                                left={<TextInput.Icon icon="dumbbell" style={{ paddingTop: 10 }} size={25} />}
                            />

                            <TextInput
                                label="Séries"
                                mode="flat"
                                style={[styles.inputFlat, { marginBottom: 10 }]}
                                value={atividade.series}
                                onChangeText={(text) => atualizarAtividade(index, 'series', text)}
                                left={<TextInput.Icon icon="repeat" style={{ paddingTop: 10 }} size={25} />}
                            />

                            <TextInput
                                label="Comentários"
                                mode="flat"
                                style={[styles.inputFlatMulti]}
                                value={atividade.comentarios}
                                onChangeText={(text) => atualizarAtividade(index, 'comentarios', text)}
                                multiline
                                numberOfLines={2}
                                left={<TextInput.Icon icon="comment" style={{ paddingTop: 10 }} size={25} />}
                            />
                        </View>
                    ))}

                    <TouchableOpacity
                        style={[styles.btnStandard, { marginBottom: 40 }]}
                        onPress={handleSave}
                    >
                        <Text style={styles.textoBtn}>Salvar</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <ModalComponent
                visible={modalVisible}
                closeModal={closeModal}
                title={modalTitle}
                content={modalContent}
                onPressConfirm={modalConfirmAction}
            />
        </SafeAreaView>
    )
}

export default AddTreinosAlunos