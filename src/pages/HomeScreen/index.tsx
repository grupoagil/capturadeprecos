import React, { useState, useContext } from 'react';
import {
	Container,
	Title,
	Form,
	Input,
	TextInput,
	Button,
	ButtonText
} from './styles';

import { StatusBar, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

import { AuthContext } from '../../contexts/auth';

import Loading from '../../components/Loading';

const HomeScreen: React.FC = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const { signIn } = useContext(AuthContext);

	async function handleSignIn() {
			setIsLoading(true);
			if (!email || !password) {
					Alert.alert('Todos os campos devem ser preenchidos!')
			} else {
					try {
							const response = await signIn({ _email: email, password });
							if (response === true) {
									console.log('Sucesso');
							} else {
									Alert.alert('Algum erro ocorreu. Tente novamente.');
							}
					} catch(err) {
							console.log(err)
					}
			}
			setIsLoading(false);    
	}
	return(
			<>
				<StatusBar barStyle='light-content' backgroundColor='#DE5F5F' />
				<KeyboardAvoidingView
						style={{ flex: 1 }}
						behavior={Platform.OS === 'ios' ? 'padding' : undefined}
						
				>
						<TouchableWithoutFeedback
								onPress={() => Keyboard.dismiss()}
						>
								<Container>
										<Title>Captura de Preços</Title>
												{
														isLoading === true ?
														<Loading />
														: 
														undefined
												}
										<Form>
												<Input>
														<Feather name="mail" size={24} color="#DE5F5F" />
														<TextInput 
																placeholder='E-mail' 
																placeholderTextColor='#565651'
																value={email}
																onChangeText={value => setEmail(value)}
														/>
												</Input>
												<Input margin={15} >
														<Feather name="lock" size={24} color="#DE5F5F" />
														<TextInput 
																placeholder='Senha' 
																placeholderTextColor='#565651'
																secureTextEntry={true}
																value={password}
																onChangeText={value => setPassword(value)}
														/>
												</Input>
												<Button
														onPress={handleSignIn}
												>
														<MaterialCommunityIcons name="login" size={24} color="#FFFFFF" style={{ marginRight: 5 }} />
														<ButtonText>Login</ButtonText>
												</Button>
										</Form>
								</Container>
						</TouchableWithoutFeedback>
				</KeyboardAvoidingView>
			</>
	)
}

export default HomeScreen;