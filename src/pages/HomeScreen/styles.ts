import { Pressable } from 'react-native';
import styled from 'styled-components/native';

interface Props {
	margin?: number;
}

export const Container = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;

	background: #DE5F5F;
`;

export const Title = styled.Text`
	font-size: 35px;
	font-family: 'Poppins_700Bold';
	color: #FFFFFF;
`;

export const Form = styled.View`
	width: 335px;
	height: 266px;
	background: #FFFFFF;
	border-radius: 15px;
	margin-top: 23px;

	align-items: center;
	justify-content: center;

`;

export const Input = styled.View<Props>`
	width: 252px;
	height: 50px;
	border-bottom-width: 1px;
	border-bottom-color: #DE5F5F;

	flex-direction: row;
	align-items: center;

	margin-top: ${props => props.margin ? props.margin : `0`}px;
`;

export const TextInput = styled.TextInput `
	flex: 1;
	color: #565651;
	font-family: 'Poppins_400Regular';
	font-size: 17px;
	margin-left: 10px;
`;


export const Button = styled(Pressable) `
	width: 252px;
	height: 50px;
	border-radius: 7px;
	background: #DE5F5F;
	margin-top: 15px;

	flex-direction: row;
	justify-content: center;
	align-items: center;
`;

export const ButtonText = styled.Text `
	color: #FFFFFF;
	font-family: 'Poppins_700Bold';
	font-size: 18px;
	margin-left: 5px;
`;

export const Logo = styled.Image`
	width: 100px;
	height: 100px;
	border-radius: 50px;
	margin-bottom: -10px;
`