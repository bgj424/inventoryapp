import { database, auth } from './Database'
import { addCollection } from './database_functions/CollectionData';
import { changeUserData } from './database_functions/UserData'
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { increment } from "firebase/database";
import { ColorPicker } from './components/ColorPicker';
import { SolidButton } from './components/SolidButton';
import { StyledInput } from './components/StyledInput';
import { updateInvalidInputsList } from './functions/updateInvalidInputsList';
import { Divider, Dialog } from 'react-native-elements';

export const AddCollection = ({ navigation, route }) => {
    const colors = useTheme().colors;
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [currentColor, setCurrentColor] = useState(null);
    const [visibleDialog, setVisibleDialog] = useState('');
    const [checkInputValues, setCheckInputValues] = useState(false);
    let invalidInputsList = [];

    // Get collection information if it exists
    useFocusEffect(
      React.useCallback(() => {
        if(route.params?.collection) {
          setName(route.params?.collection)
          setCurrentColor(route.params?.color)
        }
        return () => {
        };
      })
    )

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
      <>
      <KeyboardAvoidingView style={[{flex:1, alignItems:"center", backgroundColor:colors.background, padding: 20}]}>
        <View style={{flex:1}}>
          <View style={{height:"100%", justifyContent:"center"}}>
            {/* Main container */}
            <View style={[{width:"100%",flexDirection:"row",alignItems:"center", backgroundColor:colors.card, borderRadius:5, padding:20}]}>
              <View style={{width:"100%"}}>
              <Text style={{color:colors.primary3, fontSize:22, fontWeight:"bold"}}>Item details</Text>
              <Divider color={colors.reverse.card} style={{marginVertical:10}} />
                <View>
                  <StyledInput
                      label="Collection name"
                      style={{width:50}}
                      matchType="text"
                      onChangeText={name => {setName(name); setError('')}} 
                      value={name}
                      placeholder="Name for collection"
                      icon="tag"
                      iconColor={currentColor === null ? colors.reverse.card : currentColor}
                      checkValue={checkInputValues}
                      handleInvalidValue={handleInvalidValue}
                  />
                  <View style={{alignItems:"center"}}>
                    <ColorPicker
                      onColorChange={(color) => setCurrentColor(color)}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* Footer */}
        <View style={[{width:"100%", alignItems:"center"}]}>
          {/* Add button */}
          <View style={{alignItems:"center"}}>
            <Text style={styles.error}>{error}</Text>
            {!!route.params?.edit === true &&
            <View>
              <SolidButton
                style={{width: 200}}
                onPress={() => setVisibleDialog("delete")} 
                title="Delete collection"
                color="error"
              />
            </View>
            }
            <SolidButton
              style={{width: 200}}
              onPress={() => setCheckInputValues(checkInputValues + 1)} 
              title="Confirm"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
      <Dialog
        isVisible={visibleDialog === "delete" ? true : false}
        onBackdropPress={() => setDeletionDialogVisible(!deletionDialogVisible)}
        overlayStyle={{backgroundColor: colors.card}}
      >
          <Dialog.Title titleStyle={{color: colors.text}} title="Confirm deletion" />
          <Text style={{color: colors.text}}>Are you sure you want 
            to delete collection {route.params?.collection}?
          </Text>
          <View style={{width:350}}>
            <Dialog.Actions>
              <SolidButton
                style={{width: 100}}
                title="Cancel"
                color="error"
                onPress={() => setDeletionDialogVisible(!deletionDialogVisible)}
              />
              <SolidButton
                style={{width: 100}}
                title="Confirm"
                color="success"
                onPress={() => {
                  removeCollection(route.params?.collection)
                  navigation.navigate('Collections')
                }}
              />
            </Dialog.Actions>
          </View>
      </Dialog>
      </>
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