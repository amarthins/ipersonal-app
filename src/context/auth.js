import React, { createContext, useState } from 'react'
import { navigation, useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../src/config'
import firebase from '../../src/components/Firebase'
import moment from 'moment'
import axios from 'axios'
import { currency, mask, unMask } from 'remask'

export const axiosInstance = axios.create({
    baseURL: config.site_url,
    timeout: 3000,
    headers: { 'X-Custom-Header': 'ton' }
});

export const AuthContext = createContext({})

function AuthProvider({ children }) {

    const [user, setUser] = useState({})
    const [token, setToken] = useState(false)
    const [logado, setLogado] = useState(false)
    const [changeState,setChangeState] = useState(false)
    const unidade = 1

    const navigation = useNavigation()

    async function signOut() {
        console.log('entro sigout',changeState )
        setUser({})
        setToken(false)
        setLogado(false)
        setChangeState(!changeState)
        removeValue('@token')
        removeValue('@user')
        removeValue('@logado')
    }

    const signIn = async (login, senha) => {
        if (login !== '' && senha !== '') {
            await removeValue('@user')
            await removeValue('@token')
            await removeValue('@avatar')
            await removeValue('@logado')

            const retorno = await getToken(login, senha)

            if (retorno.status !== 200) {
                return retorno
            }
            await storeObject('@user', retorno.usuario)
            await storeObject('@token', retorno.token)
            await storeObject('@logado', true)
            setToken(retorno.token)
            setUser(retorno.usuario)
            setLogado(true)
            setChangeState(!changeState)
        }
        return true
    }

    async function getToken(login, senha) {
        let form_data = JSON.stringify({ login, senha })

        let response = await fetch(config.site_url + '/webservice/api/authentication/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: form_data
        });
        let json = await response.json()

        return json;
    }

    const getServices = async () => {
        let response = await fetch(config.site_url + '/webservice/api/retorna-servicos/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        let json = await response.json()

        return json;
    }

    async function signOn(nome, login, senha, grupo) {

        let form_data = JSON.stringify({ nome, login, senha, grupo })

        let response = await fetch(config.site_url + '/webservice/api/salva-cadastro/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: form_data
        });
        let json = await response.json()

        if (json.status === 200) {
            let usuario = {
                id: json.id,
                login: login,
                nome: nome,
                groupid: grupo,
                posicao: grupo === 3 ? 'ativo' : 'pendente'
            }

            let data = {
                token: json.token,
                user: usuario
            }
            await removeValue('@user')
            await removeValue('@token')
            await removeValue('@logado')

            await storeObject('@user', usuario)
            await storeObject('@token', json.token)
            await storeObject('@logado', true)
            setUser(usuario)
            setToken(json.token)
            setLogado(true)
            setChangeState(!changeState)
        }
        return json
    }

    async function checkAuth() {
        let token = await getObject('@token')

        typeof token === 'undefined' ? token = false : ''

        let usuario = await getObject('@user')

        if (usuario === null || usuario.groupid !== 5) {
            usuario = {}
            token = false
            await removeValue('@token')
            await removeValue('@user')
        }

        let data = {
            token: token,
            user: usuario
        }

        setUser(usuario)
        setToken(token)
        await storeObject('@token', token)
        await storeObject('@user', usuario)

        return data
    }

    const getExtension = (filename) => {
        const parts = filename.split('.');
        return parts[parts.length - 1];
    }

    async function uploadPhoto(id, photoUri) {

        let extensao = getExtension(photoUri)
        const filename = id + '.png'// + extensao

        let formData = new FormData();
        formData.append("avatar", filename)
        formData.append("photo", {
            type: "image/png",
            name: filename,
            uri: photoUri,

        });
        formData.append("id", id)

        const config = {
            method: "post",
            url: '/webservice/api/uploadfoto/',
            responseType: "json",
            headers: { 'Content-Type': 'multipart/form-data', },
            transformRequest: (data, headers) => {
                return data;
            },
            onUploadProgress: (progressEvent) => {
            },
            data: formData,
        };
        const response = await axiosInstance.request(config)

        return response.status === 200 ? filename : false
    }

    function getMimeType(extensao) {
        const mimeTypes = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'bmp': 'image/bmp',
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        };
        return mimeTypes[extensao.toLowerCase()] || 'application/octet-stream';
    }

    async function updtCadastro(dados) {

        let valores = dados

        const foto = await uploadPhoto(dados.id, dados.avatar)
        if (foto) {
            const altera = [{ ...dados, avatar: foto }]
            valores = altera[0]
        }
        const tokn = await getObject('@token')

        const atualiza = await updateUser(valores, tokn)

        if(atualiza.status===200)
        {
            setChangeState(!changeState)
        }
        return atualiza

    }

    async function updateUser(valores, token) {
        const formData = new FormData();

        formData.append("id", valores.id)
        formData.append("nome", valores.nome)
        formData.append("avatar", valores.avatar)
        formData.append("groupid", valores.groupid)
        formData.append("id_categoria", valores.id_categoria)
        formData.append("id_servico", valores.id_servico)
        formData.append("login", valores.login)
        formData.append("posicao", 'ativo')

        const config = {
            method: "post",
            url: '/webservice/api/atualiza-cadastro/',
            responseType: "json",
            headers: { 'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + token },
            transformRequest: (data, headers) => {
                return data;
            },
            onUploadProgress: (progressEvent) => {
            },
            data: formData,
        };
        const response = await axiosInstance.request(config)

        if (response.data.status === 200) {
            await removeValue('@user')
            await storeObject('@user', response.data.usuario)
            setUser(response.data.usuario)
        }
        return response.data
    }















    const removeValue = async (key) => {
        try {
            await AsyncStorage.removeItem(key)
        } catch (e) {
            console.log(e)
        }
        return true
    }

    const storeValue = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value)
        } catch (e) {
            console.log(e)
        }
    }

    const storeObject = async (key, value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(key, jsonValue)
        } catch (e) {
            console.log(e)
        }
    }

    const getValue = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key)

            if (value !== null) {
                return value
            }
        } catch (e) {
            console.log(e)
        }
    }

    const getObject = async (key) => {
        try {
            const jsonValue = await AsyncStorage.getItem(key)
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            // error reading value
        }
    }

    const formataNome = (nomeCompleto) => {
        if (nomeCompleto) {
            const palavras = nomeCompleto.trim().split(/\s+/);
            if (palavras.length > 0) {
                const firstName = palavras[0];
                const firstLetter = firstName.charAt(0).toUpperCase();
                const restOfName = firstName.slice(1).toLowerCase();
                const nomeFormatado = firstLetter + restOfName;

                return nomeFormatado;
            }
        }
        return '';
    }

    const formatCurrency = (value) => {
        const cleanedValue = currency.unmask({ locale: 'pt-BR', currency: 'BRL', value: value })

        const valorString = typeof cleanedValue === 'string' ? cleanedValue : cleanedValue.toString()
        let valorDecimal = valorString
        if (valorString.indexOf('.') === -1) {
            valorDecimal = valorString + '.00';
        }
        const numericValue = parseFloat(valorDecimal)

        if (!isNaN(numericValue)) {
            let numberFormated = currency.mask({ locale: 'pt-BR', currency: 'BRL', value: numericValue })
            return { mask: numberFormated, unMask: valorDecimal };
        }
        return { mask: 'R$ 0,00', unMask: 0.00 };
    }

    function valorFlutuante(valor) {
        valor = valor.toString();
        valor = valor.replace(/R\$\s?/, '');
        valor = valor.replace(',', '.');
        const valorNumerico = parseFloat(valor);
        if (isNaN(valorNumerico)) {
            return null;
        }
        return valorNumerico;
    }

    return (
        <AuthContext.Provider
            value={{
                user, token,logado,changeState,
                removeValue, storeObject, getObject, formataNome, formatCurrency, valorFlutuante,
                signIn, signOut, signOn, checkAuth, getServices, uploadPhoto, updtCadastro,
                
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider