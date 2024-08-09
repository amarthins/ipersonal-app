import React, { useContext } from 'react'
import { Image, View } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawer from '../components/CustomDrawer';

import DashPersonal from '../../ScreenAuth/DashPersonal'
import AccountPersonal from '../../ScreenAuth/AccountPersonal'
import AgendaPersonal from '../../ScreenAuth/AgendaPersonal'
import SettingsPersonal from '../../ScreenAuth/SettingsPersonal'


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
                    borderBottomLeftRadius:0,
                    borderBottomRightRadius:0
                },
                headerTintColor: '#fff',
            }}>
            <Stack.Screen name="DashPersonal" component={DashPersonal} />
            <Stack.Screen name="AccountPersonal" component={AccountPersonal} />
            <Stack.Screen name="AgendaPersonal" component={AgendaPersonal} />
            <Stack.Screen name="SettingsPersonal" component={SettingsPersonal} />
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