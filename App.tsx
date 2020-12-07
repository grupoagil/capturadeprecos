import 'react-native-gesture-handler';
import React from 'react';
import { useFonts } from 'expo-font'
import { AuthProvider } from './src/contexts/auth';
import Reactotron, { asyncStorage } from 'reactotron-react-native'

import { 
  Poppins_400Regular, 
  Poppins_600SemiBold, 
  Poppins_700Bold,
  Poppins_500Medium,
} from '@expo-google-fonts/poppins'

import Routes from './src/routes';
import AsyncStorage from '@react-native-community/async-storage';

console.tron = Reactotron
  .setAsyncStorageHandler(AsyncStorage)
  // Your real ip address 👇
  .configure({ host: '192.168.0.163' })
  .useReactNative()
  .use(asyncStorage({ ignore: ['secret'] }))
  .connect()

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
