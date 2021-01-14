import React, { useCallback, useEffect, useState } from 'react';
// import { Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import marketThumb from '../../assets/images/marketThumb.png';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import api from '../../services/api';
import Loading from '../../components/Loading';

import {
  Container,
  Header,
  Thumbnail,
  HeaderTitleContainer,
  SupermarketName,
  Title,
  SessionCard,
  SessionName,
} from './styles';

const Session: React.FC = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [sessions, setSessions] = useState([]);

  function isOnline () {
    NetInfo.fetch().then(async (state) => {
      await AsyncStorage.setItem('@online', state.isConnected.toString())
      getSession();
    });
  }

  async function getSession () {
    try {
      const online = await AsyncStorage.getItem('@online');
      if (online !== "true") {
        const databaseData = await AsyncStorage.getItem('@DatabaseALL') as string
        setSessions(
          JSON.parse(databaseData).paraCatalogar[route.params.EMP_ID].secao !== undefined ?
            Object.keys(JSON.parse(databaseData).paraCatalogar[route.params.EMP_ID].secao) as any
            : [])
      } else {
        setIsLoading(true)
        const token = await AsyncStorage.getItem('@Formosa:token')
        const response = await api.get(`/captura/empresas/${route.params.EMP_ID}/secoes`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        await AsyncStorage.setItem('@Session:capturar', JSON.stringify(response.data))
        const getSaveSession = await AsyncStorage.getItem('@Session:capturar') as string
        setSessions(JSON.parse(getSaveSession));
        setIsLoading(false)
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    isOnline();
  }, [])

  return (
    <Container>
      <Header>
        <MaterialIcons
          name="chevron-left"
          size={32}
          color="black"
          onPress={() => navigation.goBack()}
        />
        <Thumbnail
          source={marketThumb}
          style={{ resizeMode: 'cover' }}
        />
        <HeaderTitleContainer>
          <SupermarketName>{route.params.EMP_NAME}</SupermarketName>
        </HeaderTitleContainer>
      </Header>
      <Title>Sessão</Title>

      {isLoading === true ? <Loading /> : (

        <ScrollView contentContainerStyle={{ alignItems: 'center', width: "100%" }}>

          {sessions.map(session => (
            <View key={session} style={{ width: "100%", alignItems: "center" }}>
              <SessionCard onPress={() => navigation.navigate('Products', {
                EMP_ID: route.params.EMP_ID,
                SESSION: session,
                EMP_NAME: route.params.EMP_NAME.trim(),
              })}>
                <SessionName>{session}</SessionName>
              </SessionCard>
            </View>
          )
          )}
        </ScrollView>
      )}

    </Container>
  )
}

export default Session;