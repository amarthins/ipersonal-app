import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import config from '../src/config/index.json'
import { AuthContext } from '../src/context/auth'

const LocaisMap = ({ navigation }) => {

    const { releaseLocal, saveLocal, getDadosDisponiveis } = useContext(AuthContext)

    const mapRef = useRef(null);
    const SEARCH_RADIUS = 5000;
    const SP_COORDS = {
        latitude: -23.5505,
        longitude: -46.6333,
    };

    const [userLocation, setUserLocation] = useState(SP_COORDS);
    const [gyms, setGyms] = useState([]);
    const [selectedGym, setSelectedGym] = useState(null);
    const [region, setRegion] = useState({
        ...SP_COORDS,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });
    const [academias, setAcademias] = useState(null);
    const [userGyms, setUserGyms] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            const dados = await getDadosDisponiveis()
            setAcademias(dados.locais)
            fetchNearbyGyms(dados.locais);
        })
        return unsubscribe
    }, [navigation])

    useEffect(() => {
        //fetchNearbyGyms();
    }, []);

    const fetchUserGyms = async () => {
        try {
            const academias = await getDadosDisponiveis(); // sua função existente
            setUserGyms(academias.locais || []);
        } catch (error) {
            console.error('Erro ao buscar academias do usuário:', error);
        }
    };

    // Adicionar ao useEffect inicial
    useEffect(() => {
        fetchUserGyms();
    }, []);

    const isGymSaved = (placeId) => {
        return userGyms.some(userGym => userGym.place_id === placeId);
    };

    const fetchNearbyGyms = async (academy) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${SP_COORDS.latitude},${SP_COORDS.longitude}&radius=${SEARCH_RADIUS}&type=gym&key=${config.googleApi}`
            );

            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const gymsList = data.results.map(gym => ({
                    id: gym.place_id,
                    name: gym.name,
                    latitude: gym.geometry.location.lat,
                    longitude: gym.geometry.location.lng,
                    address: gym.vicinity,
                    rating: gym.rating,
                    distance: calculateDistance(
                        SP_COORDS.latitude,
                        SP_COORDS.longitude,
                        gym.geometry.location.lat,
                        gym.geometry.location.lng
                    )
                }));

                const sortedGyms = gymsList.sort((a, b) => a.distance - b.distance);
                setGyms(sortedGyms);

                if (mapRef.current && gymsList.length > 0) {
                    const coordinates = [
                        SP_COORDS,
                        ...gymsList.map(gym => ({
                            latitude: gym.latitude,
                            longitude: gym.longitude,
                        }))
                    ];

                    mapRef.current.fitToCoordinates(coordinates, {
                        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                        animated: true,
                    });
                }
            }
        } catch (error) {
            console.error('Erro ao buscar academias:', error);
        }
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Raio da Terra em km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distância em km
        return distance;
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    const handleSelecao = (gym) => {
        setSelectedGym(gym);
    };

    const CustomMarkerUser = () => (
        <View style={styles.customMarker}>
            <Ionicons name="person" size={30} color="#007AFF" />
            <View style={styles.markerTriangle} />
        </View>
    );

    const CustomMarkerGym = ({ isSaved }) => (
        <View style={styles.customMarker}>
            <View style={[
                styles.gymMarkerContainer,
                isSaved && styles.gymMarkerContainerSaved
            ]}>
                <Ionicons name="barbell" size={24} color="#FFFFFF" />
            </View>
            <View style={[
                styles.markerTriangle,
                styles.gymMarkerTriangle,
                isSaved && styles.gymMarkerTriangleSaved
            ]} />
        </View>
    );

    const handleSaveGym = async (gym) => {
        const salvar = await saveLocal(gym)
        if (salvar.status === 200) {
            navigation.goBack()
        } else {
            alert('Erro ao salvar academia:', salvar)
        }
    };

    const excluirLocais = async (gym) => {
        const excluir = await releaseLocal(gym)
        if (excluir.status === 200) {
            navigation.goBack()
        } else {
            alert('Erro ao salvar academia:', excluir.mensagem)
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={region}
                >
                    <Marker
                        coordinate={SP_COORDS}
                        title="Localização Atual"
                    >
                        <CustomMarkerUser />
                    </Marker>

                    {gyms.map(gym => (
                        <Marker
                            key={gym.id}
                            coordinate={{
                                latitude: gym.latitude,
                                longitude: gym.longitude,
                            }}
                            title={gym.name}
                            description={gym.address}
                            onPress={() => handleSelecao(gym)}
                        >
                            <CustomMarkerGym isSaved={isGymSaved(gym.id)} />
                        </Marker>
                    ))}
                </MapView>
            </View>

            {selectedGym && (
                <View style={styles.gymCard}>
                    <Text style={styles.gymName}>{selectedGym.name}</Text>
                    <Text style={styles.gymAddress}>{selectedGym.address}</Text>
                    <Text style={styles.gymDistance}>
                        Distância: {selectedGym.distance.toFixed(2)} km
                    </Text>
                    {selectedGym.rating && (
                        <Text style={styles.gymRating}>
                            Avaliação: {selectedGym.rating} ⭐
                        </Text>
                    )}
                    {isGymSaved(selectedGym.id) ? (
                        <TouchableOpacity 
                            style={[styles.selectButton, styles.removeButton]}
                            onPress={() => excluirLocais(selectedGym)}
                        >
                            <Text style={styles.selectButtonText}>
                                Liberar Academia
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity 
                            style={styles.selectButton}
                            onPress={() => handleSaveGym(selectedGym)}
                        >
                            <Text style={styles.selectButtonText}>
                                Selecionar Academia
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mapContainer: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    gymCard: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1000,
    },
    gymName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    gymAddress: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    gymDistance: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    gymRating: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    selectButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 5,
    },
    selectButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    searchButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    debugInfo: {
        position: 'absolute',
        top: 80,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 10,
        borderRadius: 5,
    },
    debugText: {
        color: 'white',
        fontSize: 12,
    },
    customMarker: {
        alignItems: 'center',
    },
    markerTriangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#007AFF',
        transform: [{ rotate: '180deg' }],
        marginTop: -3,
    },
    gymMarkerContainer: {
        backgroundColor: '#FF3B30', // cor vermelha do iOS
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    gymMarkerTriangle: {
        borderTopColor: 'transparent',
    },
    gymMarkerContainerSaved: {
        backgroundColor: '#34C759',
    },
    gymMarkerTriangleSaved: {
        borderTopColor: '#34C759',
    },
    removeButton: {
        backgroundColor: '#FF3B30', // vermelho para o botão de liberar
    },
});

export default LocaisMap; 