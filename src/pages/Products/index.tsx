import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Alert, StatusBar, View, StyleSheet, Modal, Button, Text, Platform, Image, Animated, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { MaterialIcons, MaterialCommunityIcons, Feather, Ionicons, FontAwesome } from '@expo/vector-icons';
import { Modalize } from 'react-native-modalize';
import { TextInputMask } from 'react-native-masked-text'
import { RadioButton, Modal as ModalDone, TextInput, DefaultTheme } from 'react-native-paper'
import { RectButton } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import NetInfo from '@react-native-community/netinfo';

import api from '../../services/api';

import Loading from '../../components/Loading';
import Scanner from '../../components/Scanner'
import BoxEmpty from '../../components/BoxEmpty'

import marketThumb from '../../assets/images/marketThumb.png';

import {
	Container,
	Header,
	Thumbnail,
	HeaderTitleContainer,
	SupermarketName,
	Title,
	Content,
	Item,
	ItemThumbnail,
	ItemContent,
	ItemName,
	ItemBrand,
	ModalContainer,
	ModalTitle,
	ModalGroup,
	ModalInputContainer,
	ModalLabel,
	ModalInput,
	ModalTextInput,
	ModalButton,
	ModalButtonText,
	ItemContainer,
} from './styles';


const Products: React.FC = ({ route, navigation }) => {
	// Modalize Ref e Funções
	const modalizeRef = useRef<Modalize>(null);

	const onOpen = () => {
		modalizeRef.current?.open();
	};

	const onClose = () => {
		modalizeRef.current?.close();
	};

	// estado da internet 
	function isOnline () {
		NetInfo.fetch().then(async (state) => {
			await AsyncStorage.setItem('@online', state.isConnected.toString())
		});
	}

	// To unsubscribe to these update, just use:

	// Estados dos inputs
	const [barcode, setBarcode] = useState('');
	const [productName, setProductName] = useState('');
	const [productID, setProductID] = useState('');
	const [productPrice, setProductPrice] = useState('');

	// radio button
	const [checked, setChecked] = React.useState('0');

	// FAB BUTTON
	const [open, setOpen] = useState(false)
	const [animation] = useState(new Animated.Value(0))

	const toggleMenu = () => {
		var toValue = open ? 0 : 1

		Animated.spring(animation, {
			toValue: toValue,
			friction: 5,
			useNativeDriver: true
		}).start()

		setOpen(!open)
	}

	const rotation = {
		transform: [
			{
				rotate: animation.interpolate({
					inputRange: [0, 1],
					outputRange: ["0deg", "45deg"]
				})
			}
		]
	}

	const homeStyle = {
		transform: [
			{ scale: animation },
			{
				translateY: animation.interpolate({
					inputRange: [0, 1],
					outputRange: [0, -10]
				})
			},
		]
	}

	const heartStyle = {
		transform: [
			{ scale: animation },
			{
				translateY: animation.interpolate({
					inputRange: [0, 1],
					outputRange: [0, -20],

				})
			}
		]
	}

	// Estados de atividade
	const [isLoading, setIsLoading] = useState(false);

	// Array de Produtos Catalogados
	const [products, setProducts] = useState([]);
	const [productsFilter, setProductsFilter] = useState([]);

	// image
	const [image, setImage] = useState('')

	// modal filter
	const [modalVisible, setModalVisible] = React.useState(false);
	const [modalDoneVisible, setModalDoneVisible] = React.useState(false);
	const [modalCodeWrite, setModalCodeWrite] = useState(false)
	const [data, setData] = React.useState("")
	const [type, setType] = React.useState("")
	const [searchName, setSearchName] = useState("")

	// pesquisar produto Pesquisar do produto por código de barras (digitado)
	const [barcodeText, setBarcodeText] = useState('')
	const theme = {
		...DefaultTheme,
		roundness: 2,
		colors: {
			...DefaultTheme.colors,
			primary: '#d35e5e',
		},
	};

	const onCodeText = useCallback(async () => {
		setIsLoading(true)
		try {
			setType(type);
			setData(barcodeText);
			await isOnline()
			const online = await AsyncStorage.getItem('@online');
			let filterProductName = ''
			let id = '';

			if (online !== "true") {
				const response = Object.values(products).find(x => (x.produto.PROD_EAN == data));
				id = response.produto.id;
				filterProductName = response.produto.PROD_NOME
			} else {
				const token = await AsyncStorage.getItem('@Formosa:token');
				const response = await api.get(`/captura/barcode/${route.params.EMP_ID}/${data}`, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				})
				id = response.data.id;
				filterProductName = response.data.PROD_NOME
			}

			Alert.alert(`Código de barras escaneado com sucesso!${"\n"}${data}`)
			if (productPrice === "0.00" || productPrice === "R$0,00") {
				Alert.alert('Error', 'preço não pode ser 0,00')
			}
			onOpen();
			setBarcode(data)
			setProductName(filterProductName)
			setProductID(id)
			setProductPrice('R$0,00')
			setIsLoading(false)
		}
		catch (error) {
			console.log(error)

			Alert.alert('Error', 'Produto não encontrado', [
				{ text: 'OK', onPress: () => console.log('alert closed') }
			])
		}

		setModalCodeWrite(false)
		setBarcodeText('')
		setIsLoading(false)
	}, [barcodeText])

	// Pesquisar do produto por código de barras (camera)
	const onCodeScanned = useCallback(async (type, data) => {
		setIsLoading(true)
		try {
			setType(type);
			setData(data);
			await isOnline()
			const online = await AsyncStorage.getItem('@online');
			let filterProductName = ''
			let id = '';

			if (online !== "true") {
				const response = Object.values(products).find(x => (x.produto.PROD_EAN == data));
				id = response.produto.id;
				filterProductName = response.produto.PROD_NOME
			} else {
				const token = await AsyncStorage.getItem('@Formosa:token');
				const response = await api.get(`/captura/barcode/${route.params.EMP_ID}/${data}`, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				})
				id = response.data.id;
				filterProductName = response.data.PROD_NOME
			}

			Alert.alert(`Código de barras escaneado com sucesso!${"\n"}${data}`)
			if (productPrice === "0.00" || productPrice === "R$0,00") {
				Alert.alert('Error', 'preço não pode ser 0,00')
			}
			onOpen();
			setBarcode(data);
			setProductID(id);
			setProductName(filterProductName)
			setProductPrice('R$0,00')

		} catch (error) {
			console.log(error)

			Alert.alert('Error', 'Produto não encontrado', [
				{ text: 'OK', onPress: () => console.log('alert closed') }
			])

		}
		setModalVisible(false);
		setIsLoading(false)
	}, [data])


	// Função de buscar produtos para catalogar
	async function getData () {
		await isOnline()
		const online = await AsyncStorage.getItem('@online');
		if (online !== "true") {
			const databaseData = await AsyncStorage.getItem('@DatabaseALL') as string
			const myProducts = Object.values(JSON.parse(databaseData).paraCatalogar[route.params.EMP_ID].secao[route.params.SESSION].produtos)
			setProducts(myProducts.map(item => ({ "produto": item })) as any)
			return
		}
		setIsLoading(true)
		try {
			const token = await AsyncStorage.getItem('@Formosa:token');

			const response = await api.get(`/captura/empresas/${route.params.EMP_ID}/secoes/${route.params.SESSION}/produtos`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			await AsyncStorage.setItem('@Products:capturar', JSON.stringify(response.data))
			const getSaveProducts = await AsyncStorage.getItem('@Products:capturar') as string
			setProducts(JSON.parse(getSaveProducts));
			setIsLoading(false);
		} catch (err) {
			console.log(err);
			setIsLoading(false);
		}
		setIsLoading(false);
	}

	// Função de enviar produto ao banco de dados = catalogar produto;
	async function databaseHandle () {
		const databaseData = JSON.parse(await AsyncStorage.getItem('@DatabaseALL') as string)

		if (Array.isArray(databaseData.catalogados)) {
			databaseData.catalogados = {}
		}
		if (!databaseData.catalogados[route.params.EMP_ID]) {
			databaseData.catalogados[route.params.EMP_ID] = { ...databaseData.paraCatalogar[route.params.EMP_ID] };
			databaseData.catalogados[route.params.EMP_ID].secao = {};
		}
		if (!databaseData.catalogados[route.params.EMP_ID].secao[route.params.SESSION]) {
			databaseData.catalogados[route.params.EMP_ID].secao[route.params.SESSION] = { produtos: {} };
		}
		if (
			!databaseData.catalogados[route.params.EMP_ID].secao[route.params.SESSION].produtos[productID]
		) {
			databaseData.catalogados[route.params.EMP_ID].secao[route.params.SESSION].produtos[productID] = databaseData.paraCatalogar[route.params.EMP_ID].secao[route.params.SESSION].produtos[productID]
		}

		delete databaseData.paraCatalogar[route.params.EMP_ID].secao[route.params.SESSION].produtos[productID]

		await AsyncStorage.setItem("@DatabaseALL", JSON.stringify(databaseData))

	}

	async function handleSubmit () {
		await isOnline()
		const online = await AsyncStorage.getItem('@online');

		if (!productPrice || !barcode || !productName) {
			Alert.alert('Todos os campos devem ser preenchidos.')
			return
		} else if (productPrice === "0.00" || productPrice === "R$0,00" || productPrice === "0,00") {
			Alert.alert('Error', 'O preço não pode ser R$0,00')
			return
		} else if (online !== "true") {
			try {
				setIsLoading(true)
				const MyofflineData = {
					EMP_ID: String(route.params.EMP_ID),
					EAN: barcode,
					CAT_PRECO: productPrice,
					CAT_SITUACAO: checked,
					IMG: image ? image : null
				}

				let offlineSend = await AsyncStorage.getItem('@Database:offlineSend') as string
				offlineSend = JSON.parse(offlineSend)
				const offlineSendArray = Array.isArray(offlineSend) ? [...offlineSend, MyofflineData] : [MyofflineData]
				await AsyncStorage.setItem("@Database:offlineSend", JSON.stringify(offlineSendArray))

				databaseHandle();
				getData();
			} catch (err) {
				console.error(err)
			}

		} else {
			try {
				setIsLoading(true)
				const token = await AsyncStorage.getItem('@Formosa:token');

				const data = new FormData()

				data.append('EMP_ID', String(route.params.EMP_ID))
				data.append('EAN', barcode)
				data.append('CAT_PRECO', productPrice)
				data.append('CAT_SITUACAO', checked)
				image ?
					data.append('CAT_IMG', {
						name: `image_${barcode}.jpg`,
						type: 'image/jpg',
						uri: image
					} as any) : null

				await api.post(`/captura/registrar`, data, {
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${token}`,
					}
				})

			} catch (err) {
				console.log(err)
			}
		}
		getData();
		setSearchName('');
		setProductsFilter([]);
		onClose();
		setChecked('0');
		setIsLoading(false);
	}

	const handleEndSearch = useCallback(async () => {

		await isOnline()
		const online = await AsyncStorage.getItem('@online');
		if (online !== "true") {
			const databaseData = JSON.parse(await AsyncStorage.getItem('@DatabaseALL') as string)
			if (Array.isArray(databaseData.catalogados)) {
				databaseData.catalogados = {}
			}
			databaseData.catalogados[route.params.EMP_ID] = databaseData.paraCatalogar[route.params.EMP_ID]
			delete databaseData.paraCatalogar[route.params.EMP_ID]
			await AsyncStorage.setItem("@DatabaseALL", JSON.stringify(databaseData))
			const MyofflineData = {
				EMP_ID: String(route.params.EMP_ID),
			}
			let offlineSend = await AsyncStorage.getItem('@Database:offlineSend') as string
			offlineSend = JSON.parse(offlineSend)
			const offlineSendArray = Array.isArray(offlineSend) ? [...offlineSend, MyofflineData] : [MyofflineData]
			await AsyncStorage.setItem("@Database:offlineSend", JSON.stringify(offlineSendArray))
			navigation.navigate('EstablishmentSelect')
			return

		} else {
			const token = await AsyncStorage.getItem('@Formosa:token');
			await api.post('/captura/concluir', {
				EMP_ID: route.params.EMP_ID
			}, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
			)
		}
		setModalDoneVisible(false)
		getData();
	}, [])

	const pickImage = useCallback(async () => {
		if (Platform.OS !== 'web') {
			const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
			if (status !== 'granted') {
				alert('Sorry, we need camera roll permissions to make this work!');
			}
		}

		const result = await ImagePicker.launchCameraAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 0.4,
		});

		if (!result.cancelled) {
			const localUrl = result.uri
			setImage(localUrl);
		}

	}, [setImage])

	useEffect(() => {
		isOnline();
		getData();
	}, [])

	useEffect(() => {

		setProductsFilter(
			products.filter(
				product =>
					product.produto.PROD_NOME
						.toLowerCase()
						.includes(searchName.toLowerCase())
			)
		)


	}, [searchName])

	return (
		<>
			<StatusBar barStyle='dark-content' backgroundColor='#F5F4F4' />

			{/* Listagem de produtos */}
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
				<Title>Produtos para pesquisar hoje</Title>
				<TextInput
					returnKeyType="done"
					keyboardType="default"
					theme={theme}
					label="Pesquisar por nome"
					value={searchName}
					onChangeText={name => setSearchName(name)}
				/>

				{
					isLoading === true ? <Loading /> :
						<Content
							showsVerticalScrollIndicator={false}
							ListEmptyComponent={() => {
								return (
									<BoxEmpty />
								);
							}}
							data={productsFilter.length === 0 ? products : productsFilter}
							keyExtractor={(item) => String(item.produto.id)}
							renderItem={({ item }) => {
								return (
									<ItemContainer>
										<Item
											onPress={() => {
												onOpen();
												setProductName(item.produto.PROD_NOME);
												setProductID(item.produto.id);
												setBarcode(`${item.produto.PROD_EAN}`);
												setProductPrice('0,00');
											}}
										>
											<ItemThumbnail
												source={marketThumb}
												style={{ resizeMode: 'cover' }}
											/>
											<ItemContent>
												<ItemName
													numberOfLines={2}
													ellipsizeMode="tail"
												>{item.produto.PROD_NOME}</ItemName>
												<ItemBrand>{item.produto.PROD_EAN}</ItemBrand>
											</ItemContent>
										</Item>
									</ItemContainer>
								);
							}} />
				}
			</Container>

			{/* modal filter */}

			<View style={styles.container}>

				<RectButton style={styles.buttonDoneContainer}
					onPress={async () => { setModalDoneVisible(true) }}>
					<Ionicons name="md-done-all" size={24} color="#fff" />
				</RectButton>

				<View style={{ height: 50, bottom: 92.3 }}>
					<Animated.View style={[styles.button, styles.subMenu, heartStyle]}>
						<Feather
							onPress={() => setModalVisible(true)}
							name="camera"
							size={18}
							color="#FFF"
						/>
					</Animated.View>
					<Animated.View style={[styles.button, styles.subMenu, homeStyle]}>
						<MaterialIcons
							onPress={() => setModalCodeWrite(true)}
							name="touch-app"
							size={18}
							color="#FFF"
						/>
					</Animated.View>
					<TouchableWithoutFeedback onPress={toggleMenu}>
						<Animated.View style={[styles.button, styles.menu]}>
							<Animated.View style={[rotation]}>
								<Feather
									name="plus"
									size={26}
									color="#FFF"
								/>
							</Animated.View>
						</Animated.View>
					</TouchableWithoutFeedback>
				</View>
			</View>



			<ModalDone
				contentContainerStyle={{ backgroundColor: '#fff', padding: 20, margin: 20 }}
				visible={modalDoneVisible}
				onDismiss={() => setModalDoneVisible(false)}
			>
				<View style={styles.modalDoneContent}>
					<Text style={{
						fontFamily: 'Poppins_400Regular',
					}}
					>
						Deseja Finalizar a pesquisa?
								</Text>
					<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
						<RectButton
							onPress={handleEndSearch}
							style={styles.buttonDone}>
							<Text
								style={{ fontFamily: 'Poppins_600SemiBold', color: '#f5f4f4' }}
							>
								Sim
									</Text>
						</RectButton>

						<RectButton
							style={styles.buttonCancelDone}
							onPress={() => setModalDoneVisible(false)}
						>
							<Text
								style={{ fontFamily: 'Poppins_600SemiBold', color: '#f5f4f4' }}
							>
								Não
									</Text>
						</RectButton>
					</View>
				</View>
			</ModalDone>

			<Modal
				visible={modalVisible}
				transparent={true}
				animationType="slide"
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modal}>
					<Scanner onCodeScanned={onCodeScanned} />
					<Button title="Cancelar" onPress={() => setModalVisible(false)} />
				</View>
			</Modal>

			{isLoading === true ? <Loading /> : (

				<ModalDone
					visible={modalCodeWrite}
					contentContainerStyle={{ backgroundColor: '#fff', padding: 20, margin: 20, borderRadius: 8 }}
					onDismiss={() => setModalCodeWrite(false)}
				>
					<TextInput
						returnKeyType="done"
						keyboardType="number-pad"
						theme={theme}
						label="Digite o codigo de barras"
						value={barcodeText}
						onChangeText={barcodeText => (setBarcodeText(barcodeText))}
					/>

					<View style={styles.modalDoneContent}>
						<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
							<RectButton
								onPress={onCodeText}
								style={{ ...styles.buttonDone, width: 100 }}>
								<Text
									style={{ fontFamily: 'Poppins_600SemiBold', color: '#f5f4f4' }}
								>
									Pesquisar
										</Text>
							</RectButton>

							<RectButton
								style={{ ...styles.buttonCancelDone, width: 100 }}
								onPress={() => {
									setBarcodeText('')
									setModalCodeWrite(false)
								}}
							>
								<Text
									style={{ fontFamily: 'Poppins_600SemiBold', color: '#f5f4f4' }}
								>
									Cancelar
										</Text>
							</RectButton>
						</View>
					</View>

				</ModalDone>
			)}
			{/* Modal adicionar produto */}

			<Modalize
				ref={modalizeRef}
				snapPoint={650}
				avoidKeyboardLikeIOS={true}
				onClosed={() => setImage('')}
			>
				{isLoading === true ? <Loading /> : (

					<ModalContainer
						keyboardShouldPersistTaps="always"
					>
						<ModalTitle>Adicionar produto</ModalTitle>
						<ModalInputContainer>
							<ModalInput>
								<MaterialCommunityIcons name="barcode-scan" size={30} color="#757474" />
								<ModalTextInput
									textAlign='center'
									value={barcode}
									onChangeText={value => setBarcode(value)}
								/>

							</ModalInput>
						</ModalInputContainer>
						<ModalInputContainer >
							<ModalLabel>Nome do produto</ModalLabel>
							<ModalInput>
								<ModalTextInput
									autoCapitalize='characters'
									value={productName}
									onChangeText={value => setProductName(value)}
								/>
							</ModalInput>
						</ModalInputContainer>
						<ModalGroup>
							<ModalInputContainer
								insideModalGroup={true}
							>
								<ModalLabel>Preço</ModalLabel>
								<ModalInput>

									<TextInputMask
										style={styles.maskPrice}
										type="money"
										keyboardType="number-pad"
										value={productPrice}
										options={{
											precision: 2,
											separator: ',',
											delimiter: '.',
											unit: 'R$',
											suffixUnit: ''
										}}
										onChangeText={value => setProductPrice(value)}
									/>
								</ModalInput>

								<ModalLabel style={{ marginTop: 14 }}>Foto do produto</ModalLabel>
								<View style={styles.buttonProductPhoto}>
									<Feather
										name="camera"
										size={24}
										color="#333"
										onPress={pickImage}
									/>
									<Image
										resizeMode="contain"
										style={{
											width: 50,
											height: 50,
											borderRadius: 10
										}}
										source={image !== '' ? { uri: image } : marketThumb}
									/>
								</View>

								<View style={styles.radioButton}>
									<View style={styles.radioButtonContent}>
										<Text style={styles.radioButtonText}>Normal</Text>
										<RadioButton
											value="0"
											status={checked === '0' ? 'checked' : 'unchecked'}
											onPress={() => setChecked("0")}
										/>
									</View>
									<View style={{ ...styles.radioButtonContent, marginLeft: 15 }}>
										<Text style={styles.radioButtonText}>Promoção</Text>
										<RadioButton
											value="1"
											status={checked === '1' ? 'checked' : 'unchecked'}
											onPress={() => setChecked("1")}
										/>
									</View>
								</View>
							</ModalInputContainer>

						</ModalGroup>
						<ModalGroup>
							<ModalButton
								isButtonCancel={true}
								onPress={() => {
									setBarcode('');
									setProductID('');
									setProductName('');
									onClose();
									setImage('')
								}}
							>
								<ModalButtonText>Cancelar</ModalButtonText>

							</ModalButton>
							<ModalButton
								onPress={handleSubmit}
							>
								<ModalButtonText>Adicionar</ModalButtonText>
							</ModalButton>
						</ModalGroup>
					</ModalContainer>
				)}

			</Modalize>
		</>
	)
}

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "lightgrey",
	},
	maskPrice: {
		fontFamily: 'Poppins_700Bold',
		fontSize: 15,
		flex: 1,
		color: '#8e8e8e',
		textAlign: 'left',
		marginLeft: 5,
	},
	radioButton: {
		paddingHorizontal: 5,
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		marginTop: 5,
		marginBottom: 5
	},
	radioButtonContent: {
		alignItems: 'center',
		paddingTop: 5,
		borderRadius: 10,
	},
	radioButtonText: {
		fontFamily: 'Poppins_400Regular'
	},
	buttonDoneContainer: {
		// position: 'absolute',
		// bottom: "5%",
		// left: "10%",
		backgroundColor: '#DE5F5F',
		padding: 10,
		borderRadius: 8
	},
	modalDoneContent: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 10,
		height: "30%",
	},
	buttonDone: {
		width: 70,
		height: 30,
		backgroundColor: '#51cc82',
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 50,
	},
	buttonCancelDone: {
		width: 70,
		height: 30,
		backgroundColor: '#d35e5e',
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
	},

	buttonProductPhoto: {
		backgroundColor: "#EFEFEF",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 7,
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
	},

	container: {
		position: 'absolute',
		width: '100%',
		bottom: 30,
		// right: "15.8%",
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16
	},
	button: {
		// position: 'absolute',
		padding: 10,
		borderRadius: 8,
		backgroundColor: '#d35e5e',
		justifyContent: 'center',
		alignItems: 'center'
	},
	menu: {
		backgroundColor: '#d35e5e',
	},
	subMenu: {
		width: 47,
		height: 47,
		borderRadius: 47 / 2,
	}
});

export default Products;
