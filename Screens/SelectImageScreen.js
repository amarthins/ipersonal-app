import React, { useState, useEffect, useContext } from 'react'
import { Text, View, SafeAreaView, Modal, ImageBackground, TouchableOpacity, StatusBar, ScrollView, ActivityIndicator, BackHandler, Keyboard, Image, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import styles from '../src/styles'
import config from '../src/config'
import * as Animatable from 'react-native-animatable'
import { AuthContext } from '../src/context/auth'
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons"
import { TextInput, Dialog, Portal, Button, Avatar, RadioButton, List } from 'react-native-paper'
import moment from 'moment'
import { FlashList } from '@shopify/flash-list'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import * as DocumentPicker from 'expo-document-picker'

const SelectImageScreen = ({ route, navigation }) => {

    const { getObject, removeValue } = useContext(AuthContext)

    const [loading, setLoading] = useState(true)
    const [documents, setDocuments] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {

            let values = null
            const foto = await getObject('@avatar')
            //await removeValue('@avatar')

            console.log('FOTO ', foto)

            if (foto !== null) {

                //values.push(foto.uri)
                setDocuments(foto.uri)
            }

            setTimeout(() => {
                //setLoading(false);
            }, 1000);
        })
        return unsubscribe
    }, [navigation])

    const pickFile = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: '*/*', // Todos os tipos de arquivos
            copyToCacheDirectory: true // Copia o arquivo para o diretório de cache do app (opcional)
        })

        if (!result.canceled) {
            if (isValidFileType(result.assets[0].uri)) {
                let values = []
                const valores = await getObject('@docsConsultas')

                if (valores !== null) {
                    valores.map(el => {
                        if (el !== result.assets[0].uri) {
                            values.push(el)
                        }
                    })
                }
                values.push(result.assets[0].uri)
                setDocuments(values)
                await storeObject('@docsConsultas', values)
                console.log('Arquivo selecionado:', result.assets[0].uri)
                setRefresh(prevState => !prevState);
            } else {
                alert('Por favor, selecione apenas um arquivo de imagem ou PDF.');
            }
        }
    }

    const isValidFileType = (uri) => {
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx']
        const uriLower = uri.toLowerCase();

        return allowedExtensions.some(ext => uriLower.endsWith(ext))
    }

    const isLocal = (uri) => {
        return /file:\/\/\//i.test(uri);
    }

    const takePhoto = async () => {
        navigation.navigate("CameraScreen", { referencia: 'SelectImageScreen' });
    }

    const handleViewer = (file, extensao) => {
        setImageUrl(isLocal(file) ? file : config.dir_fotos + file)
        setIsModalVisible(true)
    }

    const handleDelete = async () => {

        if (isLocal(documents)) {
            try {
                setImageUrl(documents)
                setRefresh(prevState => !prevState);
                return true
            } catch (error) {
                alert('falha ao deletar a imagem')
                console.error('Erro ao deletar o arquivo:', error);
                return false
            }
        }
        /*
                if (idItem !== null) {
                    setImageUrl(isLocal(item) ? item : item)
                    const response = await deleteItemImagem(idItem, item, idPet, 'deleta_imagem_consultas');
        
                    if (response.status === 200) {
                        setRefresh(prevState => !prevState);
                        return
                    }
                    setLoading(false)
                    setMsgError('Falha ao deletar o item')
                }
                */
    }


    return (
        <SafeAreaView style={styles.containerScreen}>
            <StatusBar
                animated={true}
                backgroundColor="#198AD3"
            />
            <View style={styles.wrapperList}>

                <View style={[styles.lineTitle, { minHeight: 160 }]}>
                    <Text style={[styles.textoHeader, { textAlign: 'center' }]}>Selecione um arquivo{'\n'}ou tire uma foto</Text>
                </View>

                <View style={[styles.lineTitle, { minHeight: 80, justifyContent: 'space-between', borderBottomWidth: 1, }]}>
                    <TouchableOpacity
                        style={styles.btnFiles}
                        onPress={() => takePhoto()}>
                        {/*<Text>Nova{'\n'}Foto</Text>*/}
                        <Ionicons name="camera" size={32} color="orange"></Ionicons>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.btnFiles}
                        onPress={pickFile}>
                        <Ionicons name="document-attach-sharp" size={32} color="#FF5400"></Ionicons>
                    </TouchableOpacity>
                </View>

                {documents &&
                    <View style={styles.lineFiles}>
                        <TouchableOpacity
                        //onPress={() => handleViewer()}
                        >
                            <Image
                                source={{ uri: isLocal(documents) ? documents : config.dir_fotos + documents }}
                                style={{ width: 60, height: 60 }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleDelete()}>
                            <Ionicons name="trash" size={25} color="#FF0000" />
                        </TouchableOpacity>
                    </View>}

                <View>
                    <TouchableOpacity
                        style={styles.btnStandard}
                        onPress={() => navigation.navigate('PendingScreen')} >
                        <Text>Retornar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}
export default SelectImageScreen