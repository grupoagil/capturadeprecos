import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, StatusBar} from 'react-native';
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
            <StatusBar barStyle="light-content" />
            <BarCodeScanner
              
                onBarCodeScanned={scanned ? navigation.navigate('Products', {
                    scannedBarcode: data
                }) : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            >
              <View style={styles.layerTop} />
              <View style={styles.layerCenter}>
                <View style={styles.layerLeft} />
                <View style={styles.focused} />
                <View style={styles.layerRight} />
              </View>
              <View style={styles.layerBottom} />
              <Text onPress={() => {navigation.goBack()}} style={styles.cancel}>
                Cancelar
              </Text>

            </BarCodeScanner>
        </View>
    );
}

const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  layerTop: {
    flex: 2,
    backgroundColor: opacity
  },
  layerCenter: {
    flex: 1,
    flexDirection: 'row'
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity
  },
  focused: {
    flex: 10
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity
  },
  layerBottom: {
    flex: 2,
    backgroundColor: opacity
  },
  cancel: {
    position: 'absolute',
    bottom: 50,
    left: '41%',
    color: '#fff',
    padding: 8,
    backgroundColor: "#999",
    opacity: 0.8,
    
  }
});