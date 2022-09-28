import { database, auth } from './Database'
import { addCollection } from './database_functions/CollectionData';
import { changeUserData } from './database_functions/UserData'
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { increment } from "firebase/database";
import { ColorPicker } from './components/ColorPicker';
import { SolidButton } from './components/SolidButton';
import { StyledInput } from './components/StyledInput';
import { updateInvalidInputsList } from './functions/updateInvalidInputsList';

export const AddCollection = ({ navigation, route }) => {
    const colors = useTheme().colors;
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [currentColor, setCurrentColor] = useState(null);
    const [checkInputValues, setCheckInputValues] = useState(false);
    let invalidInputsList = [];

    const add = () => {
        setError('')
        addCollection(name, currentColor)
        .then(result => {
            changeUserData({collectionsCreated: increment(1)})
            navigation.navigate('Collections', {
                name: name,
                color: currentColor
            })
        })
        .catch(e => setError(e))
    }

    useEffect(() => {
      if(checkInputValues) {
          add()
      }
    }, [checkInputValues])

    // Function called by Styled Input
    const handleInvalidValue = (inputName, valueIsInvalid) => {
        invalidInputsList =
            updateInvalidInputsList(
                invalidInputsList, inputName, valueIsInvalid
            ) 
    }

    return(
        <KeyboardAvoidingView style={[styles.container, {alignItems:"center"}]}>
            <View style={[styles.inputBox]}>
                <StyledInput
                    label="Collection name"
                    style={{width:50}}
                    onChangeText={name => {setName(name); setError('')}} 
                    value={name}
                    placeholder="Name for collection"
                    icon="tag"
                    iconColor={currentColor === null ? colors.reverse.card : currentColor}
                    checkValue={checkInputValues}
                    handleInvalidValue={handleInvalidValue}
                />
                <ColorPicker
                  onColorChange={(color) => setCurrentColor(color)}
                />
                <View style={{marginTop:100, alignItems:"center"}}>
                    <Text style={styles.error}>
                        {error}
                    </Text>
                    <SolidButton
                      style={{width: 200}}
                      onPress={() => setCheckInputValues(checkInputValues + 1)} 
                      title="Add item"
                    />
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