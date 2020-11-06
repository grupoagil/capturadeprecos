import React, { useContext, useState, useEffect } from 'react';
import {
	Container,
	Header,
	HeaderText,
	Content,
	Title,
	Card,
	List,
	Thumbnail,
	CardTextContainer,
	CardText
} from './styles';

import {
	StatusBar,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AuthContext } from '../../contexts/auth';

import api from '../../services/api';

import AsyncStorage from '@react-native-community/async-storage';

import Loading from '../../components/Loading';

const EstablishmentSelect: React.FC = ({ navigation }) => {

	const [fetchedData, setFetchedData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const { signOut, user } = useContext(AuthContext);

	async function fetchData() {
			const token = await AsyncStorage.getItem('@Formosa:token');
			setIsLoading(true);
			try {

					const response = await api.get(
							`/captura/empresas`, {
							headers: {
									Authorization: `Bearer ${token}`
							}
					}
					);

					setFetchedData(Object.values(response.data));
					setIsLoading(false);
			} catch (err) {
					console.log(err);

					setFetchedData(signOut)
					setIsLoading(false);
			}
			setIsLoading(false);
	}

	useEffect(() => {
			fetchData();
	}, [])


	return (
			<>
					<StatusBar barStyle='light-content' backgroundColor='#DE5F5F' />
					<Container>
							<Header>
									<MaterialCommunityIcons
											name="logout"
											size={31}
											color='#FFFFFF'
											onPress={signOut}
									/>
									<HeaderText>Olá, {user ? user.name : ''}!</HeaderText>
							</Header>
							{
									isLoading === true ?
											<Loading />
											:
											<Content>
													<Title>Selecione o estabelecimento</Title>
													<List
															contentContainerStyle={{
																	paddingHorizontal: 20
															}}
															ListEmptyComponent={() => {
																	return (
																			<Title>
																					Sem estabelecimentos aqui.
																			</Title>
																	);
															}}
															showsVerticalScrollIndicator={false}
															horizontal={false}
															numColumns={2}
															data={fetchedData}
															keyExtractor={(item) => String(item.id)}
															renderItem={({ item, index }) => {
																	return (
																			<Card
																					onPress={() => {
																							navigation.navigate('Products', {
																									EMP_ID: item.id,
																									EMP_THUMB: item.EMP_LOGO,
																									EMP_NAME: item.EMP_NOME.trim()
																							})
																					}}
																					style={index % 2 === 0 ? { marginRight: 2.5 } : { marginLeft: 2.5 }}
																			>
																					<Thumbnail source={{ uri: item.EMP_LOGO }} style={{ resizeMode: 'cover' }} />
																					<CardTextContainer>
																							<CardText>{item.EMP_NOME.trim()}</CardText>
																					</CardTextContainer>
																			</Card>
																	);
															}}
													/>
											</Content>
							}
					</Container>
			</>
	)
}

export default EstablishmentSelect;