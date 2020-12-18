import React from 'react';
import { Container } from './styles';
import ProgressBar from '../ProgressBar'
import { ActivityIndicator, Dimensions, Text } from 'react-native';

const Loading: React.FC = ({ text, isFull, progress }) => {

    return (
        <Container style={!isFull ? {
            left: (Dimensions.get('window').width / 2) - 35,
            top: (Dimensions.get('window').height / 2) - 35,
        } : {
                height: Dimensions.get('window').height,
                width: Dimensions.get('window').width,
                zIndex: 1
            }}>
            <ActivityIndicator animating={true} size='large' color='#DE5F5F' />
            {text ? <Text>{text}</Text> : null}
            {text ? <ProgressBar completed={progress} /> : null}

        </Container>
    )
}

export default Loading;