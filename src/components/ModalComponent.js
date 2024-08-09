import React, { useState, useContext } from 'react';
import { Modal, View, Text, Button, TouchableOpacity } from 'react-native';
import styles from '../styles'
import { Ionicons } from '@expo/vector-icons'


const ModalComponent = ({ visible, closeModal, title, content }) => {

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
                        style={{ flex: 0, alignSelf: "flex-end", alignItems: "flex-end", backgroundColor: "transparent", }}
                        onPress={closeModal}
                    >
                        <Ionicons name="close-circle" size={25} color="#F00" />
                    </TouchableOpacity>
                    
                    <Text style={styles.textoHeader}>{title}</Text>
                    <Text style={[styles.textoRegular, { paddingTop: 10 }]}>{content}</Text>

                    <View style={styles.wrapperBtnModal}>
                        <TouchableOpacity
                            style={[styles.btnStandard, { backgroundColor: '#FF0', position: 'absolute', bottom: 10 }]}
                            onPress={closeModal}
                        >
                            <Text style={styles.textoBtn}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ModalComponent;
