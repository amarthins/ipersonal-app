import React, { useState, useEffect, useContext, useRef } from "react"
import { View, Text, Modal, ImageBackground, StatusBar, KeyboardAvoidingView, ScrollView, Image, TouchableOpacity } from 'react-native'
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
import * as DocumentPicker from 'expo-document-picker';

const VideoAddScreen = ({ route, navigation }) => {

  const { salvaLinkArquivo,getObject } = useContext(AuthContext)

  const [user, setUser] = useState(null)
  const [videoLink, setVideoLink] = useState(null)
  const [descricao, setDescricao] = useState(null)
  const [nome, setNome] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
        try {
            const userData = await getObject('@user');
            if (userData) {
                setUser(userData)
            }
        } catch (error) {
            console.error('Failed to load user data from storage:', error);
        }
        setTimeout(() => {
        }, 1000);
    })
    return unsubscribe
}, [navigation])

  const handleSelectVideo = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    alert(result.uri);
    console.log(result);
  };

  const handleSaveVideo = async () => {
    if (videoLink === null || videoLink === ''||nome===''||nome===null) {
      alert('O nome e o link são obrigatórios')
      return
    }
    const salvaLink = await salvaLinkArquivo(nome,descricao,videoLink)
    if (salvaLink.status === 200) {
      navigation.goBack()
    } else {
      alert('Falha ao salvar o link')
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>

      <View style={styles.wrapperContent}>
        <ScrollView style={{ width: '100%' }}>
          <Text style={[styles.textoHeader, { textAlign: 'center', marginBottom: 20, color: '#FFF' }]}>Adiciona Vídeos e Aulas</Text>

          <TextInput
            label="Nome do vídeo"
            mode="flat"
            style={[styles.inputFlat, { marginBottom: 20 }]}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            onChangeText={(text) => setNome(text)}
            value={nome}
            keyboardType="default"
          />

          <TextInput
            label="Descrição do vídeo"
            mode="flat"
            style={styles.inputFlatMulti}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            onChangeText={(text) => setDescricao(text)}
            value={descricao}
            multiline
            numberOfLines={4}
            keyboardType="default"
          />

          <View style={styles.linha}>
            <View style={{ width: 30 }}>
              <Ionicons name={'link'} size={22} color="#BDFF00" />
            </View>
            <Text style={[styles.textoRegular, { color: '#FFF', lineHeight: 50 }]}>Inserir link de vídeo</Text>
          </View>
          <TextInput
            label="Link do vídeo"
            mode="flat"
            style={[styles.inputFlat, { marginBottom: 20 }]}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            onChangeText={(text) => setVideoLink(text)}
            value={videoLink}
            keyboardType="default"
          />
          <TouchableOpacity
            style={[styles.btnStandard, { marginBottom: 10 }]}
            onPress={handleSaveVideo}>
            <Text style={styles.textoBtn}>Salvar Link</Text>
          </TouchableOpacity>


          <Text style={[styles.textoLabel, { color: '#FFF', lineHeight: 50, textAlign: 'center' }]}>ou</Text>
          <View style={[styles.linha, { marginTop: 10 }]}>
            <View style={{ width: 30 }}>
              <Ionicons name={'videocam-sharp'} size={22} color="#BDFF00" />
            </View>
            <Text style={[styles.textoRegular, { color: '#FFF', lineHeight: 50 }]}>Selecionar um vídeo</Text>

            <TouchableOpacity
              style={[styles.button, { position: 'absolute', right: 0 }]}
              onPress={handleSelectVideo}>
              <Ionicons name={'folder-open-sharp'} size={22} color="#F00" />
            </TouchableOpacity>
          </View>




          {/*<Text style={styles.title}>Adicionar Vídeo</Text>
          <TextInput
            style={styles.input}
            placeholder="Insira o link do vídeo"
            value={videoLink}
            onChangeText={(text) => setVideoLink(text)}
          />
          <TouchableOpacity style={styles.button} onPress={handleSelectVideo}>
            <Text>Selecionar Vídeo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSaveVideo}>
            <Text>Salvar Vídeo</Text>
          </TouchableOpacity>*/}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
export default VideoAddScreen;