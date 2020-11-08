import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Alert, StatusBar, View, StyleSheet, Modal, Button, Text } from 'react-native';

import Loading from '../../components/Loading';

import api from '../../services/api';

import AsyncStorage from '@react-native-community/async-storage';

import { MaterialIcons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

import marketThumb from '../../assets/images/marketThumb.png';

import { Modalize } from 'react-native-modalize';

import mask from '../../utils/mask'
import Scanner from '../../components/Scanner'
import BoxEmpty from '../../components/BoxEmpty'

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
	CardContainer,
} from './styles';
import { number } from 'yup';


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


	// Estados de atividade
	const [isLoading, setIsLoading] = useState(false);


	// Array de Produtos Catalogados
	const [products, setProducts] = useState([]);

	// modal filter
	const [modalVisible, setModalVisible] = React.useState(false);
	const [type, setType] = React.useState("");
  const [data, setData] = React.useState("");

	
	// Código escaneado
	
	// Pesquisar do produto por código de barras
	const onCodeScanned = useCallback(async (type, data) => {
			setIsLoading(true)
			setType(type);
			setData(data);
			setModalVisible(false);
			
			const token = await AsyncStorage.getItem('@Formosa:token');
			const response = await api.get(`/captura/empresas/${route.params.EMP_ID}/produtos`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			})

			alert(`Código de barras escaneado com sucesso!${"\n"}${data}`)
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
			} else {
					try {
							const token = await AsyncStorage.getItem('@Formosa:token');
							const response = await api.post(`/captura/registrar`, {
									EAN: barcode,
									CAT_PRECO: productPrice,
									EMP_ID: route.params.EMP_ID
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
			}
	}


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
								source={{ uri: route.params.EMP_THUMB }}
								style={{ resizeMode: 'cover' }}
							/>
							<HeaderTitleContainer>
								<SupermarketName>{route.params.EMP_NAME}</SupermarketName>
							</HeaderTitleContainer>
						</Header>
						<Title>Produtos para catalogar hoje</Title>
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
												<Item
													onPress={() => {
															onOpen();
															setProductName(item.produto.PROD_NOME);
															setBarcode(`${item.produto.PROD_EAN}`);
															setProductPrice(item.produto.PROD_ULT_VALOR);
													}}
												>
													<ItemThumbnail
															source={item.produto.PROD_LOGO ? { uri: item.produto.PROD_LOGO } : marketThumb}
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
												);
											}}/>
								}
					</Container>

					{/* modal filter */}
					<FilterButton onPress={() => setModalVisible(true)}>
							<Feather name="camera" size={24} color="#fff" />
					</FilterButton>

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
					snapPoint={400}
					avoidKeyboardLikeIOS={true}
				>
						<ModalContainer
							keyboardShouldPersistTaps="never"
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
														
														<ModalTextInput
																keyboardType='number-pad'
																value={mask(productPrice)}
																onChangeText={value => setProductPrice(value)}
														/>
												</ModalInput>
										</ModalInputContainer>
										
								</ModalGroup>
								<ModalGroup>
										<ModalButton
												isButtonCancel={true}
												onPress={() => {
														setBarcode('');
														setProductName('');
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
});

export default Products;