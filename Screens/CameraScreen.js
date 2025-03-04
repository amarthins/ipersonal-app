import { useRef, useContext, useEffect, useState } from "react"
import { Camera, CameraView, useCameraPermissions, CameraType } from 'expo-camera'
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator'
import { Text, Button, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import { Ionicons } from "@expo/vector-icons"
import styles from '../src/styles'
import { AuthContext } from '../src/context/auth'
import { LocalTile } from "react-native-maps"


const CameraScreen = ({ navigation, route }) => {

    const { storeObject } = useContext(AuthContext)

    const [facing, setFacing] = useState('back');

    const [imagem, setImagem] = useState(null)
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [loading, setLoading] = useState(false)
    const [type, setType] = useState(CameraType?.back)
    const referencia = route.params?.referencia || null
    const [permission, requestPermission] = useCameraPermissions()
    const cameraRef = useRef(null)

    useEffect(() => {
        const unsubscribeFocus = navigation.addListener('focus', () => {
            setIsCameraReady(true)
        });
        const unsubscribeBlur = navigation.addListener('blur', () => {
            setIsCameraReady(false)
        });
        return () => {
            unsubscribeFocus();
            unsubscribeBlur();
        };
    }, [navigation]);

    const takePicture = async () => {
        if (cameraRef) {

            const photo = await cameraRef.current.takePictureAsync({ base64: true })
            setLoading(true)

            let resizedPhoto = await manipulateAsync(
                photo.uri,
                [{ resize: { width: 1000 } }],
                { compress: 1, format: SaveFormat.PNG, base64: false }
            )

            if (resizedPhoto.uri != null) {
                if (referencia === 'PendingScreen' || referencia === 'AccountPersonal') {

                    await storeObject('@avatar', resizedPhoto.uri)

                } else if (referencia === 'SelectImageScreen') {

                    await storeObject('@avatar', resizedPhoto)

                } else if (referencia === 'MomentosForm') {
                    await storeObject('@fotos', resizedPhoto)
                } else if (referencia === 'ListaFiles') {
                    await storeObject('@fotoConsulta', resizedPhoto)
                } else {
                    await storeObject('@imagem', resizedPhoto)
                }
                //setLoading(false)
                navigation.navigate(referencia)

            } else {
                setLoading(false)
                alert('Falha ao salvar a foto no banco de imagens')
            }
        }
    }

    const cancelCamera = () => {
        navigation.navigate(referencia)
    }

    if (loading) {
        return (
            <View style={styles.containerLoading}>
                <ActivityIndicator size="large" color="white" />
            </View>
        )
    }

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.containerLoading}>
                <Text style={[styles.textoLabel, { color: '#FFF' }]}>
                    Você precisa permitir o uso da câmera!{'\n'}
                </Text>
                <TouchableOpacity
                    onPress={() => requestPermission()}
                    style={styles.btnScreen}
                >
                    <Text style={[styles.textoLabel, { color: '#FFF' }]}>
                        AUTORIZAR O USO
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    if (!isCameraReady) {
        return <View />; // Retorna uma view vazia ou algum placeholder enquanto a câmera não está pronta
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>

            <CameraView style={styles.cameraInBound} facing={facing} ref={cameraRef}>
                <View style={styles.wrapperBtnCamera}>
                    <TouchableOpacity
                        style={styles.btnCamera}
                        onPress={() => cancelCamera()}
                    >
                        <Ionicons name="close-circle" size={40} color={'#F00'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.btnCamera}
                        onPress={toggleCameraFacing}
                    >
                        <Ionicons name="camera-reverse" size={40} color={'#FFF'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.btnCamera}
                        onPress={takePicture}
                    >
                        <Ionicons name="camera" size={40} color={'#0F0'} />
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
}
export default CameraScreen
