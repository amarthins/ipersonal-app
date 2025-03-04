import React, { useContext } from 'react'
import { Image, View } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawer from '../components/CustomDrawer';

import DashAluno from '../../ScreensAluno/DashAluno'
import AccountAluno from '../../ScreensAluno/AccountAluno'
import AgendaAluno from '../../ScreensAluno/AgendaAluno'
import HistoricoAluno from '../../ScreensAluno/HistoricoAluno'
import AddSolicitacao from '../../ScreensAluno/addSolicitacao'
import AddAgendaAluno from '../../ScreensAluno/AddAgendaAluno'
import ShowGridProfessional from '../../ScreensAluno/ShowGridProfessional'
import MinhasMetas from '../../ScreensAluno/MinhasMetas'
import PersonalProximo from '../../ScreensAluno/PersonalProximo'
import AddMetas from '../../ScreensAluno/AddMetas'
import PersonalAtividade from '../../ScreensAluno/PersonalAtividade'
import AtividadeChoice from '../../ScreensAluno/AtividadeChoice'
import TreinosListaAluno from '../../ScreensAluno/TreinosListaAluno'
import TreinosAtividadesAluno from '../../ScreensAluno/TreinosAtividadesAluno'

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const AuthAluno = () => {

    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: 'center',
                headerTitle: (props) => <LogoTitle {...props} />,
                headerStyle: {
                    backgroundColor: '#282828',
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0
                },
                headerTintColor: '#fff',
            }}>
            <Stack.Screen name="DashAluno" component={DashAluno} />
            <Stack.Screen name="AccountAluno" component={AccountAluno} />
            <Stack.Screen name="AgendaAluno" component={AgendaAluno} />
            <Stack.Screen name="HistoricoAluno" component={HistoricoAluno} />
            <Stack.Screen name="AddAgendaAluno" component={AddAgendaAluno} />
            <Stack.Screen name="ShowGridProfessional" component={ShowGridProfessional} />
            <Stack.Screen name="MinhasMetas" component={MinhasMetas} />
            <Stack.Screen name="PersonalProximo" component={PersonalProximo} />
            <Stack.Screen name="AddMetas" component={AddMetas} />
            <Stack.Screen name="PersonalAtividade" component={PersonalAtividade} />
            <Stack.Screen name="AtividadeChoice" component={AtividadeChoice} />
            <Stack.Screen name="TreinosListaAluno" component={TreinosListaAluno} />
            <Stack.Screen name="TreinosAtividadesAluno" component={TreinosAtividadesAluno} />
        </Stack.Navigator>
    )

}

const LogoTitle = () => {
    return (
        <Image
            style={{ width: 100, height: 40 }}
            source={require('../assets/logo-negativo.png')}
            resizeMode="contain"
        />
    );
};
export default AuthAluno