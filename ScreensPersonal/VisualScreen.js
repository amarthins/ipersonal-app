import React, { useState, useEffect, useContext, useRef } from "react"
import { View, Text, ImageBackground,Dimensions, StatusBar, BackHandler, KeyboardAvoidingView, ScrollView, Image, TouchableOpacity } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { SafeAreaView } from "react-native-safe-area-context"
import { TextInput, Avatar, Select, SelectItem, } from 'react-native-paper'
import styles from '../src/styles';
import { Ionicons } from "@expo/vector-icons"
import { AuthContext } from '../src/context/auth'
import { unMask, mask } from 'remask'
import validate from 'validate.js'
import { FlashList } from '@shopify/flash-list'
import { Picker } from '@react-native-picker/picker'
import config from '../src/config/index.json'
import backgroundImage from '../src/assets/personal-aluna.png'
import moment from 'moment'

let { width, height } = Dimensions.get("window");

const VisualScreen = ({ route, navigation }) => {

    const { getObject, getHistoricoAulasProfissional,signOut, storeObject, removeValue, getServices, formataNome, updtCadastro } = useContext(AuthContext)

    const [user, setUser] = useState(null)
    const [lista,setLista] = useState([])

    return (
        <View>
            <Text>text</Text>
        </View>
    )
}
export default VisualScreen