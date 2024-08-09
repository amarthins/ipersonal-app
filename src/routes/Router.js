import React, { useContext, useState, useEffect } from 'react'
import AppStack from '../routes/AppStack'
import AuthAluno from './AuthAluno'
import AuthPersonal from './AuthPersonal'
import { AuthContext } from '../context/auth'
import PendingStack from './PendingStack'

const Router = () => {

    const { changeState, logado, getObject, setUser } = useContext(AuthContext);

    const [tkn, setTkn] = useState(false)
    const [usr, setUsr] = useState(false)

    const [isVerified, setIsVerified] = useState(logado)

    useEffect(() => {
        const checkLoginStatus = async () => {
            const verifica = await getObject('@logado')
            if (verifica === true) {
                const usuario = await getObject('@user')
                const toquen = await getObject('@token')

                setTkn(toquen)
                setUsr(usuario)
                setIsVerified(true)
            } else {
                setTkn(false)
                setUsr(false)
            }
        };
        checkLoginStatus();
    }, [changeState]);


    if (isVerified && usr && tkn) {
        if (usr.posicao === 'pendente') {
            return <PendingStack />
        } else {
            if (usr.groupid === 3) {
                return <AuthAluno />
            } else if (usr.groupid === 4) {
                return <AuthPersonal />
            }
        }
    } else {
        return <AppStack />
    }
}
export default Router