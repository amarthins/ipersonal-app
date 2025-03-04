import React, { useState, useEffect, useContext } from "react"
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context"
import { Searchbar } from 'react-native-paper'
import { AuthContext } from '../src/context/auth'
import { Ionicons } from "@expo/vector-icons"
import styles from '../src/styles'
import config from '../src/config/index.json'
import avatarDefault from '../src/assets/avatar.png'

const TreinosListaPersonal = ({ navigation }) => {

    const { getObject, retornaListaTreinosPorPersonal } = useContext(AuthContext)

    const [searchQuery, setSearchQuery] = useState('')
    const [alunos, setAlunos] = useState([])
    const [alunosFiltrados, setAlunosFiltrados] = useState([])
    const [treinos, setTreinos] = useState([])
    const [showAutoComplete, setShowAutoComplete] = useState(false)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            const usuario = await getObject('@user')
            if (usuario !== undefined) {
                const clientes = await retornaListaTreinosPorPersonal(usuario.id)
                setAlunos(clientes.alunos || [])
                setTreinos(clientes.dados || [])
            }
        })
        return unsubscribe
    }, [navigation])

    const onChangeSearch = (query) => {
        setSearchQuery(query)
        if (query.length > 0) {
            const filtrados = alunos.filter(aluno => {
                if (!aluno || !aluno.nome_cliente) {
                    console.log('Aluno inválido:', aluno)
                    return false
                }

                return aluno.nome_cliente.toLowerCase().includes(query.toLowerCase())
            })
            setAlunosFiltrados(filtrados)
            setShowAutoComplete(true)
        } else {
            setAlunosFiltrados([])
            setShowAutoComplete(false)
        }
    }

    const handleSelecionarAluno = (aluno) => {
        setSearchQuery('')
        setShowAutoComplete(false)
        navigation.navigate('TreinosAlunos', { aluno })
    }

    return (
        <SafeAreaView style={[styles.safeContainer, { width: '100%' }]}>
            <View style={styles.wrapperAvatar}>
                <Text style={[styles.textoLabel, { color: '#FFF' }]}>Lista de Treinos</Text>
            </View>

            <View style={{ padding: 20, backgroundColor: 'transparent', width: '100%' }}>
                <Searchbar
                    placeholder="Buscar aluno..."
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    style={{ elevation: 2 }}
                />

                {showAutoComplete && (
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 4,
                        marginTop: 5,
                        elevation: 3,
                        maxHeight: 200,
                        position: 'absolute',
                        top: 70,
                        left: 20,
                        right: 20,
                        zIndex: 1000
                    }}>
                        <ScrollView>
                            {alunosFiltrados.map((aluno, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={{
                                        padding: 15,
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#eee'
                                    }}
                                    onPress={() => handleSelecionarAluno(aluno)}
                                >
                                    <Text>{aluno.nome_aluno}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}
            </View>

            <ScrollView style={{ flex: 1, width: '100%' }}>
                <View style={{ padding: '5%'}}>
                    {treinos.map((treino, index) => (
                        <View key={index} style={{
                            width: '100%',
                            flexDirection: 'row',
                            backgroundColor: '#FFF',
                            borderRadius: 30,
                            padding: 10,
                            marginBottom: 10,
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
                                    uri: treino.avatar ?
                                        config.site_url + '/public/images/avatar/' + treino.avatar_aluno :
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
                                    marginBottom: 0,
                                    color: '#333'
                                }]}>
                                    {treino.nome_aluno || 'Nome não disponível'}
                                </Text>

                                <Text style={[styles.textoRegular, {
                                    fontSize: 14,
                                    color: '#666',
                                    marginBottom: 0
                                }]} numberOfLines={2}>
                                    {treino.objetivo || 'Objetivo não definido'}
                                </Text>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="location" size={14} color="#666" />
                                    <Text style={[styles.textoRegular, {
                                        fontSize: 14,
                                        color: '#666',
                                        marginLeft: 5
                                    }]}>
                                        {treino.local || 'Local não definido'}
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={() => navigation.navigate('TreinosAtividadesPersonal', { treino })}
                                style={{ padding: 10 }}
                            >
                                <Ionicons name="chevron-forward" size={25} color="#666" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default TreinosListaPersonal