import React, { useState, useEffect, useContext, useRef } from "react"
import { View, Text, ImageBackground, StatusBar, KeyboardAvoidingView, ScrollView, Image, TouchableOpacity } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import { ptBr } from '../src/utils/localeCalendarConfig'
import { SafeAreaView } from "react-native-safe-area-context"
import config from '../src/config/index.json'
import { TextInput } from 'react-native-paper'
import styles from '../src/styles';
import { Ionicons } from "@expo/vector-icons"
import { AuthContext } from '../src/context/auth'
import { unMask, mask } from 'remask'
import validate from 'validate.js'
import backgroundImage from '../src/assets/personal-aluna.png'

const SettingsPersonal = ({ route, navigation }) => {

    const { getObject, signOut, storeObject, removeValue, getServices, formataNome, updtCadastro } = useContext(AuthContext)

    const [user, setUser] = useState({
        name: '',
        cpf: '',
        email: '',
        avatar: null
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getObject('@user');
                if (userData) {
                    setUser(userData)
                }
            } catch (error) {
                console.error('Failed to load user data from storage:', error);
            }
        };

        fetchData();
    }, []);

    const handleChange = (key, value) => {
        setUser({ ...user, [key]: value });
    };

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setUser({ ...user, avatar: result.assets[0].uri });
        }
    };

    const handleSave = async () => {
        try {
            await AsyncStorage.setItem('@user', JSON.stringify(user));
            alert('User data saved successfully!');
        } catch (error) {
            console.error('Failed to save user data:', error);
        }
    };

    return (
        <SafeAreaView style={styles.safeContainer}>

            <View style={styles.wrapperContent}>
                <ScrollView style={{ width: '100%' }}>
                    <Text style={[styles.textoHeader, { textAlign: 'center', marginBottom: 20, color: '#FFF' }]}>Configurações</Text>

                    <Text style={[styles.textoRegular, { color: '#FFF', lineHeight: 50 }]}>Locais Atendidos</Text>

                    <View style={styles.divisionLine} />


                    <Text style={[styles.textoRegular, { color: '#FFF', lineHeight: 50 }]}>Serviços Oferecidos</Text>

                    <View style={styles.divisionLine} />

                    <Text style={[styles.textoRegular, { color: '#FFF', lineHeight: 50 }]}>Área de Atendimento</Text>

                    <View style={styles.divisionLine} />

                    <Text style={[styles.textoRegular, { color: '#FFF', lineHeight: 50 }]}>Área de Atendimento</Text>
                    <Text style={[styles.textoRegular, { color: '#FFF' }]}>Digite seu CEP</Text>

                    <View style={styles.divisionLine} />

                    <TouchableOpacity
                        style={[styles.btnStandard, { marginBottom: 10 }]}
                        onPress={handleSave}>
                        <Text style={styles.textoBtn}>Salvar</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View >

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



            {/*<ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Editar Perfil</Text>
            <TextInput
                label="Nome"
                mode="flat"
                style={styles.inputFlat}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                onChangeText={(text) => handleChange('name', text)}
                value={user.name}
            />
            <TextInput
                label="CPF"
                mode="flat"
                style={styles.inputFlat}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                onChangeText={(text) => handleChange('cpf', text)}
                value={user.cpf}
                keyboardType="number-pad"
            />
            <TextInput
                label="E-mail"
                mode="flat"
                style={styles.inputFlat}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                onChangeText={(text) => handleChange('email', text)}
                value={user.email}
                keyboardType="email-address"
            />
            <View style={styles.avatarContainer}>
                {user.avatar ? (
                    <Image source={{ uri: user.avatar }} style={styles.avatar} />
                ) : (
                    <Text>No Avatar</Text>
                )}
                <TouchableOpacity
                    style={[styles.btnStandard, { marginBottom: 10 }]}
                    onPress={handleImagePick}>
                    <Text style={styles.textoBtn}>Upload Nova Imagem</Text>
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity
                style={[styles.btnStandard, { marginBottom: 10 }]}
                onPress={handleSave}>
                <Text style={styles.textoBtn}>Salvar</Text>
            </TouchableOpacity>
                </ScrollView>*/}
        </SafeAreaView >

    )
}
export default SettingsPersonal