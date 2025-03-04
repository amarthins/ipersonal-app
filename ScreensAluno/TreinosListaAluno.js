import React, { useState, useEffect, useContext } from "react"
import { View, Text, ScrollView, TouchableOpacity, Image, Modal } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context"
import { Searchbar } from 'react-native-paper'
import { AuthContext } from '../src/context/auth'
import { Ionicons } from "@expo/vector-icons"
import styles from '../src/styles'
import config from '../src/config/index.json'
import avatarDefault from '../src/assets/avatar.png'
import { Rating } from 'react-native-ratings'
import OverlayComponent from '../src/components/OverlayComponent'

const TreinosListaAluno = ({ navigation }) => {

    const { getObject, retornaTreinosAluno, enviaReview, getReview } = useContext(AuthContext)

    const [searchQuery, setSearchQuery] = useState('')
    const [alunos, setAlunos] = useState([])
    const [alunosFiltrados, setAlunosFiltrados] = useState([])
    const [treinos, setTreinos] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedTreino, setSelectedTreino] = useState(null)
    const [selectedRating, setSelectedRating] = useState(0)
    const [avaliacoes, setAvaliacoes] = useState({})
    const [refresh, setRefresh] = useState(false)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const carregarTreinos = async () => {
            const usuario = await getObject('@user')
            if (usuario !== undefined) {
                const response = await retornaTreinosAluno(usuario.id)
                if (response && response.dados) {
                    setTreinos(response.dados)
                }
            }
        }
        carregarTreinos()
    }, [refresh])

    useEffect(() => {
        const carregarAvaliacoes = async () => {
            const user = await getObject('@user')
            if (user && treinos.length > 0) {
                const novasAvaliacoes = {}
                
                for (const treino of treinos) {
                    const response = await getReview(treino.id_profissional, user.id, treino.id)
                    
                    if (response && response.status === 200) {
                        novasAvaliacoes[treino.id] = response.media || 0
                    }
                }
                setAvaliacoes(novasAvaliacoes)
            }
        }
        carregarAvaliacoes()
    }, [treinos, refresh])

    const handleRating = async () => {
        setVisible(true)
        if (selectedTreino && selectedRating > 0) {
            try {
                const user = await getObject('@user')
                const dataAtual = new Date()
                const dataFormatada = dataAtual.toISOString().split('T')[0]

                const reviewData = {
                    id_membro: selectedTreino.id_profissional,
                    id_aluno: user.id,
                    id_treino: selectedTreino.id,
                    stars: selectedRating,
                    data_review: dataFormatada
                }

                const response = await enviaReview(reviewData)
                setVisible(false)
                if (response.status === 200) {
                    setRefresh(!refresh)
                    setModalVisible(false)
                }
            } catch (error) {
                setVisible(false)
                console.error('Erro ao enviar review:', error)
            }
        }
        setVisible(false)
    }

    return (
        <SafeAreaView style={[styles.safeContainer, { width: '100%' }]}>
            <OverlayComponent visible={visible} />
            <View style={styles.wrapperAvatar}>
                <Text style={[styles.textoLabel, { color: '#FFF' }]}>Lista de Treinos</Text>
            </View>

            <ScrollView style={{ flex: 1, width: '100%' }}>
                <View style={{ padding: '5%' }}>
                    {treinos.map((treino, index) => (
                        <View key={index} style={{
                            width: '100%',
                            flexDirection: 'row',
                            backgroundColor: '#FFF',
                            borderRadius: 30,
                            padding: 15,
                            marginBottom: 15,
                            alignItems: 'center',
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                        }}>
                            <Image
                                source={{
                                    uri: treino.avatar_profissional ?
                                        config.site_url + '/public/images/avatar/' + treino.avatar_profissional :
                                        Image.resolveAssetSource(avatarDefault).uri
                                }}
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 30,
                                    marginRight: 15
                                }}
                                defaultSource={avatarDefault}
                            />

                            <View style={{ flex: 1 }}>
                                <Text style={[styles.textoLabel, {
                                    fontSize: 16,
                                    marginBottom: 5,
                                    color: '#333'
                                }]}>
                                    {treino.nome_profissional || 'Personal não disponível'}
                                </Text>

                                <Text style={[styles.textoRegular, {
                                    fontSize: 14,
                                    color: '#666',
                                    marginBottom: 5
                                }]} numberOfLines={2}>
                                    {treino.objetivo || 'Objetivo não definido'}
                                </Text>

                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                    <Ionicons name="location" size={14} color="#666" />
                                    <Text style={[styles.textoRegular, {
                                        fontSize: 14,
                                        color: '#666',
                                        marginLeft: 5
                                    }]}>
                                        {treino.local || 'Local não definido'}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Rating
                                        type='star'
                                        startingValue={avaliacoes[treino.id] || 0}
                                        readonly={true}
                                        imageSize={16}
                                        style={{ alignSelf: 'flex-start',marginRight:10 }}
                                    />
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedTreino(treino)
                                            setModalVisible(true)
                                        }}
                                        style={{ marginLeft: 10 }}
                                    >
                                        <Ionicons name="create" size={20} color="#F54" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={() => navigation.navigate('TreinosAtividadesAluno', { treino })}
                                style={{ padding: 10 }}
                            >
                                <Ionicons name="chevron-forward" size={25} color="#666" />
                            </TouchableOpacity>
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
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 8,
                        padding: 20,
                        width: '80%',
                        elevation: 5,
                    }}>
                        <Text style={[styles.textoLabel, { marginBottom: 20, fontSize: 18 }]}>
                            Avaliar Personal
                        </Text>

                        <Rating
                            type='star'
                            ratingCount={5}
                            imageSize={30}
                            showRating={false}
                            startingValue={selectedTreino?.avaliacao || 0}
                            onFinishRating={(rating) => setSelectedRating(rating)}
                        />

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 20,
                        }}>
                            <TouchableOpacity
                                style={styles.btnStandard}
                                onPress={handleRating}
                            >
                                <Text style={styles.textoBtn}>Salvar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.btnStandard, { backgroundColor: '#666' }]}
                                onPress={() => {
                                    setModalVisible(false)
                                    setSelectedRating(0)
                                }}
                            >
                                <Text style={[styles.textoBtn, { color: '#FFF' }]}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default TreinosListaAluno    