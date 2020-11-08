import React from 'react';
import { CommonActions, useNavigation, useNavigationState } from '@react-navigation/native'

import { Container, BoxIcon, ButtonNavigate, ButtonNavigateText, BoxTitle } from './styles';
import boxIcon from '../../assets/images/box.png'

const BoxEmpty: React.FC = () => {
  const navigation = useNavigation()

  function handleNavigateToEmpSelect() {
    navigation.dispatch(
      CommonActions.navigate('EstablishmentSelect')
    )
  }

  return (
    <Container>
      
      <BoxIcon source={boxIcon} />
      <BoxTitle>Sem produtos para catalogar</BoxTitle>

      <ButtonNavigate onPress={handleNavigateToEmpSelect}>
        <ButtonNavigateText>OK</ButtonNavigateText>
      </ButtonNavigate>

    </Container>
  )
}

export default BoxEmpty;