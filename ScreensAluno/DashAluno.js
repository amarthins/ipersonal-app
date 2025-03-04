import React, { useState, useEffect, useContext } from "react"
import { View, Text, ImageBackground, Dimensions, StatusBar, BackHandler, KeyboardAvoidingView, ScrollView, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context"
import Carousel from 'react-native-reanimated-carousel'
import { AuthContext } from '../src/context/auth'
import styles from '../src/styles'
import config from '../src/config/index.json'
import { Ionicons } from "@expo/vector-icons"
import avatarDefault from '../src/assets/avatar.png'
import moment from 'moment'


const { width, height } = Dimensions.get('window')

const DashAluno = ({ route, navigation }) => {

    const { getObject, getAnuncios,signOut, getAgendaDia, checkAvatarExistence, storeObject, removeValue, getServices, formataNome, updtCadastro } = useContext(AuthContext)

    const [user, setUser] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const [anuncios, setAnuncios] = useState([])
    const [lista, setLista] = useState(null)
    const [listaAvatar, setListaAvatar] = useState(null)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            //setLoading(true)
            const usuario = await getObject('@user')
            console.log('usuario', usuario.avatar)
            if (usuario !== undefined) {
                const validAvatar = await checkAvatarExistence([{ avatar: usuario.avatar }]);
                console.log('validAvatar', config.site_url + '/public/images/avatar/' + usuario.avatar) 
                if (validAvatar[0] === true) {
                    setSelectedImage(config.site_url + '/public/images/avatar/' + usuario.avatar)
                } else {
                    setSelectedImage(Image.resolveAssetSource(avatarDefault).uri)
                }
                setUser(usuario)

                const response = await getAnuncios()
                setAnuncios(response.dados || [])

                //const currentDay = moment().format('YYYY-MM-DD')
                //const agenda = await getAgendaDia(currentDay)
                //const parsedData = agenda.dados.length > 0 ? Object.entries(agenda.dados[0]) : []
                //setLista(agenda.dados)
                //await verifica(agenda.dados)
            }
            //setLoading(false)
            setTimeout(() => {
                //setLoading(false);
            }, 1000);
        })
        return unsubscribe
    }, [navigation])

    useEffect(() => {
        const carregarAnuncios = async () => {
            try {
                const response = await getAnuncios()
                setAnuncios(response.dados || [])
            } catch (error) {
                console.error('Erro ao carregar anúncios:', error)
            }
        }
        carregarAnuncios()
    }, [])

    useEffect(() => {
        const backAction = () => {
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );
        return () => backHandler.remove();
    }, [navigation]);

    const renderCarouselItem = ({ item }) => {
        return (
            <View style={styles.wrapperCarousel}>
                <Image
                    source={{ uri: config.site_url + '/public/anuncios/' + item.link }}
                    style={styles.imageCarousel}
                    resizeMode="contain"
                />
                {/*<Text style={{
                    marginTop: 10,
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}>
                    {item.titulo}
                </Text>*/}
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar style={{}} />
            <View style={styles.wrapperAvatar}>
                <Image
                    style={styles.avatar}
                    source={{ uri: selectedImage }}
                />
                <Text style={[styles.textoLabel, { color: '#FFF' }]}>{user?.nome}</Text>
            </View>

            <View style={styles.divisionLine} />

            <ScrollView style={{ width: '100%', paddingHorizontal: '3%', paddingTop: 20, marginBottom: 20 }}>

                <TouchableOpacity
                    style={styles.blockDash}
                    onPress={() => navigation.navigate('PersonalProximo')}
                >
                    <Ionicons name={'accessibility-sharp'} size={22} style={{ marginRight: 10, color: '#F42302', }} />
                    <Text style={styles.textoLabel}>Profissionais próximos a mim</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.blockDash}
                    onPress={() => navigation.navigate('PersonalAtividade')}
                >
                    <Ionicons name={'barbell-outline'} size={22} style={{ marginRight: 10, color: '#F42302', }} />
                    <Text style={styles.textoLabel}>Profissionais por objetivos</Text>
                </TouchableOpacity>

                {anuncios.length > 0 && (
                    <View style={styles.containerCarousel}>
                        <Carousel
                            loop
                            width={width * 0.6}
                            height={250}
                            autoPlay={true}
                            data={anuncios}
                            scrollAnimationDuration={2000}
                            renderItem={renderCarouselItem}
                            mode="parallax"
                            modeConfig={{
                                parallaxScrollingScale: 0.9,
                                parallaxScrollingOffset: 40,
                            }}
                            defaultIndex={0}
                            snapEnabled={true}
                            panGestureHandlerProps={{
                                activeOffsetX: [-10, 10],
                            }}
                        />
                    </View>
                )}

            </ScrollView>

            <View style={styles.lineBottom}>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => navigation.navigate('AgendaAluno')}>
                    <Ionicons name={'calendar'} size={30} style={{ color: '#0F0', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => navigation.navigate('HistoricoAluno')}>
                    <Ionicons name={'timer'} size={30} style={{ color: '#0F0', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => { }}>
                    <Ionicons name={'home'} size={30} style={{ color: '#888', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => navigation.navigate('AccountAluno')}>
                    <Ionicons name={'person'} size={30} style={{ color: '#0F0', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => signOut()}>
                    <Ionicons name={'power'} size={30} style={{ color: '#F00', }} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default DashAluno