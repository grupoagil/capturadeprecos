import React, { useCallback, useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import marketThumb from '../../assets/images/marketThumb.png';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView, View } from 'react-native';

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

  const [sessions, setSessions] = useState([])

  async function getSession () {
    setIsLoading(true)

    try {
      const token = await AsyncStorage.getItem('@Formosa:token')
      const response = await api.get(`/captura/catalogados/empresas/${route.params.EMP_ID}/secoes`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      await AsyncStorage.setItem('@Session:capturado', JSON.stringify(response.data))
      const getSaveSession = await AsyncStorage.getItem('@Session:capturado') as string

      setSessions(JSON.parse(getSaveSession))
      setIsLoading(false)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getSession()
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
              <SessionCard onPress={() => navigation.navigate('ProductsCataloged', {
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