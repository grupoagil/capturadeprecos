import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../pages/HomeScreen';
import EstablishmentSelect from '../pages/EstablishmentSelect';
import ProductsCataloged from '../pages/ProductsCataloged';
import Products from '../pages/Products/';

import { AuthContext } from '../contexts/auth';

import Loading from '../components/Loading';

const Stack = createStackNavigator();

const Routes: React.FC = () => {
  const { user, isLoading } = useContext(AuthContext);

  if(isLoading === true) {
    return <Loading />
  }
  

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Home"
      >
        {
          !!user ?
          <>
            <Stack.Screen name="EstablishmentSelect" component={EstablishmentSelect} />
            <Stack.Screen name="Products" component={Products} />
            <Stack.Screen name="ProductsCataloged" component={ProductsCataloged} />
          </>
          :
          <Stack.Screen name="Home" component={HomeScreen} />
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;