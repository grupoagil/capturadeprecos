import React from 'react';
import { Container } from './styles';
import { ActivityIndicator, Dimensions } from 'react-native';

const Loading: React.FC = () => {
    return(
        <Container style= {{ 
            left: (Dimensions.get('window').width / 2) - 35,
            top: (Dimensions.get('window').height / 2) - 35
        }}>
            <ActivityIndicator animating={true} size='large' color='#DE5F5F'  />
        </Container>
    )
}

export default Loading;