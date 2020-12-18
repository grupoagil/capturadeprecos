import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Alert, StatusBar, View, StyleSheet, Image, Text, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { MaterialIcons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Modalize } from 'react-native-modalize';
import { RadioButton } from 'react-native-paper';
import { TextInputMask } from 'react-native-masked-text';
import * as ImagePicker from 'expo-image-picker';
import NetInfo from '@react-native-community/netinfo';

import api from '../../services/api';

import Loading from '../../components/Loading';

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


const ProductsCataloged: React.FC = ({ route, navigation }) => {
	// Modalize Ref e Funções
	const modalizeRef = useRef<Modalize>(null);

	const onOpen = () => {
			modalizeRef.current?.open();
	};

	const onClose = () => {
			modalizeRef.current?.close();
	};


	// Estados dos inputs
	const [id, setId] = useState(0)
	const [barcode, setBarcode] = useState('');
	const [productName, setProductName] = useState('');
	const [productPrice, setProductPrice] = useState('');

	// Estados de atividade
	const [isLoading, setIsLoading] = useState(false);


	// Array de Produtos Catalogados
	const [productsCataloged, setProductsCataloged] = useState([]);

	// modal filter
	const [checked, setChecked] = React.useState(0);

	// IMAGE 
	const [image, setImage] = useState('')

	const [online, setOnline] = useState(true)

	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener(state => {
			console.log('Connection type', state.type);
			console.log('Is connected?', state.isConnected);
			if (state.isConnected === true) {
				setOnline(true)
			} else {
				setOnline(false)
			}
		});
		
		// To unsubscribe to these update, just use:
		unsubscribe();
	}, [online])

	// Função de buscar produtos para catalogar
	async function getData() {
		setIsLoading(true)
			try {
					const token = await AsyncStorage.getItem('@Formosa:token');

					const response = await api.get(`/captura/catalogados/empresas/${route.params.EMP_ID}/secoes/${route.params.SESSION}/produtos`, {
							headers: {
									Authorization: `Bearer ${token}`
							}
					});
					
				
					setProductsCataloged(response.data);
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
							setIsLoading(true)
							const token = await AsyncStorage.getItem('@Formosa:token');
							
							const data = new FormData()

							data.append('CAT_ID', String(id))
							data.append('CAT_PRECO', productPrice)
							data.append('CAT_SITUACAO', String(checked))

							image ? 
							data.append('CAT_IMG', { 
								name: `image_${barcode}.jpg`,
								type: 'image/jpg',
								uri: image
							 } as any) : null 
							
							await api.post(`/captura/atualizar`, data, {
										headers: {
											'Content-Type': 'multipart/form-data',
												Authorization: `Bearer ${token}`
										}
								})
							getData();
					} catch (err) {
							console.log(err)
					}
					onClose();
			}
	}


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
						<Title>Produtos pesquisados</Title>
						{ online !== true ? Alert.alert('fique online, para atualizar') : 
						
							isLoading === true ? <Loading /> :
									 <Content
										showsVerticalScrollIndicator={false}
										data={productsCataloged}
										keyExtractor={(item) => String(item.produto.id)}
										renderItem={({ item }) => {
											return (
												<ItemContainer>
													<Item
														key={item.produto.id}
														onPress={() => {
																onOpen();
																setId(item.id)
																setProductName(item.produto.PROD_NOME);
																setBarcode(`${item.produto.PROD_EAN}`);
																setProductPrice(item.CAT_PRECO);
																setChecked(item.CAT_SITUACAO)
																setImage(item.CAT_IMG)
																
																
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

				<Modalize
					ref={modalizeRef}
					snapPoint={650}
					avoidKeyboardLikeIOS={true}
					onClosed={() => {
						setImage('')
						setId(0)
					}}
				>
					{isLoading === true ? <Loading /> : (

						<ModalContainer
							keyboardShouldPersistTaps="always"
						>
								<ModalTitle>Atualizar produto</ModalTitle>
								<ModalInputContainer>
										<ModalInput>
											<MaterialCommunityIcons name="barcode-scan" size={30} color="#757474" />
												<ModalTextInput
														textAlign='center'
														value={barcode}
														editable={false}
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
														source={{ uri: `http://167.249.210.93:9406/${image}` }} 
													/>
												</View>

												<View style={styles.radioButton}>
													<View style={styles.radioButtonContent}>
														<Text style={styles.radioButtonText}>Normal</Text>
														<RadioButton
															value="0"
															status={ checked === 0 ? 'checked' : 'unchecked' }
															onPress={() => setChecked(0)}
														/>
													</View>
													<View style={{...styles.radioButtonContent, marginLeft: 15}}>
														<Text style={styles.radioButtonText}>Promoção</Text>
														<RadioButton
															value="1"
															status={ checked === 1 ? 'checked' : 'unchecked' }
															onPress={() => setChecked(1)}
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
														setId(0)
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

export default ProductsCataloged;