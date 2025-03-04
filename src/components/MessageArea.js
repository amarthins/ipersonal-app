import React, { useState, useEffect, useContext } from 'react';
import { Modal, View, Text, Button, TouchableOpacity } from 'react-native';
import styles from '../styles'
import { Ionicons } from '@expo/vector-icons'
import Animated, { Easing, useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';


const MessageArea = ({ visible, closeModal,navegaTela, title, content }) => {

    const opacity = useSharedValue(0);

    const toggleModal = () => {
        //setVisible(!visible);
    };

    useEffect(() => {
        if (visible) {
            opacity.value = withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) });
        } else {
            opacity.value = withTiming(0, { duration: 500, easing: Easing.inOut(Easing.ease) });
        }
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    })

    return (
        <Modal
            animationType={"slide"}
            transparent={true}
            visible={visible}
            onRequestClose={closeModal}
        >
            <View style={[styles.wrapperModal, { paddingLeft: 0, paddingRight: 0 }]}>
                <Animated.View style={[styles.wrapperContentMessage, animatedStyle]}>

                    <Text style={[styles.textoLabel, { paddingTop: 20, lineHeight: 30, color: '#333' }]}>{content}</Text>

                    <View style={{}}>
                        <TouchableOpacity
                            style={styles.btnMessage}
                            onPress={closeModal}
                        >
                            <Text style={[styles.textoLabel, { color: '#333' }]}>Tentar novamente</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btnMessage, { backgroundColor: '#FFF' }]}
                            onPress={navegaTela}
                        >
                            <Text style={[styles.textoLabel, { color: '#333' }]}>Não sei minha senha</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    )
}
export default MessageArea
