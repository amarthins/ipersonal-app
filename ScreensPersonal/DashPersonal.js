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
import Carousel from 'react-native-reanimated-carousel'

let { width, height } = Dimensions.get("window");

const DashPersonal = ({ route, navigation }) => {

    const { getObject, checkAvatarExistence, signOut, getAgendaDiaProfissional, storeObject, removeValue, getServices, formataNome, updtCadastro, getAnuncios } = useContext(AuthContext)

    const [user, setUser] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const [lista, setLista] = useState(null)
    const [listaAvatar, setListaAvatar] = useState(null)
    const [anuncios, setAnuncios] = useState([])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            //setLoading(true)
            const usuario = await getObject('@user')
            if (usuario !== undefined) {
                setUser(usuario)
                const validAvatar = await await checkAvatarExistence([{ avatar: usuario.avatar }]);
                if (validAvatar[0] === true) {
                    setSelectedImage(config.site_url + '/public/images/avatar/' + usuario.avatar)
                } else {
                    setSelectedImage(Image.resolveAssetSource(avatarDefault).uri)
                }
                const currentDay = moment().format('YYYY-MM-DD')
                const agenda = await getAgendaDiaProfissional(currentDay)
                const parsedData = agenda.dados?.length > 0 ? Object.entries(agenda.dados[0]) : []
                setLista(agenda.dados)
                await verifica(agenda.dados)
            }
            //setLoading(false)
            setTimeout(() => {
                //setLoading(false);
            }, 1000);
        })
        return unsubscribe
    }, [navigation])

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

    const verifica = async (data) => {
        if (!data) {
            return null;
        }
        const avatars = data.map((item) => item);
        const validAvatars = await checkAvatarExistence(avatars);
        setListaAvatar(validAvatars)
        return true
    }

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
                    onPress={() => navigation.navigate('SolicitacoesPendentes')}
                >
                    <Ionicons name={'disc-outline'} size={22} style={{ marginRight: 10, color: '#F42302', }} />
                    <Text style={styles.textoLabel}>Solicitações Pendentes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.blockDash}
                    onPress={() => navigation.navigate('TreinosListaPersonal')}
                >
                    <Ionicons name={'barbell-outline'} size={22} style={{ marginRight: 10, color: '#F42302', }} />
                    <Text style={styles.textoLabel}>Lista de Treinos</Text>
                </TouchableOpacity>

                {anuncios.length > 0 && (
                    <View style={styles.containerCarousel}>
                        <Carousel
                            loop
                            width={width * 0.6}
                            height={250}
                            autoPlay={true}
                            data={anuncios}
                            scrollAnimationDuration={1000}
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
                    onPress={() => navigation.navigate('AgendaPersonal')}>
                    <Ionicons name={'calendar'} size={30} style={{ color: '#0F0', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => navigation.navigate('SettingsPersonal')}>
                    <Ionicons name={'settings'} size={30} style={{ color: '#0F0', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => { }}>
                    <Ionicons name={'home'} size={30} style={{ color: '#888', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => navigation.navigate('AccountPersonal')}>
                    <Ionicons name={'person'} size={30} style={{ color: '#0F0', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => signOut()}>
                    <Ionicons name={'power'} size={30} style={{ color: '#F00', }} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default DashPersonal