import React, { useState, useEffect, useContext, useRef } from "react"
import { View, Text, FlatList, StyleSheet, Modal, ImageBackground, StatusBar, KeyboardAvoidingView, ScrollView, Image, TouchableOpacity } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import { ptBr } from '../src/utils/localeCalendarConfig'
import { SafeAreaView } from "react-native-safe-area-context"
import config from '../src/config/index.json'
import { TextInput } from 'react-native-paper'
import styles from '../src/styles';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { AuthContext } from '../src/context/auth'
import { unMask, mask } from 'remask'
import validate from 'validate.js'
import backgroundImage from '../src/assets/personal-aluna.png'
import { FlashList } from '@shopify/flash-list'

const VideosScreen = ({ route, navigation }) => {

    const { getListaArquivos, getObject } = useContext(AuthContext)


    const [user, setUser] = useState(null)
    const [videos, setVideos] = useState([])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            try {
                const userData = await getObject('@user');
                if (userData) {
                    const videosData = await getListaArquivos(userData.id)
                    console.log('videos', videosData.dados)
                    setUser(userData)
                    setVideos(videosData.dados);
                }
            } catch (error) {
                console.error('Failed to load user data from storage:', error);
            }
            setTimeout(() => {
            }, 1000);
        })
        return unsubscribe
    }, [navigation])


    const handleAddVideo = () => {
        navigation.navigate('VideoAddScreen'); // Navega para a tela de adicionar vídeo
    };

    const renderItem = ({ item }) => {
        return (
            <>
                <TouchableOpacity
                    style={styles.linha}
                >
                    <View style={[styles.linhaItem, {}]}>
                        <Text style={styles.textoRegular}>Nome: {item.nome}</Text>
                        <Text style={styles.textoRegular}>Descrição: {item.descricao}</Text>
                        <Text style={styles.textoRegular}>Link: {item.link}</Text>
                    </View>
                </TouchableOpacity >
                <View style={styles.divisionLine} />
            </>
        );
    };

    return (
        <SafeAreaView style={styles.safeContainer}>

            <View style={styles.wrapperContent}>
                <View style={[styles.linha, { width: '100%' }]}>
                    <Text style={[styles.textoHeader, { color: '#FFF' }]}>Tela de Vídeos e Aulas</Text>
                    <TouchableOpacity
                        style={[styles.iconAdd, { position: 'absolute', right: 10 }]}
                        onPress={handleAddVideo}
                    >
                        <Ionicons name={'add-circle'} size={30} color="#F54" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.wrapperContent}>
                <FlatList
                    data={videos}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            </View>

        </SafeAreaView>
    );
}
export default VideosScreen
