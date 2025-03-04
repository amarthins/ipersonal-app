import React, { useContext } from 'react'
import { Image, View } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawer from '../components/CustomDrawer';

import DashPersonal from '../../ScreensPersonal/DashPersonal'
import AccountPersonal from '../../ScreensPersonal/AccountPersonal'
import AgendaPersonal from '../../ScreensPersonal/AgendaPersonal'
import SettingsPersonal from '../../ScreensPersonal/SettingsPersonal'
import EditSettings from '../../ScreensPersonal/EditSettings'
import EditShowGrade from '../../ScreensPersonal/EditShowGrade'
import CameraScreen from '../../Screens/CameraScreen'
import TreinosAlunos from '../../ScreensPersonal/TreinosAlunos'
import AddTreinosAlunos from '../../ScreensPersonal/AddTreinosAlunos'
import HistoricoAulas from '../../ScreensPersonal/HistoricoAulas'
import SolicitacoesPendentes from '../../ScreensPersonal/SolicitacoesPendentes'
import VisualScreen from '../../ScreensPersonal/VisualScreen'
import VideosScreen from '../../ScreensPersonal/VideosScreen'
import VideoAddScreen from '../../ScreensPersonal/VideoAddScreen'
import LocaisMap from '../../ScreensPersonal/LocaisMap'
import TreinosListaPersonal from '../../ScreensPersonal/TreinosListaPersonal'
import TreinosAtividadesPersonal from '../../ScreensPersonal/TreinosAtividadesPersonal'

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const AuthPersonal = () => {

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
            <Stack.Screen name="DashPersonal" component={DashPersonal} />
            <Stack.Screen name="AccountPersonal" component={AccountPersonal} />
            <Stack.Screen name="AgendaPersonal" component={AgendaPersonal} />
            <Stack.Screen name="SettingsPersonal" component={SettingsPersonal} />
            <Stack.Screen name="CameraScreen" component={CameraScreen} />
            <Stack.Screen name="EditSettings" component={EditSettings} />
            <Stack.Screen name="EditShowGrade" component={EditShowGrade} />
            <Stack.Screen name="TreinosAlunos" component={TreinosAlunos} />
            <Stack.Screen name="AddTreinosAlunos" component={AddTreinosAlunos} />
            <Stack.Screen name="HistoricoAulas" component={HistoricoAulas} />
            <Stack.Screen name="SolicitacoesPendentes" component={SolicitacoesPendentes} />
            <Stack.Screen name="VisualScreen" component={VisualScreen} />
            <Stack.Screen name="VideosScreen" component={VideosScreen} />
            <Stack.Screen name="VideoAddScreen" component={VideoAddScreen} />
            <Stack.Screen name="LocaisMap" component={LocaisMap} />
            <Stack.Screen name="TreinosListaPersonal" component={TreinosListaPersonal} />
            <Stack.Screen name="TreinosAtividadesPersonal" component={TreinosAtividadesPersonal}/>
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

export default AuthPersonal