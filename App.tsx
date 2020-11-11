import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import OneSignal from 'react-native-onesignal'

import { 
  Poppins_400Regular, 
  Poppins_600SemiBold, 
  Poppins_700Bold,
  Poppins_500Medium,
} from '@expo-google-fonts/poppins'
import { useFonts } from 'expo-font'

import Routes from './src/routes';

import { AuthProvider } from './src/contexts/auth';

const App: React.FC = () => {

  useEffect(() => {
    OneSignal.init('93b51e57-07a7-49ad-944a-797b2762521e')

    OneSignal.addEventListener('opened', onOpened)

    return () => OneSignal.removeEventListener('opened', onOpened)

  }, [])

  function onOpened(result) {
    console.log('Mensagem: ', result.notification.payload.body)
    console.log('Result: ', result)
  }

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
