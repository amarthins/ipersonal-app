import React, { useContext } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PendingScreen from '../../ScreenAuth/PendingScreen'
import CameraScreen from '../../Screens/CameraScreen'
import SelectImageScreen from '../../Screens/SelectImageScreen'

const Stack = createNativeStackNavigator();

const PendingStack = () => {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PendingScreen" component={PendingScreen} />
            <Stack.Screen name="CameraScreen" component={CameraScreen} />
            <Stack.Screen name="SelectImageScreen" component={SelectImageScreen} />
        </Stack.Navigator>
    )

}
export default PendingStack