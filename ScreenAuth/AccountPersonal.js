import React, { useState, useEffect, useContext, useRef } from "react"
import { View, Text, ImageBackground, StatusBar, KeyboardAvoidingView, ScrollView, Image, TouchableOpacity } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { SafeAreaView } from "react-native-safe-area-context"
import { TextInput } from 'react-native-paper'
import styles from '../src/styles';
import { Ionicons } from "@expo/vector-icons"
import { AuthContext } from '../src/context/auth'
import config from '../src/config/index.json'
import { unMask, mask } from 'remask'
import validate from 'validate.js'

const AccountPersonal = ({ route, navigation }) => {

    const { getObject, storeObject,signOut } = useContext(AuthContext)

    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getObject('@user');
                console.log('userData',userData )
                if (userData) {
                    setUser(userData)
                }
            } catch (error) {
                console.error('Failed to load user data from storage:', error);
            }
        }
        fetchData()
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
            await storeObject('@user', user);
            alert('User data saved successfully!');
        } catch (error) {
            console.error('Failed to save user data:', error);
        }
    };

    return (
        <SafeAreaView style={styles.safeContainer}>

            <View style={styles.wrapperContent}>
                <ScrollView style={{ width: '100%' }}>
                    <Text style={[styles.textoHeader, { textAlign: 'center', marginBottom: 20,color:'#FFF' }]}>Editar Perfil</Text>
                    <TextInput
                        label="Nome"
                        mode="flat"
                        style={styles.inputFlat}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        onChangeText={(text) => handleChange('nome', text)}
                        value={user?.nome}
                    />
                    <TextInput
                        label="CPF"
                        mode="flat"
                        style={[styles.inputFlat, { marginTop: 15 }]}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        onChangeText={(text) => handleChange('cpf', text)}
                        value={user?.cpf}
                        keyboardType="number-pad"
                    />
                    <TextInput
                        label="E-mail"
                        mode="flat"
                        style={[styles.inputFlat, { marginTop: 15 }]}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        onChangeText={(text) => handleChange('email', text)}
                        value={user?.email}
                        keyboardType="email-address"
                    />
                    <TextInput
                        label="Celular"
                        mode="flat"
                        style={[styles.inputFlat, { marginTop: 15 }]}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        onChangeText={(text) => handleChange('celular', text)}
                        value={user?.celular}
                        keyboardType="default"
                    />
                    <TextInput
                        label="CEP - Localização"
                        mode="flat"
                        style={[styles.inputFlat, { marginTop: 15 }]}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        onChangeText={(text) => handleChange('localizacao', text)}
                        value={user?.localizacao}
                        keyboardType="default"
                    />
                    <View style={{
                        alignItems: 'center',
                        marginBottom: 15, marginTop: 30
                    }}>
                        {user?.avatar ? (
                            <Image source={{ uri: config.dir_fotos+user?.avatar }} style={styles.avatar} />
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
                </ScrollView>
            </View>

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
                    onPress={() => navigation.navigate('DashPersonal')}>
                    <Ionicons name={'home'} size={30} style={{ color: '#F54', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => {}}>
                    <Ionicons name={'person'} size={30} style={{ color: '#888', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => signOut()}>
                    <Ionicons name={'power'} size={30} style={{ color: '#F00', }} />
                </TouchableOpacity>
            </View>

            {/*<ScrollView contentContainerStyle={{
            flexGrow: 1,
            padding: 16,
            backgroundColor: '#FCA',
            paddingTop: 30
        }}>
            <Text style={[styles.textoHeader, { textAlign: 'center',marginBottom:20 }]}>Editar Perfil</Text>
            <TextInput
                label="Nome"
                mode="flat"
                style={styles.inputFlat}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                onChangeText={(text) => handleChange('nome', text)}
                value={user.nome}
            />
            <TextInput
                label="CPF"
                mode="flat"
                style={[styles.inputFlat,{marginTop:15}]}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                onChangeText={(text) => handleChange('cpf', text)}
                value={user.cpf}
                keyboardType="number-pad"
            />
            <TextInput
                label="E-mail"
                mode="flat"
                style={[styles.inputFlat,{marginTop:15}]}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                onChangeText={(text) => handleChange('email', text)}
                value={user.email}
                keyboardType="email-address"
            />
            <View style={{alignItems: 'center',
    marginBottom: 15,marginTop:30}}>
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
        </SafeAreaView>

    )
}
export default AccountPersonal