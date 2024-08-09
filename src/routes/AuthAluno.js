import React, { useContext } from 'react'
import { Image, View } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawer from '../components/CustomDrawer';

import DashAluno from '../../ScreenAuth/DashAluno'
import AccountScreen from '../../ScreenAuth/AccountScreen'
import AgendaAluno from '../../ScreenAuth/AgendaAluno'
import HistoricoAulas from '../../ScreenAuth/HistoricoAulas'

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
                    borderBottomLeftRadius: 30,
                    borderBottomRightRadius: 30
                },
                headerTintColor: '#fff',
            }}>
            <Stack.Screen name="DashAluno" component={DashAluno} />
            <Stack.Screen name="AccountScreen" component={AccountScreen} />
            <Stack.Screen name="AgendaAluno" component={AgendaAluno} />
            <Stack.Screen name="HistoricoAulas" component={HistoricoAulas} />
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