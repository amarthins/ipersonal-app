import React, { useState, useEffect, useContext, useRef } from "react"
import { View, Text, FlatList, ImageBackground, StatusBar, KeyboardAvoidingView, ScrollView, Image, TouchableOpacity } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import { ptBr } from '../src/utils/localeCalendarConfig'
import { SafeAreaView } from "react-native-safe-area-context"
import config from '../src/config/index.json'
import { TextInput, List, Portal, Modal, Button } from 'react-native-paper'
import styles from '../src/styles';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { AuthContext } from '../src/context/auth'
import { unMask, mask } from 'remask'
import validate from 'validate.js'
import backgroundImage from '../src/assets/personal-aluna.png'
import { FlashList } from '@shopify/flash-list'
//import AutocompleteInput from '../src/components/AutocompleteInput'
import AutocompleteInput from 'react-native-autocomplete-input'
import ModalComponent from '../src/components/ModalComponent'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';


const EditSettings = ({ route, navigation }) => {

    const { getObject, getCep, getDadosDisponiveis, getServicosDisponiveis, signOut, saveSettings, getSettings, storeObject, removeValue, getServices, formataNome, updtCadastro } = useContext(AuthContext)

    const { opcao } = route.params
    const [showLocais, setShowLocais] = useState(false)
    const [showServicos, setShowServicos] = useState(false)
    const [showArea, setShowArea] = useState(false)
    const [showAreaCep, setShowAreaCep] = useState(false)
    const [showGrade, setShowGrade] = useState(false)

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocalidade, setSelectedLocalidade] = useState('');
    const [selectedServico, setSelectedServico] = useState('');
    const [dadosArea, setDadosArea] = useState(null)
    const [title, setTitle] = useState(null)
    const [visible, setVisible] = useState(false);
    const [titleModal, setTitleModal] = useState(null)
    const [contentModal, setContentModal] = useState(null)

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSuggestions, setSelectedSuggestions] = useState([]);

    const [servicosQuery, setServicosQuery] = useState('');
    const [servicosSuggestions, setServicosSuggestions] = useState([]);
    const [showServicosSuggestions, setShowServicosSuggestions] = useState(false);
    const [selectedServicosSuggestions, setSelectedServicosSuggestions] = useState([]);

    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {

            const dados = await getDadosDisponiveis()

            setSelectedLocalidade(dados.locais)
            setSelectedServico(dados.servicos)
            setDadosArea(dados.localizacao)

            if (opcao === 'locais') {
                setTitle('Configuração de Locais')
                setShowLocais(true)
            } else if (opcao === 'servicos') {
                setTitle('Serviços Oferecidos')
                setShowServicos(true)
            } else if (opcao === 'area') {
                setTitle('Área de Atendimento')
                setDadosArea(dados.localizacao)
                setShowArea(true)
            } else if (opcao === 'grade') {
                setShowGrade(true)
                setShowGrade(true)
            }
            setTimeout(() => {
            }, 1000);
        })
        return unsubscribe
    }, [navigation])

    /*useEffect(() => {
        const getCurrentLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setContentModal('Permissão de localização negada');
                    setTitleModal('Erro');
                    setVisible(true);
                    return;
                }

                const location = await Location.getCurrentPositionAsync({});
                setUserLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
            } catch (error) {
                console.error(error);
            }
        };

        getCurrentLocation();
    }, []);*/

    const closeModal = () => {
        setVisible(false)
    }


    const handleQueryChange = (text) => {
        setQuery(text);
        const filteredData = selectedLocalidade.filter((item) => item.nome.toLowerCase().includes(text.toLowerCase()));
        setSuggestions(filteredData);
        setShowSuggestions(true);
    };
    const handleSuggestionPress = (item) => {
        setQuery(item.nome);
        setShowSuggestions(false);
        setSelectedSuggestions((prevSuggestions) => [...prevSuggestions, item]);
    };
    const SelectedSuggestionsView = () => {
        return (
            <>
                <View style={{ marginTop: 10 }}>
                    {selectedSuggestions.map((suggestion, index) => (
                        <Text style={styles.textoRegular} key={index}>{suggestion.nome}</Text>
                    ))}
                </View>

                {selectedSuggestions.length > 0 &&
                    <>
                        <View style={styles.divisionLine} />
                        <TouchableOpacity
                            style={styles.btnStandard}
                            onPress={() => handleSave(selectedSuggestions, 'locais')}
                        >
                            <Text style={styles.textoInput}>Salvar</Text>
                        </TouchableOpacity></>}
            </>
        );
    };

    const handleServicosQueryChange = (text) => {
        setServicosQuery(text);
        const filteredData = selectedServico.filter((item) => item.nome.toLowerCase().includes(text.toLowerCase()));
        setServicosSuggestions(filteredData);
        setShowServicosSuggestions(true);
    };
    const handleServicosSuggestionPress = (item) => {
        setServicosQuery(item.nome);
        setShowServicosSuggestions(false);
        setSelectedServicosSuggestions((prevServicosSuggestions) => [...prevServicosSuggestions, item]);
    };
    const SelectedServicosSuggestionsView = () => {
        return (
            <>
                <View style={{ marginTop: 10 }}>
                    {selectedServicosSuggestions.map((suggestion, index) => (
                        <>
                            <Text style={styles.textoRegular} key={index}>{suggestion.nome}</Text>
                            <TextInput
                                value={suggestion.valor}
                                onChangeText={(text) => handleChangeValue(suggestion, text)}
                                placeholder="Defina o valor"
                                style={styles.inputAutocomplete}
                                keyboardType="number-pad"
                            />
                        </>

                    ))}
                </View>

                {selectedServicosSuggestions.length > 0 &&
                    <>
                        <View style={styles.divisionLine} />
                        <TouchableOpacity
                            style={styles.btnStandard}
                            onPress={() => handleSave(selectedServicosSuggestions, 'servicos')}
                        >
                            <Text style={styles.textoInput}>Salvar</Text>
                        </TouchableOpacity></>}
            </>
        );
    };
    const handleChangeValue = (suggestion, text) => {
        const cleanedText = text.replace(/[^\d,]/g, '');
        const formattedText = cleanedText.replace('.', '');
        const valor = formattedText.replace('.', ','); // replace commas with points for internal storage
        const updatedSuggestion = { ...suggestion, valor };
        const updatedSelectedServicosSuggestions = selectedServicosSuggestions.map((item) =>
            item.id === suggestion.id ? updatedSuggestion : item
        );
        setSelectedServicosSuggestions(updatedSelectedServicosSuggestions)
    };

    const onChangeField = async (indice, valor) => {

        if (indice === 'cep') {
            const originalEnderecoCep = unMask(valor)
            const maskedEnderecoCep = mask(originalEnderecoCep, ['99.999-999'])
            if (originalEnderecoCep.length == 8) {
                const dadosAddress = await getCep(originalEnderecoCep)

                if (dadosAddress?.erro) {
                    setContentModal('Digite um cep válido')
                    setTitleModal('Falha ao pesquisar o CEP')
                    setVisible(true)
                    setTimeout(() => {
                        setVisible(false)
                    }, 10000);
                    return
                }

                const updatedFields = {
                    cep: valor,
                    maskedCep: maskedEnderecoCep,
                    bairro: dadosAddress.bairro,
                    cidade: dadosAddress.localidade,
                    estado: dadosAddress.uf
                }
                setDadosArea({ ...dadosArea, ...updatedFields });
                setShowAreaCep(true)
            }
        }
    }

    const handleSave = async (valores, tipo) => {
        const salvar = await saveSettings(valores, tipo)

        if (salvar.status === 200) {
            navigation.navigate('SettingsPersonal')
            return
        }
        alert('error')
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.wrapperContent}>
                <ModalComponent visible={visible} closeModal={closeModal} title={titleModal} content={contentModal} />
                {/*<View style={{ width: '100%', backgroundColor: '#FCA' }}>
                    <GooglePlacesAutocomplete
                        placeholder='Pesquise por academias próximas...'
                        onPress={(data, details = null) => {
                            console.log(data, details);
                        }}
                        query={{
                            key: config.googleApi,
                            language: 'pt-BR',
                            types: 'gym',
                            location: userLocation ? `${userLocation.latitude},${userLocation.longitude}` : '',
                            radius: 5000,
                            strictbounds: true,
                        }}
                        fetchDetails={true}
                        enablePoweredByContainer={false}
                        styles={{
                            container: {
                                flex: 0,
                            },
                            textInput: {
                                height: 45,
                                borderWidth: 1,
                                borderColor: '#ddd',
                                borderRadius: 5,
                                paddingHorizontal: 10,
                            }
                        }}
                    />
                </View>*/}

                <View style={{ width: '100%', paddingBottom: 40 }}>
                    <Text style={[styles.textoLabel, { marginBottom: 20 }]}>{title}</Text>

                    {showLocais && <TextInput
                        value={query}
                        onChangeText={handleQueryChange}
                        placeholder="Selecione uma localidade.."
                        style={styles.inputAutocomplete}
                    />}
                    {showSuggestions && (
                        <FlatList
                            data={suggestions}
                            renderItem={({ item }) => (
                                <Text style={styles.textoFlat} onPress={() => handleSuggestionPress(item)}>{item.nome}</Text>
                            )}
                            keyExtractor={(item) => item.id.toString()}
                            style={styles.autoCompleteSuggestions}
                        />
                    )}
                    <SelectedSuggestionsView />

                    {showServicos && <TextInput
                        value={servicosQuery}
                        onChangeText={handleServicosQueryChange}
                        placeholder="Selecione um serviço.."
                        style={styles.inputAutocomplete}
                    />}
                    {showServicosSuggestions && (
                        <FlatList
                            data={servicosSuggestions}
                            renderItem={({ item }) => (
                                <Text style={styles.textoFlat} onPress={() => handleServicosSuggestionPress(item)}>{item.nome}</Text>
                            )}
                            keyExtractor={(item) => item.id.toString()}
                            style={styles.autoCompleteSuggestions}
                        />
                    )}
                    <SelectedServicosSuggestionsView />

                    {showArea &&
                        <View>
                            <Text style={styles.textoRegular}>Digite o CEP</Text>
                            <TextInput
                                label=""
                                placeholder="CEP"
                                autoCorrect={false}
                                mode="outlined"
                                style={styles.inputLoginPaper}
                                value={dadosArea?.maskedCep}
                                onChangeText={(text) => onChangeField('cep', text)}
                                keyboardType="number-pad"
                            />
                            {showAreaCep && <>
                                <Text style={styles.textoRegular}>Bairro: {dadosArea.bairro}</Text>
                                <Text style={styles.textoRegular}>Cidade: {dadosArea.cidade}</Text>
                                <Text style={styles.textoRegular}>Estado: {dadosArea.estado}</Text>

                                <View style={styles.divisionLine} />
                                <TouchableOpacity
                                    style={[styles.btnStandard, { marginTop: 10, marginBottom: 20 }]}
                                    onPress={() => handleSave(dadosArea, 'area')}
                                >
                                    <Text style={styles.textoInput}>Salvar</Text>
                                </TouchableOpacity></>}
                        </View>}
                    {showGrade &&
                        <View>
                            <Text style={styles.textoRegular}>Grade de Horários Semanal</Text>
                        </View>}
                </View>
            </View>

            <View style={styles.lineBottom}>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => navigation.navigate('AgendaPersonal')}>
                    <Ionicons name={'calendar'} size={30} style={{ color: '#0F0', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => { }}>
                    <Ionicons name={'settings'} size={30} style={{ color: '#888', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => navigation.navigate('DashPersonal')}>
                    <Ionicons name={'home'} size={30} style={{ color: '#F54', }} />
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
        </SafeAreaView >
    )
}
export default EditSettings