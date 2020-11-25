import { Pressable } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import styled from 'styled-components/native';


export const Container = styled.View`
	flex: 1;
	background: #FFF;
`;

export const Header = styled.View`
	width: 100%;
	height: 15%;
	padding: 20px;

	flex-direction: row;
	align-items: center;
`;

export const Thumbnail = styled.Image`
	width: 85px;
	height: 85px;
	border-radius: 42.5px;

	margin-left: 15px;
`;

export const HeaderTitleContainer = styled.View`
	flex: 1;
	margin-left: 15px;  
	align-items: flex-end;
`;

export const SupermarketName = styled.Text`
	font-size: 25px;
	line-height: 26px;
	font-family: 'Poppins_700Bold';
	color: #565651;
`;

export const Title = styled.Text`
	font-family: 'Poppins_600SemiBold';
	font-size: 21px;
	margin: 10px 20px;
	color: #565651;
`;

export const ItemContainer = styled.View`
	background: #f4f4f4;
	margin: 5px 0px;
	padding: 10px 15px;
	border-radius: 12px;
`

export const SessionCard = styled(RectButton)`
  width: 90%;
	height: 100px;
	margin-top: 5px;
	margin-bottom: 10px;

	align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #d1cfcf;
`
export const SessionName = styled.Text`
  font-family: 'Poppins_700Bold';
	font-size: 20px;
	max-width: 85%;
`