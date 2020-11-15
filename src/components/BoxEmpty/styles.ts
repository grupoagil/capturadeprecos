import { RectButton } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Content = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: 35%;
`

export const BoxTitle = styled.Text`
  font-family: 'Poppins_600SemiBold';
  padding: 2px 0px 20px;
  font-size: 18px;
  color: #333;
`
 
export const ButtonNavigate = styled(RectButton)`
  padding: 16px 40px;
  border-radius: 15px;
  background: #DE5F5F;
` 
export const ButtonNavigateText = styled.Text`
  color: #fff;
  font-family: 'Poppins_700Bold';
  font-size: 16px;
`
