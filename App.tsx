import 'react-native-gesture-handler';
import React from 'react';
import { useFonts } from 'expo-font'
import { AuthProvider } from './src/contexts/auth';
import { 
  Poppins_400Regular, 
  Poppins_600SemiBold, 
  Poppins_700Bold,
  Poppins_500Medium,
} from '@expo-google-fonts/poppins'

import Routes from './src/routes';
import api from './src/services/api';

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
