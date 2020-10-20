import React from 'react';
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

import { useNavigation } from '@react-navigation/native';

import marketThumb from '../../assets/images/marketThumb.png';

import { MaterialCommunityIcons } from '@expo/vector-icons';

const EstablishmentSelect: React.FC = () => {
    const navigation = useNavigation();

    const data = [
        { key: '1', thumb: marketThumb, name: 'Supermercado 1' },
        { key: '2', thumb: marketThumb, name: 'Supermercado 2' },
        { key: '3', thumb: marketThumb, name: 'Supermercado 3' },
        { key: '4', thumb: marketThumb, name: 'Supermercado 4' },
        { key: '5', thumb: marketThumb, name: 'Supermercado 5' },
        { key: '6', thumb: marketThumb, name: 'Supermercado 6' },
        { key: '7', thumb: marketThumb, name: 'Supermercado 7' },
        { key: '8', thumb: marketThumb, name: 'Supermercado 8' },
    ]

    return(
        <>
            <StatusBar barStyle='light-content' backgroundColor='#DE5F5F' />
            <Container>
                <Header>
                    <MaterialCommunityIcons name="logout" size={31} color='#FFFFFF' />
                    <HeaderText>Olá, usuário!</HeaderText>
                </Header>
                <Content>
                    <Title>Selecione o estabelecimento</Title>
                    <List
                        contentContainerStyle={{ 
                            alignItems: 'center',
                            justifyContent: "center",
                            paddingHorizontal: 20
                        }}
                        showsVerticalScrollIndicator={false}
                        data={data}
                        horizontal={false}
                        numColumns={2}
                        keyExtractor={(item)=> item.key}
                        renderItem={({ item, index }) => {
                            return(
                                <Card 
                                    onPress={() => navigation.navigate('Products')}
                                    style={ index % 2 === 0 ? { marginRight: 2.5 } : { marginLeft: 2.5 }} 
                                >
                                    <Thumbnail source={item.thumb} style={{ resizeMode: 'cover' }} />
                                    <CardTextContainer>
                                        <CardText>{item.name}</CardText>
                                    </CardTextContainer>
                                </Card>
                            );
                        }}
                    />
                </Content>
            </Container>
        </>
    )
}

export default EstablishmentSelect;