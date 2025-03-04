import React, { useContext } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../../Screens/WelcomeScreen';
import LoginScreen from '../../Screens/LoginScreen'
import CadastroScreen from '../../Screens/CadastroScreen'
import RecuperaSenha from '../../Screens/RecuperaSenha'


const Stack = createNativeStackNavigator();

const AppStack = () => {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="CadastroScreen" component={CadastroScreen} />
            <Stack.Screen name="RecuperaSenha" component={RecuperaSenha} />
        </Stack.Navigator>
    )

}
export default AppStack