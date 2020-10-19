import React from 'react';
import {
    Container,
    Title,
    Form,
    Input,
    TextInput,
    Button,
    ButtonText
} from './styles';

import { StatusBar, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { MaterialCommunityIcons } from '@expo/vector-icons';

const HomeScreen: React.FC = () => {
    const navigation = useNavigation();

    return(
        <>
            <StatusBar barStyle='light-content' backgroundColor='#DE5F5F' />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                
            >
                <TouchableWithoutFeedback
                    onPress={() => Keyboard.dismiss()}
                >
                    <Container>
                        <Title>Captura de Preços</Title>
                        <Form>
                            <Input>
                                <Icon name="email" size={24} color="#DE5F5F" />
                                <TextInput 
                                    placeholder='E-mail' 
                                    placeholderTextColor='#565651'
                                />
                            </Input>
                            <Input margin={15} >
                                <Icon name="lock" size={24} color="#DE5F5F" />
                                <TextInput 
                                    placeholder='Senha' 
                                    placeholderTextColor='#565651'
                                    secureTextEntry={true}
                                />
                            </Input>
                            <Button
                                onPress={() => { navigation.navigate('EstablishmentSelect') }}
                            >
                                <MaterialCommunityIcons name="login" size={24} color="#FFFFFF" style={{ marginRight: 5 }} />
                                <ButtonText>Login</ButtonText>
                            </Button>
                        </Form>
                    </Container>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </>
    )
}

export default HomeScreen;