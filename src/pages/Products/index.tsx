import React, { useRef, useState, useEffect } from 'react';
import {
    Container,
    Header,
    Thumbnail,
    HeaderTitleContainer,
    Supermarket,
    SupermarketName,
    Title,
    Content,
    Item,
    ItemThumbnail,
    ItemContent,
    ItemName,
    ItemBrand,
    Fab,
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

import { StatusBar } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import api from '../../services/api';


import { MaterialIcons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

import marketThumb from '../../assets/images/marketThumb.png';

import { Modalize } from 'react-native-modalize';


const Products: React.FC = ({ route }) => {
    const navigation = useNavigation();
    const [barcode, setBarcode] = useState('');

    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productAmount, setProductAmount] = useState('');

    const scannedBarcode = route.params ? route.params.scannedBarcode : undefined;

    const modalizeRef = useRef<Modalize>(null);

    const onOpen = () => {
        modalizeRef.current?.open();
    };

    const onClose = () => {
        modalizeRef.current?.close();
    };

    const data = [
        { key: '1', thumb: marketThumb, name: 'Arroz', brand: 'Tio João' },
        { key: '2', thumb: marketThumb, name: 'Feijão', brand: 'Carioca' },
    ]

    async function fetchData(barcode) {
        try {
            const response = await api.get(`?barcode=${barcode}`);
            if(barcode) {
                setProductName(response.data.Status);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        console.log(scannedBarcode);
        setBarcode(scannedBarcode);

        fetchData(scannedBarcode);
    }, [scannedBarcode])

    return (
        <>
            <StatusBar barStyle='dark-content' backgroundColor='#F5F4F4' />
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
                        <Supermarket>Supermercado</Supermarket>
                        <SupermarketName>Formosa</SupermarketName>
                    </HeaderTitleContainer>
                </Header>
                <Title>Produtos catalogados hoje</Title>
                <Content
                    showsVerticalScrollIndicator={false}
                    data={data}
                    keyExtractor={(item) => item.key}
                    renderItem={({ item }) => {
                        return (
                            <Item>
                                <ItemThumbnail
                                    source={item.thumb}
                                    style={{ resizeMode: 'cover' }}
                                />
                                <ItemContent>
                                    <ItemName>{item.name}</ItemName>
                                    <ItemBrand>{item.brand}</ItemBrand>
                                </ItemContent>
                            </Item>
                        );
                    }}

                />
            </Container>
            <Fab
                onPress={() => { onOpen() }}
            >
                <Entypo name="plus" size={25} color="white" />
            </Fab>

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
                                placeholder='Digite ou escaneie o código'
                                keyboardType='number-pad'
                                textAlign='center'
                                value={barcode}
                                onChangeText={value => setBarcode(value)}
                            />
                            <MaterialIcons
                                name="camera-alt"
                                size={30}
                                color="#757474"
                                onPress={() => { navigation.navigate('Scanner') }}
                            />
                        </ModalInput>
                    </ModalInputContainer>
                    <ModalInputContainer>
                        <ModalLabel>Nome do produto</ModalLabel>
                        <ModalInput>
                            <ModalTextInput
                                value={productName}
                                onChangeText={value => setProductName(value)}
                            />
                            <MaterialIcons 
                                name="close" 
                                size={30} 
                                color="#757474" 
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
                        <ModalButton>
                            <ModalButtonText>Adicionar</ModalButtonText>
                        </ModalButton>
                    </ModalGroup>
                </ModalContainer>
            </Modalize>
        </>
    )
}

export default Products;