import * as db from './Database'
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, KeyboardAvoidingView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ref, get, onValue, orderByChild, equalTo, query } from "firebase/database";
import { ListItem, Input, Button, ButtonGroup, Avatar, Badge, ListItemProps, Switch, lightColors } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import ColorPicker from 'react-native-wheel-color-picker'
import { SolidButton } from './components/SolidButton';

export const AddCollection = ({ navigation, route }) => {
    const [name, setName] = useState('');
    const [inputError, setInputError] = useState('');
    const [currentColor, setCurrentColor] = useState('');

    const add = () => {
        setInputError('')
        db.addCollection(name, currentColor)
        .then(result => {
            navigation.navigate('Collections', {
                name: name,
                color: currentColor
            })
        })
        .catch(e => setInputError(e))
    }

    return(
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.inputBox}>
                <Text>Collection name {currentColor}</Text>
                <Input 
                    style={styles.input} 
                    onChangeText={name => setName(name)} 
                    value={name}
                    placeholder="Collection name"
                    leftIcon={
                    <Icon name='tag' size={22} color={"gray"} />
                    }
                />
                <View style={{alignItems: 'center'}}>
                  <ColorPicker
                    onColorChange={(color) => {setCurrentColor(color)}}
                    thumbSize={40}
                    sliderSize={40}
                    noSnap={true}
                    row={false}
                    sliderHidden={true}
                    swatches={false}
                  />
                  {!!inputError &&
                      <Text style={[styles.error, {margin: 20}]}>
                          {inputError}
                      </Text>
                  }
                  <View style={{width: 170}}>
                      <SolidButton onPress={() => add()} title="Add item" />
                  </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
    },
    row: {
      flexWrap: 'wrap',
      flexDirection: "row",
    },
    error: {
      color: 'red'
    },
    buttonSolid: {
      width: 50,
    },
    inputBox: {
      margin: 20,
      width: 400,
    },
    input: {
      padding: 10,
    },
    buttonLabel: {
      marginBottom: 5, 
      marginTop: 15
    }
});