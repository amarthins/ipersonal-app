import React, { useState, useContext } from 'react';
import { Modal, View, Text, Button, TouchableOpacity } from 'react-native';
import styles from '../styles'
import { Ionicons } from '@expo/vector-icons'


const ModalComponent = ({ visible, closeModal, title, content, onPressConfirm }) => {

    return (
        <Modal
            animationType={"slide"}
            transparent={true}
            visible={visible}
            onRequestClose={closeModal}
        >
            <View style={styles.wrapperModal}>
                <View style={styles.modalContent}>
                    <TouchableOpacity
                        style={styles.btnCloseModal}
                        onPress={closeModal}
                    >
                        <Ionicons name="close-circle" size={25} color="#F00" />
                    </TouchableOpacity>

                    <Text style={[styles.textoHeader, { color: '#333' }]}>{title}</Text>
                    <Text style={[styles.textoRegular, { paddingTop: 10, color: '#333' }]}>{content}</Text>

                    <View style={styles.lineBtnModal}>
                        <TouchableOpacity
                            onPress={closeModal}
                            style={[styles.btnStandard, { backgroundColor: '#FF0', maxWidth: '100%' }]}>
                            <Text style={styles.textoBtn}>Fechar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btnStandard, { backgroundColor: '#BDFF00', maxWidth: '48%',marginLeft:10 }]}
                            onPress={onPressConfirm}
                        >
                            <Text style={styles.textoBtn}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ModalComponent;
