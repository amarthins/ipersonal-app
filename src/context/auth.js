import React, { createContext, useState, useEffect } from 'react'
import { navigation, useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../src/config'
import firebase from '../../src/components/Firebase'
import moment from 'moment'
import axios from 'axios'
import { currency, mask, unMask } from 'remask'
import { result } from 'validate.js';
import NetInfo from '@react-native-community/netinfo';

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
    const [changeState, setChangeState] = useState(false)
    const unidade = 1
    const [isConnected, setIsConnected] = useState(true);

    const navigation = useNavigation()

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            //setIsConnected(state.isConnected);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    async function signOut() {
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
            await storeObject('@avatar', retorno.usuario.avatar)
            await storeObject('@logado', true)
            setToken(retorno.token)
            setUser(retorno.usuario)
            setLogado(true)
            setChangeState(!changeState)
        }
        return true
    }

    const checkLogado = async () => {
        const logado = await getObject('@logado')
        return logado
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
        const tkn = await getObject('@token')
        let response = await fetch(config.site_url + '/webservice/api/retorna-servicos/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
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
console.log( 'resp json sigon',json )
        if (json.status === 200) {
            let email = grupo === 4 ? login : ''
            let celular = grupo === 3 ? login : ''
            let usuario = {
                id: json.id,
                login: login,
                nome: nome,
                email: email,
                celular: celular,
                groupid: grupo,
                posicao: 'pendente'
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

    async function uploadPhoto(id, photoUri, tkn) {
        let extensao = getExtension(photoUri)
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        const filename = id + '-' + randomNumber + '.png'// + extensao
        let form = new FormData()
        form.append('id', id)
        form.append('avatar', filename)
        const imageAvatar = {
            name: filename,
            uri: photoUri,
            type: 'image/png'
        }
        form.append('photo', imageAvatar)
        let response = await fetch(config.site_url + '/webservice/api/uploadfoto/', {
            method: 'POST',
            headers: {

                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + tkn
            },
            body: form
        });
        let json = await response.json()
        json = { ...json, filename: filename }
        return json;
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
        const tokn = await getObject('@token')
        let valores = dados

        if (valores.avatar !== undefined && valores.avatar !== null) {
            if (valores.avatar.startsWith('file:///')) {
                const foto = await uploadPhoto(dados.id, dados.avatar, tokn)
                if (foto.status === 200) {
                    const altera = [{ ...dados, avatar: foto.filename }]
                    valores = altera[0]
                } else {
                    return foto
                }
            }
        }
        const atualiza = await updateUser(valores, tokn)
        if (atualiza.status === 200) {
            await storeObject('@user', atualiza.usuario)
            setUser(atualiza.usuario)
            setChangeState(!changeState)
        }
        return atualiza
    }

    async function updateUser(valores, token) {
        let form_data = JSON.stringify({
            id: valores.id,
            login: valores.login,
            nome: valores.nome,
            avatar: valores.avatar,
            cpf: valores.cpf,
            groupid: valores.groupid,
            celular: valores.celular,
            email: valores.email,
            localizacao: valores.localizacao,
            bairro: valores.bairro,
            cep: valores.cep,
            cidade: valores.cidade,
            complemento: valores.complemento,
            endereco: valores.endereco,
            numero: valores.numero,
            uf: valores.uf
        })

        let response = await fetch(config.site_url + '/webservice/api/atualiza-cadastro/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: form_data
        });
        let json = await response.json()
        console.log( 'resposta updteUser',json )
        return json;
    }

    const getSettings = async () => {
        const usuario = await getObject('@user')
        const id = usuario.id
        let form_data = JSON.stringify({ id })

        const tkn = await getObject('@token')

        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: JSON.stringify({ id })
        };

        try {
            const response = await fetch(config.site_url + '/webservice-profissional/api/retorna-settings-profissional/', options);
            const resultado = await response.json();

            return resultado;
        } catch (erro) {
            console.error('Erro ao enviar dados:', erro);
            return false
        }
    }

    const getLocais = async () => {
        const tkn = await getObject('@token')

        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            }
        };

        try {
            const response = await fetch(config.site_url + '/webservice/api/retorna-locais/', options);
            const resultado = await response.json();
            return resultado;
        } catch (erro) {
            console.error('Erro ao enviar dados:', erro);
            return false
        }
    }

    const getDadosDisponiveis = async () => {
        const tkn = await getObject('@token')
        const usuario = await getObject('@user')
        const form_data = JSON.stringify({ id: usuario.id })

        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };

        try {
            const response = await fetch(config.site_url + '/webservice/api/retorna-locais-disponiveis-usuario/', options);
            const resultado = await response.json();
            return resultado;
        } catch (erro) {
            console.error('Erro ao receber dados:', erro);
            return false
        }
    }

    const deleteOption = async (tipo, id) => {
        const tkn = await getObject('@token')

        const form_data = JSON.stringify({ tipo, id })

        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };

        try {
            const response = await fetch(config.site_url + '/webservice/api/deleta-opcao/', options);
            const resultado = await response.json();

            return resultado;
        } catch (erro) {
            console.error('Erro ao enviar dados:', erro);
            return false
        }
    }

    const saveSettings = async (valores, tipo) => {
        const tkn = await getObject('@token')
        const usr = await getObject('@user')
        const id = usr.id

        const form_data = JSON.stringify({ valores, tipo, id })

        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };

        try {
            const response = await fetch(config.site_url + '/webservice-profissional/api/update-settings-profissional/', options);
            const resultado = await response.json();

            return resultado;
        } catch (erro) {
            console.error('Erro ao enviar dados:', erro);
            return false
        }
    }

    const saveLocal = async (local) => {
        const tkn = await getObject('@token')
        const usr = await getObject('@user')
        const id_membro = usr.id

        const form_data = JSON.stringify({ local, id_membro })
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };

        try {
            const response = await fetch(config.site_url + '/webservice-profissional/api/update-locais-profissional/', options);
            const resultado = await response.json();

            return resultado;
        } catch (erro) {
            console.error('Erro ao enviar dados:', erro);
            return false
        }
    }

    const releaseLocal = async (local) => {
        const tkn = await getObject('@token')
        const usr = await getObject('@user')
        const id_membro = usr.id

        const form_data = JSON.stringify({ local, id_membro })
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };

        try {
            const response = await fetch(config.site_url + '/webservice-profissional/api/release-locais-profissional/', options);
            const resultado = await response.json();
            console.log('resultado', resultado)
            return resultado;
        } catch (erro) {
            console.error('Erro ao enviar dados:', erro);
            return false
        }
    }

    const resetPassword = async (login) => {
        const form_data = JSON.stringify({ login })
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: form_data
        };
        let ulr = config.site_url + '/webservice/api/reset-login/'

        try {
            const response = await fetch(config.site_url + '/webservice/api/reset-login/', options);
            const resultado = await response.json();
            console.log('resultado', resultado)
            return resultado;
        } catch (erro) {
            console.error('Erro ao receber dados:', erro);
            return false
        }
    }

    const checkFile = async (url) => {
        fetch(url, { method: 'HEAD', })
            .then(response => {
                const contentType = response.headers.get('Content-Type');
                if (contentType && (
                    contentType.includes('application/') || contentType.includes('image/png'))) {
                    return true
                } else {
                    return false
                }
            })
            .catch(error => {
                console.error('Error checking URL:', error);
            });
    }

    const getProfLocaisByServ = async (id) => {
        const tkn = await getObject('@token')
        const form_data = JSON.stringify({ id })
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };

        try {
            const response = await fetch(config.site_url + '/webservice-profissional/api/retorna-servicos-profissionais/', options);
            const resultado = await response.json();
            return resultado;
        } catch (erro) {
            console.error('Erro ao recuperar serviços profissionais:', erro);
            return false
        }
    }

    const gradeProfissionalDia = async (id, data) => {
        dia = data
        const tkn = await getObject('@token')
        const form_data = JSON.stringify({ id, dia })
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };
        try {
            const response = await fetch(config.site_url + '/webservice/api/retorna-grade-dia/', options);
            const resultado = await response.json();
            return resultado;
        } catch (erro) {
            console.error('Erro ao recuperar grade dia:', erro);
            return false
        }
    }

    const salvaEntradaAgenda = async (hora, dia, id_profissional, local, id_local, id_item) => {
        const tkn = await getObject('@token')
        const user = await getObject('@user')
        const id_cliente = user.id
        const form_data = JSON.stringify({ hora, dia, id_profissional, id_cliente, id_local, id_item })

        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };

        try {
            const response = await fetch(config.site_url + '/webservice/api/salva-entrada-agenda/', options);
            const resultado = await response.json();

            return resultado;
        } catch (erro) {
            console.error('Erro ao salvar entrada agenda:', erro);
            return false
        }
    }

    const getAgendaDia = async (data) => {
        const tkn = await getObject('@token')
        const user = await getObject('@user')
        const id_cliente = user.id
        const dia = data.dateString
        const form_data = JSON.stringify({ dia: data, id_cliente: id_cliente })

        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };

        try {
            const response = await fetch(config.site_url + '/webservice-aluno/api/retorna-agenda-dia-cliente/', options);
            const resultado = await response.json();

            return resultado;
        } catch (erro) {
            console.error('Erro ao recuperar agenda dia cliente:', erro);
            return false
        }
    }

    const getAgendaDiaProfissional = async (data) => {
        const tkn = await getObject('@token')
        const user = await getObject('@user')
        const id_profissional = user.id
        const dia = data
        const form_data = JSON.stringify({ dia: data, id_profissional: id_profissional })

        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };
        let url = config.site_url + '/webservice-profissional/api/retorna-agenda-dia-profissional/'

        try {
            const response = await fetch(config.site_url + '/webservice-profissional/api/retorna-agenda-dia-profissional/', options);
            const resultado = await response.json();

            return resultado;
        } catch (erro) {
            console.error('Erro ao recuperar agenda dia profissional:', erro);
            return false
        }
    }

    const getHistoricoAluno = async () => {
        const tkn = await getObject('@token')
        const user = await getObject('@user')
        const form_data = JSON.stringify({ id: user.id })

        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };

        try {
            const response = await fetch(config.site_url + '/webservice-aluno/api/retorna-historico-cliente/', options);
            const resultado = await response.json();

            return resultado;
        } catch (erro) {
            console.error('Erro ao recuperar historico cliente:', erro);
            return false
        }
    }

    const getAgendaAbertoAluno = async (dia) => {
        const tkn = await getObject('@token')
        const user = await getObject('@user')
        const form_data = JSON.stringify({ id: user.id, dia: dia })

        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };

        try {
            const response = await fetch(config.site_url + '/webservice-aluno/api/retorna-agenda-aberto-cliente/', options);
            const resultado = await response.json();

            return resultado;
        } catch (erro) {
            console.error('Erro ao recuperar agenda aberto cliente:', erro);
            return false
        }
    }

    const checkIfLinkIsFile = async (item) => {
        const link = config.site_url + '/public/images/avatar/' + item.avatar;
        try {
            const response = await fetch(link, { method: 'HEAD', });
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.startsWith('image/')) {
                return true;
            } else if (contentType && contentType.startsWith('application/')) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    const checkAvatarExistence = async (avatars) => {
        const validAvatars = await Promise.all(
            avatars.map(async (item) => {
                const url = config.site_url + '/public/images/avatar/' + item.avatar;
                try {
                    const response = await fetch(url, { method: 'HEAD', });
                    const contentType = response.headers.get('Content-Type');
                    if (contentType && contentType.startsWith('image/')) {
                        return true;
                    } else if (contentType && contentType.startsWith('application/')) {
                        return true;
                    } else {
                        return false;
                    }
                } catch (error) {
                    console.error(error);
                    return false;
                }
                /*
                console.log('ite', url)
                console.log('ite', item)

                if (item.avatar === null) {
                    return { id: item.id, exists: false }
                } else {
                    return fetch(url, { method: 'HEAD' })
                        .then((response) => (console.log(response.headers.get('Content-Type'))))
                        .catch(() => ({ id: item.id, exists: false }));
                }
                */
            })
        );
        return validAvatars;
    };

    const confirmaAgenda = async (id, posicao) => {
        const tkn = await getObject('@token')
        const form_data = JSON.stringify({ id, posicao })

        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };

        try {
            const response = await fetch(config.site_url + '/webservice/api/confirma-solicitacao-agenda/', options);
            const resultado = await response.json();

            return resultado;
        } catch (erro) {
            console.error('Erro ao confirmar solicitacao agenda:', erro);
            return false
        }
    }

    const retornaMetasAluno = async (id_cliente) => {
        const tkn = await getObject('@token')
        const form_data = JSON.stringify({ id_cliente })

        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };

        try {
            const response = await fetch(config.site_url + '/webservice-aluno/api/retorna-metas-cliente/', options);
            const resultado = await response.json();

            return resultado;
        } catch (erro) {
            console.error('Erro ao recuperar metas cliente:', erro);
            return false
        }
    }

    const retornaMetas = async () => {
        const tkn = await getObject('@token')

        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            }
        };

        try {
            const response = await fetch(config.site_url + '/webservice-aluno/api/retorna-lista-metas/', options);
            const resultado = await response.json();

            return resultado;
        } catch (erro) {
            console.error('Erro ao recuperar lista metas:', erro);
            return false
        }
    }

    const salvaMetaAluno = async (id_meta) => {
        const tkn = await getObject('@token')
        const cliente = await getObject('@user')
        const id_membro = cliente.id
        const form_data = JSON.stringify({ id_membro, id_meta })

        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };

        try {
            const response = await fetch(config.site_url + '/webservice-aluno/api/insere-meta-cliente/', options);
            const resultado = await response.json();

            return resultado;
        } catch (erro) {
            console.error('Erro ao inserir meta cliente:', erro);
            return false
        }
    }

    const retornaTreinosAluno = async (id_membro) => {
        const tkn = await getObject('@token')
        const form_data = JSON.stringify({ id_membro })
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };

        try {
            const response = await fetch(config.site_url + '/webservice-aluno/api/retorna-treinos-aluno/', options);
            const resultado = await response.json();

            return resultado;
        } catch (erro) {
            console.error('Erro ao recuperar treinos aluno:', erro);
            return false
        }
    }

    const getPersonalProximo = async (latitude, longitude) => {
        const tkn = await getObject('@token')
        const form_data = JSON.stringify({ latitude, longitude })
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };

        try {
            const response = await fetch(config.site_url + '/webservice-aluno/api/retorna-profissionais-proximos/', options);
            const resultado = await response.json();

            return resultado
        } catch (erro) {
            console.error('Erro ao recuperar treinos aluno:', erro);
            return false
        }
    }

    const retornaListaTreinosPorPersonal = async (id_profissional) => {
        const tkn = await getObject('@token')
        const form_data = JSON.stringify({ id_profissional })
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };

        try {
            const response = await fetch(config.site_url + '/webservice-profissional/api/retorna-lista-treinos-personal/', options);
            const resultado = await response.json();

            return resultado;
        } catch (erro) {
            console.error('Erro ao recuperar lista treino alunos:', erro);
            return false
        }
    }

    const listaAlunos = async () => {
        const tkn = await getObject('@token')
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            }
        };

        try {
            const response = await fetch(config.site_url + '/webservice-profissional/api/retorna-alunos/', options);
            const resultado = await response.json();

            return resultado;
        } catch (erro) {
            console.error('Erro ao recuperar alunos:', erro);
            return false
        }
    }

    const getHistoricoAulasProfissional = async (id_profissional) => {
        const tkn = await getObject('@token')
        const form_data = JSON.stringify({ id_profissional })
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };

        try {
            const response = await fetch(config.site_url + '/webservice-profissional/api/retorna-lista-aulas/', options);
            const resultado = await response.json();

            return resultado;
        } catch (erro) {
            console.error('Erro ao recuperar lista aulas:', erro);
            return false
        }
    }

    const salvaLinkArquivo = async (nome, descricao, link) => {
        const tkn = await getObject('@token')
        const usuario = await getObject('@user')
        const id_membro = usuario.id
        const form_data = JSON.stringify({ id_membro, nome, descricao, link })
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };

        try {
            const response = await fetch(config.site_url + '/webservice/api/insere-link-arquivos/', options);
            const resultado = await response.json();

            return resultado;
        } catch (erro) {
            console.error('Erro ao inserir link arquivo:', erro);
            return false
        }
    }

    const getListaArquivos = async (id_membro) => {
        const tkn = await getObject('@token')
        const usuario = await getObject('@user')
        const form_data = JSON.stringify({ id_membro })
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };

        try {
            const response = await fetch(config.site_url + '/webservice/api/retorna-link-arquivos/', options);
            const resultado = await response.json();

            return resultado;
        } catch (erro) {
            console.error('Erro ao recuperar link arquivos:', erro);
            return false
        }
    }

    const getProfissionaisByItem = async (id_item) => {
        const tkn = await getObject('@token')
        const usuario = await getObject('@user')
        const form_data = JSON.stringify({ id_item })
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };

        try {
            const response = await fetch(config.site_url + '/webservice-aluno/api/retorna-profissionais-item/', options);
            const resultado = await response.json();

            return resultado.dados;
        } catch (erro) {
            console.error('Erro ao recuperar link arquivos:', erro);
            return false
        }
    }

    const getAnuncios = async () => {
        const tkn = await getObject('@token')
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            }
        };

        try {
            const response = await fetch(config.site_url + '/webservice/api/retorna-anuncios/', options);
            const resultado = await response.json();

            return resultado;
        } catch (erro) {
            console.error('Erro ao recuperar alunos:', erro);
            return false
        }
    }

    const salvarTreino = async (dados) => {
        const tkn = await getObject('@token')
        const form_data = JSON.stringify({ dados })

        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };

        try {
            const response = await fetch(config.site_url + '/webservice-aluno/api/insere-treino-cliente/', options);
            const resultado = await response.json();

            return resultado;
        } catch (erro) {
            console.error('Erro ao inserir treino cliente:', erro);
            return false
        }
    }

    const atualizaStatusAtividade = async (id, posicao) => {
        const tkn = await getObject('@token')
        const form_data = JSON.stringify({ id, posicao })

        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };

        try {
            const response = await fetch(config.site_url + '/webservice-aluno/api/atividade-atualiza-status/', options);
            const resultado = await response.json();

            return resultado;
        } catch (erro) {
            console.error('Erro ao alterar status da atividade:', erro);
            return false
        }
    }

    const getAtividadesTreino = async (id_treino) => {
        const tkn = await getObject('@token')
        const form_data = JSON.stringify({ id_treino })
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };

        try {
            const response = await fetch(config.site_url + '/webservice-aluno/api/atividades-treino-aluno/', options);
            const resultado = await response.json();

            return resultado.dados;
        } catch (erro) {
            console.error('Erro ao recuperar link arquivos:', erro);
            return false
        }
    }

    const enviaReview = async (dados) => {
        const tkn = await getObject('@token')
        const form_data = JSON.stringify({ dados })
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };

        try {
            const response = await fetch(config.site_url + '/webservice-profissional/api/envia-review/', options);
            const resultado = await response.json();

            return resultado;
        } catch (erro) {
            console.error('Erro ao enviar review:', erro);
            return false
        }
    }

    const getReview = async (id_membro) => {
        const tkn = await getObject('@token')
        const form_data = JSON.stringify({ id_membro })
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tkn
            },
            body: form_data
        };

        try {
            const response = await fetch(config.site_url + '/webservice-profissional/api/retorna-review/', options);
            const resultado = await response.json();

            return resultado.dados;
        } catch (erro) {
            console.error('Erro ao recuperar link arquivos:', erro);
            return false
        }
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

    const formataIntl = (value) => {
        const formattedNumber = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        }).format(value);
        return formattedNumber
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

    async function getCep(cepRaw) {
        let url = 'https://viacep.com.br/ws/' + cepRaw + '/json'
        let response = await fetch(url, {
            method: 'GET'
        });
        let json = await response.json()
        return json;
    }

    function formatarHora(hora) {
        if (!hora) return '';
        let [h, m] = hora.split(':');
        h = h.padStart(2, '0');
        return `${h}:${m}`;
    }

    return (
        <AuthContext.Provider
            value={{
                user, token, logado, changeState, isConnected,
                removeValue, storeObject, getObject, formataNome, formatCurrency, valorFlutuante,
                signIn, signOut, signOn, checkAuth, getServices, uploadPhoto, updtCadastro,
                getSettings, getLocais, deleteOption, getDadosDisponiveis, saveSettings,
                getCep, formatarHora, resetPassword, checkFile, getProfLocaisByServ,
                formataIntl, gradeProfissionalDia, salvaEntradaAgenda, getAgendaDia,
                checkAvatarExistence, salvaLinkArquivo, getListaArquivos,
                saveLocal, releaseLocal, getCep,

                getAgendaDiaProfissional, checkIfLinkIsFile,
                confirmaAgenda, getHistoricoAulasProfissional,

                getHistoricoAluno, getAgendaAbertoAluno,
                retornaMetasAluno, retornaMetas, salvaMetaAluno, retornaTreinosAluno,
                retornaListaTreinosPorPersonal, listaAlunos,
                getPersonalProximo,
                getProfissionaisByItem,
                getAnuncios,
                salvarTreino,
                getAtividadesTreino,
                atualizaStatusAtividade,
                enviaReview,getReview,
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider