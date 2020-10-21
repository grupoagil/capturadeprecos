import React from 'react';
import { Container } from './styles';
import { ActivityIndicator } from 'react-native';

const Loading: React.FC = () => {
    return(
        <Container>
            <ActivityIndicator animating={true} size='large' color='#DE5F5F'  />
        </Container>
    )
}

export default Loading;