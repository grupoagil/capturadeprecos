import 'react-native-gesture-handler';
import React from 'react';
import { 
  Poppins_400Regular, 
  Poppins_600SemiBold, 
  Poppins_700Bold,
  Poppins_500Medium,
} from '@expo-google-fonts/poppins'
import { useFonts } from 'expo-font'

import Routes from './src/routes';

import { AuthProvider } from './src/contexts/auth';
import axios from 'axios';

const App: React.FC = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_500Medium,
  })

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;
