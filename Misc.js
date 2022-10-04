import React, { useState, useEffect } from 'react';
import { auth } from './Database'
import { StyleSheet, Text, View, Button} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, LinearProgress } from 'react-native-elements';

export const LoadingScreen = ( navigation ) => {
    
    return (
        <View style={styles.loadingContainer}>
            <View
            style={styles.loadingscreen}
            >
            <LinearProgress style={{ marginVertical: 10 }} color="white" />
            <Text style={{color:'white', marginTop: 50, fontSize: 20}}>Inventory App</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      backgroundColor: '#359fbd',
      flexDirection: 'column-reverse',
    },
    loadingscreen: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        marginBottom: 50
    }
});