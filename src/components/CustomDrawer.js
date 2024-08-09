import React, { useState, useEffect, useContext } from 'react'
import { View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native'
import { DrawerItemList, DrawerContentScrollView } from '@react-navigation/drawer'
import { AuthContext } from '../context/auth'
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles'

const CustomDrawer = (props) => {

    const navigation = useNavigation();

    const avatar = ''

    const { getObject, checkAuth, signOut, user, token } = useContext(AuthContext)

    /*
    
    const [avatar, setAvatar] = useState(user && user.nome ? user.nome : null)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            let vlr = await checkAuth()
            vlr.user.nome === undefined ? setAvatar('') : setAvatar(vlr.user.nome)
        })
        return unsubscribe
    }, [user.nome])

    
    */

    const sair = () => {
        signOut()
        props.navigation.toggleDrawer();
    }

    return (
        <View style={{ flex: 1, marginTop: 100 }}>

            <View style={{ paddingLeft: '10%' }}>
                <Text style={styles.textoLabel}>{avatar}</Text>
            </View>

            <DrawerContentScrollView {...props}
                contentContainerStyle={{ backgroundColor: '#FFF', }}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>

            <Text style={{ marginLeft: '10%', paddingBottom: 20, }}>Versão Dev iPersonal 1.0.0 - 202405030914</Text>
            <View style={{ paddingLeft: 30, padding: 20, borderTopWidth: 1, borderTopColor: '#CCC' }}>
                <TouchableOpacity
                    onPress={() => sair()}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons
                            name={'power'}
                            size={22}
                            style={{ marginLeft: 10, paddingTop: 5, color: '#F42302', }}
                        />
                        <Text style={{ color: '#183241', fontSize: 16 }}>   Sair</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}
export default CustomDrawer