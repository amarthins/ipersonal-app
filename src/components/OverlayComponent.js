import React, { useState, useContext } from 'react';
import { Modal, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import styles from '../styles'
import { AuthContext } from '../context/auth'
import { currency, mask, unMask } from 'remask'

const OverlayComponent = ({ visible }) => {

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
        >
            <View style={styles.wrapperModal}>
                <ActivityIndicator size={30} color={'#FFF'} />
            </View>
        </Modal>
    );
};

export default OverlayComponent;
