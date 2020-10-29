import React, { useRef, useState, useEffect } from 'react';
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
} from './styles';

import { Alert, StatusBar } from 'react-native';

import Loading from '../../components/Loading';

import api from '../../services/api';

import AsyncStorage from '@react-native-community/async-storage';

import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import marketThumb from '../../assets/images/marketThumb.png';

import { Modalize } from 'react-native-modalize';

const Products: React.FC = ({ route, navigation }) => {
    // Modalize Ref e Funções
    const modalizeRef = useRef<Modalize>(null);

    const onOpen = () => {
        modalizeRef.current?.open();
    };

    const onClose = () => {
        modalizeRef.current?.close();
    };


    // Código escaneado

    // Estados dos inputs
    const [barcode, setBarcode] = useState('');
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productAmount, setProductAmount] = useState('');

    // Estados de atividade
    const [isLoading, setIsLoading] = useState(false);


    // Array de Produtos Catalogados
    const [data, setData] = useState([]);

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

            setData(response.data);
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

                console.log(response.data);
                getData();
            } catch (err) {
                console.log(err)
            }
            onClose();
        }
    }


    useEffect(() => {
        getData();
    }, [data])

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
                    isLoading === true ?
                        <Loading />
                        :
                        <Content
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={() => {
                                return (
                                    <Title>
                                        Sem produtos aqui.
                                    </Title>
                                );
                            }}
                            data={data}
                            keyExtractor={(item) => String(item.produto.id)}
                            renderItem={({ item }) => {
                                return (
                                    <Item
                                        onPress={() => {
                                            onOpen();
                                            setProductName(item.produto.PROD_NOME);
                                            setBarcode(`${item.produto.PROD_EAN}`);
                                            setProductPrice('');
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
                            }}

                        />

                }
            </Container>

            {/* Modal adicionar produto */}

            <Modalize
                ref={modalizeRef}
                snapPoint={400}
                avoidKeyboardLikeIOS={true}
            >
                <ModalContainer>
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
                    <ModalInputContainer>
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
                                    value={productPrice}
                                    onChangeText={value => setProductPrice(value)}
                                />
                            </ModalInput>
                        </ModalInputContainer>
                        <ModalInputContainer
                            insideModalGroup={true}
                        >
                            <ModalLabel>Quantidade</ModalLabel>
                            <ModalInput>
                                <ModalTextInput
                                    keyboardType='number-pad'
                                    value={productAmount}
                                    onChangeText={value => setProductAmount(value)}
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

export default Products;