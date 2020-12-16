import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { StatusBar, RefreshControl, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/auth';
import AsyncStorage from '@react-native-community/async-storage';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import NetInfo from '@react-native-community/netinfo';

import api from '../../services/api';

import Loading from '../../components/Loading';
import marketThumb from '../../assets/images/marketThumb.png';


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

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

const EstablishmentSelect: React.FC = ({ navigation }) => {

	const [expoPushToken, setExpoPushToken] = useState('');
	const [notification, setNotification] = useState(true);
	const notificationListener = useRef();
	const responseListener = useRef();

	useEffect(() => {
		registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

		// This listener is fired whenever a notification is received while the app is foregrounded
		notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
			setNotification(notification);
		});

		// This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
		responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
			console.log(response);
		});

		return () => {
			Notifications.removeNotificationSubscription(notificationListener);
			Notifications.removeNotificationSubscription(responseListener);
		};
	}, []);


	const [online, setOnline] = useState(true)
	function isOnline () {
		NetInfo.fetch().then(state => {
			setOnline(state.isConnected)
		});
	}


	async function registerForPushNotificationsAsync () {
		let token;
		if (Constants.isDevice) {
			const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
			let finalStatus = existingStatus;
			if (existingStatus !== 'granted') {
				const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
				finalStatus = status;
			}
			if (finalStatus !== 'granted') {
				alert('Failed to get push token for push notification!');
				return;
			}
			token = (await Notifications.getExpoPushTokenAsync()).data;
			console.log(token);
		} else {
			alert('Must use physical device for Push Notifications');
		}

		if (Platform.OS === 'android') {
			Notifications.setNotificationChannelAsync('default', {
				name: 'default',
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: '#FF231F7C',
			});
		}

		const userToken = await AsyncStorage.getItem('@Formosa:token');
		const response = await api.post('auth/push', {
			code: token
		},
			{
				headers: {
					Authorization: `Bearer ${userToken}`
				}
			})
		console.log(response.data)
		return token;
	}

	const [fetchedData, setFetchedData] = useState([]);
	const [cataloged, setCataloged] = useState([])
	const [isLoading, setIsLoading] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false)

	const { signOut, user } = useContext(AuthContext);


	api.interceptors.response.use(
		response => {
			return response
		},
		error => {
			if (error.response.status === 401) {
				signOut()
			}
			return Promise.reject(error)
		}
	)


	async function getAllData () {
		const token = await AsyncStorage.getItem('@Formosa:token');
		try {
			const response = await api.get(
				`captura/all`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			await AsyncStorage.setItem("@DatabaseALL", JSON.stringify(response.data))
			setIsLoading(false);
		} catch (err) {
			console.log(err)
		} finally {
			setIsLoading(false);
		}
	}

	async function fetchData () {
		const token = await AsyncStorage.getItem('@Formosa:token');
		setIsLoading(true);
		try {
			const response = await api.get(
				`/captura/empresas`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			await AsyncStorage.setItem("@Empresas:capturar", JSON.stringify(response.data))
			const getSaveData = await AsyncStorage.getItem('@Empresas:capturar') as string
			setFetchedData(Object.values(JSON.parse(getSaveData)));
			setIsLoading(false);
		} catch (err) {
			console.log(err)
		} finally {
			setIsLoading(false);
		}
	}

	async function getCataloged () {
		const token = await AsyncStorage.getItem('@Formosa:token');
		setIsLoading(true);
		try {
			const response = await api.get(
				`/captura/catalogados/empresas`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
			);
			await AsyncStorage.setItem('@Empresas:capturadas', JSON.stringify(response.data))
			const getSaveCaptured = await AsyncStorage.getItem('@Empresas:capturadas') as string
			setCataloged(Object.values(JSON.parse(getSaveCaptured)));
			setIsLoading(false);
		} catch (err) {
			console.log(err)
		}
		setIsLoading(false);
	}

	async function handleRefresh () {
		isOnline()
		if (!online) {
			const databaseData = await AsyncStorage.getItem('@DatabaseALL') as string
			setFetchedData(Object.values(JSON.parse(databaseData).paraCatalogar));
			setCataloged(Object.values(JSON.parse(databaseData).catalogados));
			alert('Conecte a internet para atualizar os dados.\n\nSomente dados offline');
		} else {
			setIsRefreshing(true)
			await getAllData()
			await fetchData()
			await getCataloged()
			setIsRefreshing(false)
		}
	}

	useEffect(() => {
		handleRefresh()
	}, [])

	return (
		<>
			<StatusBar barStyle='light-content' backgroundColor='#DE5F5F' />
			<Container
				refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
			>
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
					isLoading === true && !isRefreshing ?
						<Loading />
						:
						<Content>
							<Title>A pesquisar</Title>
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
								horizontal
								// numColumns={2}
								data={fetchedData}
								keyExtractor={(item) => String(item.id)}
								renderItem={({ item, index }) => {
									return (
										<Card
											onPress={() => {
												navigation.navigate('Session', {
													EMP_ID: item.id,
													EMP_THUMB: item.EMP_LOGO,
													EMP_NAME: item.EMP_NOME.trim()
												})
											}}
											style={index % 2 === 0 ? { marginRight: 2.5 } : { marginLeft: 2.5 }}
										>
											<Thumbnail source={marketThumb} style={{ resizeMode: 'cover' }} />
											<CardTextContainer>
												<CardText>{item.EMP_NOME.trim()}</CardText>
											</CardTextContainer>
										</Card>
									);
								}}
							/>
						</Content>
				}

				{isLoading === true && !isRefreshing ? <Loading /> :
					<Content>
						<Title>Pesquisados</Title>
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
							horizontal
							// numColumns={2}
							data={cataloged}
							keyExtractor={(item) => String(item.id)}
							renderItem={({ item, index }) => {
								return (
									<Card
										onPress={() => {
											navigation.navigate('SessionCataloged', {
												EMP_ID: item.id,
												EMP_THUMB: item.EMP_LOGO,
												EMP_NAME: item.EMP_NOME.trim()
											})
										}}
										style={index % 2 === 0 ? { marginRight: 2.5 } : { marginLeft: 2.5 }}
									>
										<Thumbnail source={marketThumb} style={{ resizeMode: 'cover' }} />
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