import React, { useContext, useState, useEffect } from 'react';
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

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AuthContext } from '../../contexts/auth';

import api from '../../services/api';

import AsyncStorage from '@react-native-community/async-storage';

const EstablishmentSelect: React.FC = () => {
    const navigation = useNavigation();

    const [fetchedData, setFetchedData] = useState([]);

    const { signOut, user } = useContext(AuthContext);

    // const dados = [
    //     { key: '1', thumb: marketThumb, name: 'Supermercado 1' },
    //     { key: '2', thumb: marketThumb, name: 'Supermercado 2' },
    //     { key: '3', thumb: marketThumb, name: 'Supermercado 3' },
    //     { key: '4', thumb: marketThumb, name: 'Supermercado 4' },
    //     { key: '5', thumb: marketThumb, name: 'Supermercado 5' },
    //     { key: '6', thumb: marketThumb, name: 'Supermercado 6' },
    //     { key: '7', thumb: marketThumb, name: 'Supermercado 7' },
    //     { key: '8', thumb: marketThumb, name: 'Supermercado 8' },
    // ]

    async function fetchData() {
        try {
            const token = await AsyncStorage.getItem('@Formosa:token');

            const response = await api.get(
                `https://formosa.agildesenvolvimento.com/api/captura/lista`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setFetchedData(response.data[0].para_catalogar);

        } catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    return(
        <>
            <StatusBar barStyle='light-content' backgroundColor='#DE5F5F' />
            <Container>
                <Header>
                    <MaterialCommunityIcons 
                        name="logout" 
                        size={31} 
                        color='#FFFFFF' 
                        onPress={signOut}
                    />
                    <HeaderText>Olá, {user.data.name}!</HeaderText>
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
                        horizontal={false}
                        numColumns={2}
                        data={fetchedData}
                        keyExtractor={(item)=> String(item.id)}
                        renderItem={({ item, index }) => {
                            return(
                                <Card 
                                    onPress={() => navigation.navigate('Products')}
                                    style={ index % 2 === 0 ? { marginRight: 2.5 } : { marginLeft: 2.5 } } 
                                >
                                    <Thumbnail source={{ uri: item.empresa.EMP_LOGO }} style={{ resizeMode: 'cover' }} />
                                    <CardTextContainer>
                                        <CardText>{item.empresa.EMP_NOME.trim()}</CardText>
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