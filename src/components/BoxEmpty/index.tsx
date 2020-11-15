import React from 'react';
import { useNavigation } from '@react-navigation/native'

import { Container, ButtonNavigate, ButtonNavigateText, BoxTitle, Content } from './styles';

const BoxEmpty: React.FC = () => {
  const navigation = useNavigation()

  function handleNavigateToEmpSelect() {
    navigation.navigate('EstablishmentSelect')
  }

  return (
    <Container>
      
      <Content>
        <BoxTitle>Sem produtos para pesquisar</BoxTitle>

        <ButtonNavigate onPress={handleNavigateToEmpSelect}>
          <ButtonNavigateText>OK</ButtonNavigateText>
        </ButtonNavigate>
      </Content>
     

    </Container>
  )
}

export default BoxEmpty;