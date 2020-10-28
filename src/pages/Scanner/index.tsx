import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { useNavigation } from '@react-navigation/native';

export default function Scanner() {
    const navigation = useNavigation();

    const [data, setData] = useState();
    
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setData(data);
        setScanned(true);
        alert(`Código de barras escaneado com sucesso!${"\n"}${data}`);
    };

    if (hasPermission === null) {
        return <Text>Esperando permissão de acesso à câmera...</Text>;
    }
    if (hasPermission === false) {
        return <Text>Acesso à cầmera negado.</Text>;
    }

    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'flex-end',
            }}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? navigation.navigate('Products', {
                    scannedBarcode: data
                }) : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
        </View>
    );
}