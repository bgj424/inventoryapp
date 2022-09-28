import * as db from './Database'
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Camera } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from './Styles'

/* This uses the barcode scanner example code from Expo docs
https://docs.expo.dev/versions/latest/sdk/bar-code-scanner/ */
export const BarcodeScanner = ({ navigation, route }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
  
    useEffect(() => {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }, []);
  
    // Set scanner active/inactive on page focus/unfocus
    useFocusEffect(
      React.useCallback(() => {
        setScanned(false)
        return () => {
          setScanned(true)
        };
      }, [])
    );
  
    const handleBarCodeScanned = ({ type, data }) => {
      setScanned(true);
      
      navigation.navigate('Add Item', {
        item: {
          collection: route.params.collection,
          barcode: data,
          item: route.params.name,
          description: route.params.description,
        }
      })
    }
  
    if (hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }
  
    return (
      <View style={styles.container}>
        <Camera
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    );
}