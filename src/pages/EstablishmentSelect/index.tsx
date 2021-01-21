import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { StatusBar, RefreshControl, Platform, Button, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/auth';
import AsyncStorage from '@react-native-community/async-storage';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import NetInfo from '@react-native-community/netinfo';

import { useIsFocused } from "@react-navigation/native";

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

	const isFocused = useIsFocused()


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

	function isOnline () {
		NetInfo.fetch().then(async (state) => {
			await AsyncStorage.setItem('@online', state.isConnected.toString())
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
		return token;
	}

	const [fetchedData, setFetchedData] = useState([]);
	const [cataloged, setCataloged] = useState([])
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingSync, setIsLoadingSync] = useState(false);
	const [progressSync, setProgressSync] = useState(0);
	const [syncIsavailable, setSyncIsavailable] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false)

	const { signOut, user } = useContext(AuthContext);


	api.interceptors.response.use(
		response => {
			return response
		},
		error => {
			if (error.response && error.response.status === 401) {
				signOut()
			}
			return Promise.reject(error)
		}
	)

	async function getAllData () {
		try {
			const token = await AsyncStorage.getItem('@Formosa:token');
			const offlineSend = await AsyncStorage.getItem('@Database:offlineSend') as string
			//alert('Meu alerta:' + offlineSend)
			if (offlineSend !== '' && offlineSend !== null) {
				setSyncIsavailable(JSON.parse(offlineSend).length > 0)
			}
			const response = await api.get(
				`captura/all`, {
				headers: {
					Authorization: `Bearer ${token}`
				}

			});
			await AsyncStorage.setItem("@DatabaseALL", JSON.stringify(response.data))
		} catch (error) {
			setSyncIsavailable(false)
			console.log(error)
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

	function AlertSync () {
		Alert.alert(
			'Deseja Sincronizar dados? ',
			'Dados offline disponiveis.',
			[
				{
					text: 'Sair',
					style: 'cancel'
				},
				{ text: 'OK', onPress: sendOffline }
			]
		);
	}

	async function sendOffline () {
		await isOnline()
		const online = await AsyncStorage.getItem('@online');
		if (online !== "true") {
			Alert.alert(
				'Você Está Offline!',
				'Conecte-se a internet para sincronizar os dados.',
				[
					{
						text: 'OK',
						style: 'cancel'
					}
				]
			);
			setSyncIsavailable(false);
		} else {
			const offlineSend = JSON.parse(await AsyncStorage.getItem('@Database:offlineSend') as string)
			setIsLoadingSync(true);
			setProgressSync(0);
			const handleArray = [] as any
			offlineSend.map((MYdata, i) => {
				setTimeout(async () => {

					try {

						const token = await AsyncStorage.getItem('@Formosa:token');

						if (MYdata.EAN !== undefined) {
							const data = new FormData()
							data.append('EMP_ID', MYdata.EMP_ID)
							data.append('EAN', MYdata.EAN)
							data.append('CAT_PRECO', MYdata.CAT_PRECO)
							data.append('CAT_SITUACAO', MYdata.CAT_SITUACAO)

							MYdata.IMG ?
								data.append('CAT_IMG', {
									name: `image_${MYdata.EAN}.jpg`,
									type: 'image/jpg',
									uri: MYdata.IMG
								} as any) : null

							const response = await api.post(`/captura/registrar`, data, {
								headers: {
									'Content-Type': 'multipart/form-data',
									Authorization: `Bearer ${token}`,
								}
							})
						} else {
							await api.post('/captura/concluir', {
								EMP_ID: MYdata.EMP_ID
							}, {
								headers: {
									Authorization: `Bearer ${token}`
								}
							}
							)
						}
					} catch (error) {
						console.log(error);
						handleArray.push(MYdata)
					}
					if (i + 1 === offlineSend.length) {
						setIsLoadingSync(false);
						handleRefresh()
						await AsyncStorage.setItem('@Database:offlineSend', JSON.stringify(handleArray))
					}
					setProgressSync(((i + 1) / offlineSend.length) * 100)

				}, 4000 * i);
			});
		}
	}

	async function handleRefresh (showAlert = true) {
		try {
			await isOnline()
			const online = await AsyncStorage.getItem('@online');
			if (online !== "true") {
				const databaseData = await AsyncStorage.getItem('@DatabaseALL') || ''
				setSyncIsavailable(false)
				if (databaseData.length > 0) {
					if (typeof JSON.parse(databaseData).paraCatalogar === 'object') {
						setFetchedData(Object.values(JSON.parse(databaseData).paraCatalogar));
					}
					if (typeof JSON.parse(databaseData).catalogados === 'object') {
						setCataloged(Object.values(JSON.parse(databaseData).catalogados));
					}
				}
				!showAlert || alert('Conecte a internet para atualizar os dados.\n\nSomente dados offline')
			} else if (!isLoadingSync) {
				setIsRefreshing(true)
				await getAllData()
				await fetchData()
				await getCataloged()
				setIsRefreshing(false)
			} else {
				await getAllData()
			}
		} catch (error) {
			alert(error)
		}
	}

	useEffect(() => {
		isOnline();
		handleRefresh(false);
	}, [isFocused])

	return (
		<>
			{isLoadingSync ? <Loading text="Sincronizando pesquisas offline." isFull progress={progressSync} /> : <></>}
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

					{syncIsavailable ? <MaterialCommunityIcons
						name="autorenew"
						size={31}
						color='#FFFFFF'
						onPress={AlertSync}
					/> : <></>}

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
										onPress={async () => {
											await isOnline()
											const online = await AsyncStorage.getItem('@online');
											if (online == 'true') {
												navigation.navigate('SessionCataloged', {
													EMP_ID: item.id,
													EMP_THUMB: item.EMP_LOGO,
													EMP_NAME: item.EMP_NOME.trim()
												})
											} else {
												Alert.alert(
													'Você Está Offline!',
													'Conecte-se a internet para modificar os pesquisados.',
													[
														{
															text: 'OK',
															style: 'cancel'
														}
													]
												);
											}
										}
										}
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