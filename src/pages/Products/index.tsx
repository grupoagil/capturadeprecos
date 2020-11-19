import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Alert, StatusBar, View, StyleSheet, Modal, Button, Text, Platform, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { MaterialIcons, MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import { Modalize } from 'react-native-modalize';
import { TextInputMask } from 'react-native-masked-text'
import { RadioButton, Modal as ModalDone } from 'react-native-paper'
import { RectButton } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';


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
	FilterButton,
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


	// Estados dos inputs
	const [barcode, setBarcode] = useState('');
	const [productName, setProductName] = useState('');
	const [productPrice, setProductPrice] = useState('');
	// radio button
	const [checked, setChecked] = React.useState('0');


	// Estados de atividade
	const [isLoading, setIsLoading] = useState(false);


	// Array de Produtos Catalogados
	const [products, setProducts] = useState([]);


	// image
	const [image, setImage] = useState('');

	// modal filter
	const [modalVisible, setModalVisible] = React.useState(false);
	const [modalDoneVisible, setModalDoneVisible] = React.useState(false);
	const [data, setData] = React.useState("")
	const [type, setType] = React.useState("")
	
	// Código escaneado
	
	// Pesquisar do produto por código de barras
	const onCodeScanned = useCallback(async (type, data) => {
		setIsLoading(true)
		const token = await AsyncStorage.getItem('@Formosa:token')

			try {
				setType(type)
				setData(data);
				
				const response = await api.get(`/captura/barcode/${route.params.EMP_ID}/${data}`, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				})

				const filterProductName = response.data.PROD_NOME
				Alert.alert(`Código de barras escaneado com sucesso!${"\n"}${data}`)
				if (productPrice === "0.00" || productPrice === "R$0,00") {
					Alert.alert('Error', 'preço não pode ser 0,00')
				}
				
				onOpen()
				setBarcode(data)
				setProductName(filterProductName)
				setProductPrice('R$0,00')
				
				// setModalVisible(false);
				
				// setIsLoading(false)
				
			} catch (error) {
				console.log(error)

				Alert.alert('Error', 'Produto não encontrado', [
					{text: 'OK', onPress: () => console.log('alert closed')}
				])
				
			}
		setModalVisible(false);
		setIsLoading(false)
	}, [data])
	

	// Função de buscar produtos para catalogar
	async function getData() {
		setIsLoading(true)
			try {
					const token = await AsyncStorage.getItem('@Formosa:token');

					const response = await api.get(`/captura/empresas/${route.params.EMP_ID}/produtos`, {
							headers: {
									Authorization: `Bearer ${token}`
							}
					});
					
					
					setProducts(response.data);
					setIsLoading(false);
			} catch (err) {
					console.log(err);
					setIsLoading(false);
			}
			setIsLoading(false);
	}

	// Função de enviar produto ao banco de dados = catalogar produto;
	
	async function handleSubmit() {

			if (!productPrice || !barcode || !productName) {
					Alert.alert('Todos os campos devem ser preenchidos.')
			} else if(productPrice === "0.00" || productPrice === "R$0,00" || productPrice === "0,00") {
				Alert.alert('Error', 'O preço não pode ser R$0,00')
			} else {
					try {
							const token = await AsyncStorage.getItem('@Formosa:token');
							const response = await api.post(`/captura/registrar`, {
									EAN: barcode,
									CAT_PRECO: productPrice,
									EMP_ID: route.params.EMP_ID,
									CAT_SITUACAO: checked
							}, {
									headers: {
											Authorization: `Bearer ${token}`
									}
							})

							console.log(response);
							getData();
					} catch (err) {
							console.log(err)
					}
					onClose();
					setChecked('0')
			}
	}

	const handleEndSearch = useCallback(async() => {
		const token = await AsyncStorage.getItem('@Formosa:token');
		const response = await api.post('/captura/concluir', {
				EMP_ID: route.params.EMP_ID
			}, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		)

		console.log(response.data)
		setModalDoneVisible(false)
		getData()
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
      quality: 1,
    });

    if (!result.cancelled) {
      const localUrl = result.uri

      setImage(localUrl);
    }
  }, [setImage])

	console.log(image)


	useEffect(() => {
		getData();
	}, [])	

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
				{
					isLoading === true ? <Loading /> :
						<Content
							showsVerticalScrollIndicator={false}
							ListEmptyComponent={() => {
									return (
										<BoxEmpty />
									);
							}}
							data={products}
							keyExtractor={(item) => String(item.produto.id)}
							renderItem={({ item }) => {
							return (
								<ItemContainer>
									<Item
										onPress={() => {
											onOpen();
											setProductName(item.produto.PROD_NOME);
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
							}}/>
						}
				</Container>

					{/* modal filter */}
					<FilterButton onPress={() => setModalVisible(true)}>
							<Feather name="camera" size={24} color="#fff" />
					</FilterButton>
					
					<RectButton style={styles.buttonDoneContainer} onPress={() => setModalDoneVisible(true)}>
						<Ionicons name="md-done-all" size={24} color="#fff" />
					</RectButton>

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
							<View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
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
						animationType="fade"
						onRequestClose={() => setModalVisible(false)}
					>
						<View style={styles.modal}>
							<Scanner onCodeScanned={onCodeScanned} />
							<Button title="Cancelar" onPress={() => setModalVisible(false)} />
						</View>
					</Modal>
				{/* Modal adicionar produto */}

				<Modalize
					ref={modalizeRef}
					snapPoint={550}
					avoidKeyboardLikeIOS={true}
					onClosed={() => setImage('')}
				>
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
															status={ checked === '0' ? 'checked' : 'unchecked' }
															onPress={() => setChecked("0")}
														/>
													</View>
													<View style={{...styles.radioButtonContent, marginLeft: 15}}>
														<Text style={styles.radioButtonText}>Promoção</Text>
														<RadioButton
															value="1"
															status={ checked === '1' ? 'checked' : 'unchecked' }
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
														setProductName('');
														setImage('')
														onClose();
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
		position: 'absolute',
		bottom: "5%",
		left: "10%",
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
		
	}
});

export default Products;