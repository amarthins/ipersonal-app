import React, { useState, useEffect, useContext } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { AuthContext } from '../src/contexts/auth'
import styles from '../src/style'

const NoNetwork = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.message}>Sem conexão com a internet.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: {
        fontSize: 18,
        color: 'red',
    },
});

export default NoNetwork;