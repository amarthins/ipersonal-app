import React, { useState, useEffect, useContext } from "react";
import { TouchableOpacity, ScrollView, ImageBackground, Alert, Image, Button, Text, View, } from "react-native";
import styles from '../src/styles'
import { SafeAreaView } from "react-native-safe-area-context"
import * as Animatable from 'react-native-animatable'

const WelcomeScreen = ({ route, navigation }) => {

  const handleDirect = (opcao) => {
    if (opcao === 'aluno') {
      navigation.navigate('LoginScreen', { opcao: opcao })
    } else if (opcao === 'cadastro') {
      navigation.navigate('CadastroScreen')
    }
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("../src/assets/personal-aluna.png")}
        style={styles.background}>

        <View style={styles.wrapperLogo}>
          <Animatable.Image
            delay={300}
            animation="flipInY"
            style={[styles.logo, { height: 100, marginTop: 40 }]}
            source={require('../src/assets/logo-negativo.png')}
          />
        </View>

        <View style={styles.wrapperBottom}>
          <Text style={[styles.textoHeader, { color: '#FFF', paddingBottom: 20, }]}>Escolha o tipo de cadastro</Text>
          <TouchableOpacity
            style={[styles.btnStandard, { marginBottom: 10 }]}
            onPress={() => navigation.navigate('CadastroScreen',{opcao:'personal'})}>
            <Text style={styles.textoBtn}>personal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnStandard, { backgroundColor: '#ADC429' }]}
            onPress={() => navigation.navigate('CadastroScreen',{opcao:'aluno'})}>
            <Text style={styles.textoBtn}>aluno</Text>
          </TouchableOpacity>

          <View style={{ paddingTop: 30, }} />
        </View>

      </ImageBackground>
    </SafeAreaView>

  );
}

export default WelcomeScreen