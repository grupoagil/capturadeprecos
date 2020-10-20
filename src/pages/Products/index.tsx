import React, { useRef } from 'react';
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

import { MaterialIcons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

import marketThumb from '../../assets/images/marketThumb.png';

import { Modalize } from 'react-native-modalize';

const Products: React.FC = () => {
    const navigation = useNavigation();

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
                            />
                            <MaterialIcons name="camera-alt" size={30} color="#757474" />
                        </ModalInput>
                    </ModalInputContainer>
                    <ModalInputContainer>
                        <ModalLabel>Nome do produto</ModalLabel>
                        <ModalInput>
                            <ModalTextInput

                            />
                            <MaterialIcons name="close" size={30} color="#757474" />
                        </ModalInput>
                    </ModalInputContainer>
                    <ModalGroup>
                        <ModalInputContainer
                            insideModalGroup={true}
                        >
                            <ModalLabel>Preço</ModalLabel>
                            <ModalInput>
                                <ModalTextInput

                                />
                            </ModalInput>
                        </ModalInputContainer>
                        <ModalInputContainer
                            insideModalGroup={true}
                        >
                            <ModalLabel>Quantidade</ModalLabel>
                            <ModalInput>
                                <ModalTextInput

                                />
                            </ModalInput>
                        </ModalInputContainer>
                    </ModalGroup>
                    <ModalGroup>
                        <ModalButton 
                            isButtonCancel={true}
                            onPress={() => onClose()}
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