import React, { useState, useEffect, useContext, useCallback } from "react"
import { View, Text, FlatList, Dimensions, ImageBackground, StatusBar, KeyboardAvoidingView, ScrollView, Image, TouchableOpacity } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import { ptBr } from '../src/utils/localeCalendarConfig'
import { SafeAreaView } from "react-native-safe-area-context"
import config from '../src/config/index.json'
import { TextInput, List, Portal, Modal, Button } from 'react-native-paper'
import styles from '../src/styles';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { AuthContext } from '../src/context/auth'
import { unMask, mask } from 'remask'
import validate from 'validate.js'
import backgroundImage from '../src/assets/personal-aluna.png'
import { FlashList } from '@shopify/flash-list'
//import AutocompleteInput from '../src/components/AutocompleteInput'
import AutocompleteInput from 'react-native-autocomplete-input'
import ModalComponent from '../src/components/ModalComponent'

const EditShowGrade = ({ route, navigation }) => {
    const { getObject, getCep, formatarHora, getDadosDisponiveis, getServicosDisponiveis, signOut, saveSettings, getSettings, storeObject, removeValue, getServices, formataNome, updtCadastro } = useContext(AuthContext)

    const hours = Array.from({ length: 18 }, (_, i) => ({ id: i + 6, hour: `${i + 6}:00` }));
    const { width, height } = Dimensions.get('window');
    const firstColumn = (width - width * 0.04) * 0.14
    const columnWidth = (width - width * 0.04 - firstColumn) / 8
    const columnOver = (width - width * 0.04)
    const columnInside = width - width * 0.15

    const [showGrade, setShowGrade] = useState(false)
    const [title, setTitle] = useState(null)
    const [visible, setVisible] = useState(false);
    const [titleModal, setTitleModal] = useState(null)
    const [contentModal, setContentModal] = useState(null)
    const [selectedCells, setSelectedCells] = useState([{}])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            const dados = await getDadosDisponiveis()
            setSelectedCells(dados.grade[0])
            setTimeout(() => {
            }, 1000);
        })
        return unsubscribe
    }, [navigation])

    const weekDays = [
        { id: 1, name: 'Seg' },
        { id: 2, name: 'Ter' },
        { id: 3, name: 'Qua' },
        { id: 4, name: 'Qui' },
        { id: 5, name: 'Sex' },
        { id: 6, name: 'Sab' },
        { id: 7, name: 'Dom' },
    ];

    const HeaderRow = () => {
        return (
            <View style={styles.wrapperHeaderGrid}>
                <View style={styles.lineHeaderLeft}>
                    <Text style={styles.textoGrid}>#</Text>
                </View>
                {weekDays.map((day) => (
                    <View key={day.id} style={styles.lineHeader}>
                        <Text style={styles.textoGrid}>{day.name}</Text>
                    </View>
                ))}
            </View>
        );
    };

    const GridCell = ({ day, hour }) => {
        const indice = day.name.toLowerCase();
        //const isSelected = selectedCells[indice] && selectedCells[indice].includes(formatarHora(hour.hour));

        const isSelected = selectedCells && selectedCells[indice] !== null && selectedCells[indice] !== undefined
            ? selectedCells[indice].includes(formatarHora(hour.hour))
            : false;

        return (
            <View style={styles.gridCell}>
                <TouchableOpacity onPress={() => handleCellPress(day, hour)}>
                    {isSelected ? (
                        <MaterialCommunityIcons name="checkbox-marked" size={20} color="#BDFF00" />
                    ) : (
                        <MaterialCommunityIcons name="checkbox-blank-outline" size={20} color="#FFF" />
                    )}
                </TouchableOpacity>
            </View>
        );
    }

    {/*const handleCellPress = useCallback((day, hour) => {
        setSelectedCells((prevCells) => {
            const newCells = { ...prevCells };
            const indice = day.name.toLowerCase();
            if (!newCells[indice]) {
                newCells[indice] = [formatarHora(hour.hour)];
            } else {
                if (!newCells[indice].includes(formatarHora(hour.hour))) {
                    newCells[indice].push(formatarHora(hour.hour));
                } else {
                    newCells[indice] = newCells[indice].filter((hour) => hour !== formatarHora(hour.hour));
                }
            }
            return newCells;
        });

    }, [selectedCells])*/}
    const handleCellPress = useCallback((day, hour) => {
        if (hour.hour) {
            /*setSelectedCells((prevCells) => {
                const newCells = { ...prevCells };
                const indice = day.name.toLowerCase();
                if (!newCells[indice]) {
                    newCells[indice] = [formatarHora(hour.hour)];
                } else {

                    if (!newCells[indice].includes(formatarHora(hour.hour))) {
                        newCells[indice].push(formatarHora(hour.hour));
                    } else {
                        newCells[indice] = newCells[indice].filter((hour) => hour !== formatarHora(hour.hour));
                    }
                }
                return newCells;
            });*/
            setSelectedCells((prevCells) => {
                const newCells = { ...prevCells };
                const indice = day.name.toLowerCase();
                if (!newCells[indice]) {
                    newCells[indice] = [formatarHora(hour.hour)];
                } else {
                    const hourIndex = newCells[indice].indexOf(formatarHora(hour.hour));

                    if (hourIndex === -1) {
              
                      // Hour is not selected, add it to the array
              
                      newCells[indice].push(formatarHora(hour.hour));
              
                    } else {
              
                      // Hour is already selected, remove it from the array
              
                      newCells[indice].splice(hourIndex, 1);
              
                    }
                }
                return newCells;
            });
        }
    }, [selectedCells])

    const handleSave = async () => {
        try {
            const response = await saveSettings(selectedCells, 'grade');
            if (response.status === 200) {
                navigation.navigate('SettingsPersonal');
            } else {
                alert('Error');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SafeAreaView style={styles.safeContainer}>

            <View style={styles.containerGrid}>

                <ScrollView contentContainerStyle={styles.scrollContainerGrid} style={styles.scrollGrid}>
                    {/* header */}
                    <HeaderRow />
                    {/* header */}

                    {/* GRID */}
                    {hours.map((hour) => (
                        <View key={hour.id} style={{ flexDirection: 'row', width: columnOver }}>
                            <View style={{
                                width: firstColumn, justifyContent: 'center', alignItems: 'center',
                                borderWidth: 1, borderColor: '#000', height: height * 0.04,
                            }}>
                                <Text style={{ fontSize: 12, color: '#FFF' }}>{formatarHora(hour.hour)}</Text>
                            </View>
                            {weekDays.map((day) => (
                                <GridCell key={day.id} day={day} hour={hour} isSelected={false} />
                            ))}
                        </View>
                    ))}
                    {/* GRID */}
                    <View style={{ width: columnInside }}>
                        <View style={styles.divisionLine} />
                        <TouchableOpacity
                            style={[styles.btnStandard, { marginTop: 10, marginBottom: 20 }]}
                            onPress={() => handleSave()}
                        >
                            <Text style={styles.textoInput}>Salvar</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>


            </View>



            <View style={styles.lineBottom}>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => navigation.navigate('AgendaPersonal')}>
                    <Ionicons name={'calendar'} size={30} style={{ color: '#0F0', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => { }}>
                    <Ionicons name={'settings'} size={30} style={{ color: '#888', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => navigation.navigate('DashPersonal')}>
                    <Ionicons name={'home'} size={30} style={{ color: '#F54', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => navigation.navigate('AccountPersonal')}>
                    <Ionicons name={'person'} size={30} style={{ color: '#0F0', }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnBottom}
                    onPress={() => signOut()}>
                    <Ionicons name={'power'} size={30} style={{ color: '#F00', }} />
                </TouchableOpacity>
            </View>
        </SafeAreaView >
    )
}
export default EditShowGrade