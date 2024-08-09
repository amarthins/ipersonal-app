import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native'
import Router from './src/routes/Router'
import AuthProvider from './src/context/auth'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'

const theme = {
  ...DefaultTheme,
  roundness: 10,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0096DB',
    onPrimaryContainer: '#198AD3',
    secondary: '#3498db',
    accent: '#198AD3',
    placeholder: '#FFF',
    background: '#E8F8FF',
    onBackground: '#FCC',
    surface: '#555',
    onSurface: '#555',
    text: '#555',
    outline: '#DDD',
    surfaceDisabled: '#CCC',
    onSurfaceDisabled: '#CCC',
  },
};

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <PaperProvider theme={theme}>
          <Router />
        </PaperProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
