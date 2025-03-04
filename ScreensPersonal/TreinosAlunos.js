import React, { useState, useEffect, useContext } from "react"
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context"
import { AuthContext } from '../src/context/auth'
import styles from '../src/styles'
import config from '../src/config/index.json'
import avatarDefault from '../src/assets/avatar.png'
import moment from 'moment'
import { Ionicons } from "@expo/vector-icons"

const TreinosAlunos = ({ route, navigation }) => {

    const { getObject, retornaTreinosAluno } = useContext(AuthContext)
    const [treinos, setTreinos] = useState([])
    const [user, setUser] = useState(null)
    const [isPersonal, setIsPersonal] = useState(false)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            const usuario = await getObject('@user')
            setUser(usuario)
            setIsPersonal(usuario.groupid === 4)

            alert('treinosAlunos')

            if (usuario !== undefined) {
                const idAluno = usuario.groupid === 4 ? 
                    route.params.aluno.id_membro : 
                    usuario.id_membro

                const response = await retornaTreinosAluno(idAluno)
                
                if (usuario.groupid === 4) {
                    const treinosFiltrados = response.dados.filter(treino => 
                        treino.id_profissional === usuario.id
                    )
                    setTreinos(treinosFiltrados)
                } else {
                    setTreinos(response.dados || [])
                }
            }
        })
        return unsubscribe
    }, [navigation])

    const ListaTreinos = ({ data }) => {
        if (!data || data.length === 0) {
            return (
                <View style={styles.wrapperPersonal}>
                    <Text style={[styles.textoLabel, { color: '#666' }]}>
                        Nenhum treino encontrado
                    </Text>
                </View>
            )
        }
        
        return data.map((treino, index) => {
            const selectedImage = treino.avatar ? 
                config.site_url + '/public/images/avatar/' + treino.avatar :
                Image.resolveAssetSource(avatarDefault).uri

            return (
                <View key={index} style={styles.wrapperPersonal}>
                    <View style={styles.columnAvatar}>
                        <View style={styles.wrapperAvatarAluno}>
                            <Image source={{ uri: selectedImage }} style={styles.avatarLista} />
                        </View>
                    </View>
                    <View style={{ width: '70%', paddingLeft: 10, paddingVertical: 10 }}>
                        <Text style={[styles.textoLabel, { color: '#333' }]}>
                            {treino.nome_treino}
                        </Text>
                        
                        <View style={styles.especialidadesContainer}>
                            <Text style={[styles.textoRegular, { color: '#666', fontWeight: 'bold' }]}>
                                Personal:{' '}
                            </Text>
                            <Text style={[styles.textoRegular, {lineHeight:20, color: '#333' }]}>
                                {treino.nome_profissional}
                            </Text>
                        </View>

                        <View style={[styles.especialidadesContainer, { marginTop: 5 }]}>
                            <Text style={[styles.textoRegular, { color: '#666', fontWeight: 'bold' }]}>
                                Data:{' '}
                            </Text>
                            <Text style={[styles.textoRegular, {lineHeight:20, color: '#333' }]}>
                                {moment(treino.data_treino).format('DD/MM/YYYY')}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[styles.columnAvatar, { width: '10%' }]}
                        onPress={() => navigation.navigate('DetalhesTreino', { treino })}>
                        <Ionicons name="chevron-forward" size={25} color={'#666'} />
                    </TouchableOpacity>
                </View>
            )
        })
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={[styles.wrapperAvatar, { flexDirection: 'row',marginTop:30,marginBottom:30, }]}>
                <Text style={[styles.textoLabel, { color: '#FFF' }]}>
                    {isPersonal ? 'Treinos do Aluno' : 'Meus Treinos'}
                </Text>
                {isPersonal && (
                    <TouchableOpacity
                        style={styles.iconAdd}
                        onPress={() => navigation.navigate('AddTreinosAlunos', { aluno: route.params.aluno })}
                    >
                        <Ionicons name={'add-circle'} size={30} color="#F54" />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView style={{ width: '100%', paddingHorizontal: '5%', paddingTop: 20 }}>
                <ListaTreinos data={treinos} />
            </ScrollView>
        </SafeAreaView>
    )
}

export default TreinosAlunos 