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
import * as Localization from 'expo-localization'
import { i18n } from 'expo-localization';
import * as Location from 'expo-location';

let { width, height } = Dimensions.get("window");

const PersonalProximo = ({ route, navigation }) => {

    const { getObject, getPersonalProximo, getCep, getAgendaDia, checkFile, storeObject, removeValue, getServices, formataNome, updtCadastro } = useContext(AuthContext)

    const [cep, setCep] = useState('')
    const [profissionais, setProfissionais] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const [hasLocationPermission, setHasLocationPermission] = useState(false);

    useEffect(() => {
        const requestLocationPermission = async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                setHasLocationPermission(status === 'granted');
                
                if (status !== 'granted') {
                    alert('Precisamos da permissão de localização para buscar profissionais próximos.');
                }
            } catch (error) {
                console.error('Erro ao solicitar permissão de localização:', error);
                alert('Não foi possível obter permissão de localização.');
            }
        };
        requestLocationPermission();
    }, []);

    const buscarPorProximidade = async () => {
        try {
            setIsLoading(true);
            
            if (!hasLocationPermission) {
                alert('Sem permissão de localização. Por favor, habilite nas configurações.');
                return;
            }
            let location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
                timeInterval: 5000,
                distanceInterval: 0,
                mayShowUserSettingsDialog: true
            });
            const pesquisa = await getPersonalProximo(location.coords.latitude, location.coords.longitude)
            if (pesquisa && pesquisa.profissionais) {
                setProfissionais(pesquisa.profissionais)
            } else {
                console.error('Resposta inválida da API:', pesquisa)
                throw new Error('Resposta inválida da API')
            }

        } catch (error) {
            console.error('Erro detalhado:', error);
            if (error.message === 'Resposta inválida da API') {
                alert('Erro ao buscar profissionais. Por favor, tente novamente.');
            } else {
                alert('Não foi possível obter sua localização atual.');
            }
        } finally {
            setIsLoading(false);
        }
    }

    const buscarPorCep = async () => {
        try {
            if (!cep || cep.length < 8) {
                alert('Por favor, insira um CEP válido');
                return;
            }
            setIsLoading(true);
            const cepLimpo = cep.replace(/\D/g, '');
            
            const dadosCep = await getCep(cepLimpo);

            if (dadosCep.erro) {
                alert('CEP não encontrado');
                return;
            }
            const endereco = `${dadosCep.logradouro}, ${dadosCep.localidade}, ${dadosCep.uf}, Brasil`;
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`);
            const data = await response.json();

            if (data && data.length > 0) {
                const location = {
                    latitude: parseFloat(data[0].lat),
                    longitude: parseFloat(data[0].lon)
                };
                const pesquisa = await getPersonalProximo(location.latitude, location.longitude);
                console.log('Pesquisa:', pesquisa)
                if (pesquisa && pesquisa.profissionais) {
                    //setProfissionais(pesquisa.profissionais);
                } else {
                    throw new Error('Resposta inválida da API');
                }
            } else {
                throw new Error('Não foi possível encontrar a localização para este CEP');
            }

        } catch (error) {
            console.error('Erro ao buscar por CEP:', error);
            alert('Erro ao buscar localização pelo CEP. Por favor, tente novamente.');
        } finally {
            setIsLoading(false);
        }
    }

    const ListaProfissionais = ({ data }) => {
        if (!data) {
            return null;
        }
        return data.map((prof, index) => {
            const selectedImage = prof.avatar === null ?
                Image.resolveAssetSource(avatarDefault).uri :
                config.site_url + '/public/images/avatar/' + prof.avatar

            return (
                <View key={index} style={styles.wrapperPersonal}>
                    <View style={styles.columnAvatar}>
                        <View style={styles.wrapperAvatarAluno}>
                            <Image source={{ uri: selectedImage }} style={styles.avatarLista} />
                        </View>
                    </View>
                    <View style={{ width: '70%', paddingLeft: 10, paddingVertical: 10 }}>
                        <Text style={[styles.textoLabel, { color: '#333' }]}>{prof.nome}</Text>
                        
                        {/* Especialidades */}
                        <View style={styles.especialidadesContainer}>
                            <Text style={[styles.textoRegular, { color: '#666', fontWeight: 'bold' }]}>
                                Especialidades:{' '}
                            </Text>
                            {prof.especialidades.map((esp, idx) => (
                                <Text key={idx} style={[styles.textoRegular, {lineHeight:20, color: '#333' }]}>
                                    {esp.nome}{idx < prof.especialidades.length - 1 ? ', ' : ''}
                                </Text>
                            ))}
                        </View>

                        {/* Locais */}
                        {prof.locais && prof.locais.length > 0 && (
                            <View style={[styles.especialidadesContainer, { marginTop: 5 }]}>
                                <Text style={[styles.textoRegular, { color: '#666', fontWeight: 'bold' }]}>
                                    Locais:{' '}
                                </Text>
                                {prof.locais.map((local, idx) => (
                                    <Text key={idx} style={[styles.textoRegular, {lineHeight:20, color: '#333' }]}>
                                        {local.nome}{idx < prof.locais.length - 1 ? ', ' : ''}
                                    </Text>
                                ))}
                            </View>
                        )}
                    </View>
                    <TouchableOpacity
                        style={[styles.columnAvatar, { width: '10%' }]}
                        onPress={() => handleSelecionarProfissional(prof)}>
                        <Ionicons name="add-circle" size={25} color={'#0F0'} />
                    </TouchableOpacity>
                </View>
            );
        });
    }

    const handleSelecionarProfissional = async (profissional) => {
        await storeObject('@profissional', profissional)
        navigation.navigate('AtividadeChoice')
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar style={{}} />
            <View style={styles.wrapperAvatar}>
                <Text style={[styles.textoLabel, { color: '#FFF' }]}>Pesquisar Profissionais</Text>
            </View>

            <View style={styles.containerBotoes}>
                <TouchableOpacity
                    style={styles.botaoProximidade}
                    onPress={buscarPorProximidade}>
                    <Text style={styles.textoBotao}>Pesquisa por proximidade</Text>
                </TouchableOpacity>

                <Text style={[styles.textoLabel, { marginHorizontal: 10 }]}>ou</Text>

                <View style={styles.containerCep}>
                    <TextInput
                        style={styles.inputCep}
                        placeholder="CEP..."
                        value={cep}
                        onChangeText={(text) => setCep(mask(text, ['99999-999']))}
                        keyboardType="numeric"
                        maxLength={9}
                        backgroundColor="#FFF"
                    />
                    <TouchableOpacity
                        style={styles.botaoPesquisa}
                        onPress={buscarPorCep}>
                        <Ionicons name="search" size={24} color="#007AFF" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={{ paddingHorizontal: '5%' }}>
                {profissionais && <ListaProfissionais data={profissionais} />}
            </ScrollView>
        </SafeAreaView>
    )
}
export default PersonalProximo