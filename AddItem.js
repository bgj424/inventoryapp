import { database, auth } from './Database'
import { addItem, saveItem, saveItemInfo } from './database_functions/ItemData'
import React, { useState, useEffect } from 'react';
import { Text, View, KeyboardAvoidingView } from 'react-native';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { ref, get } from "firebase/database";
import { styles } from './Styles';
import { StyledInput } from './components/StyledInput';
import { updateInvalidInputsList } from './functions/updateInvalidInputsList';
import { SolidButton } from './components/SolidButton';
import { Divider } from 'react-native-elements';

// Insert specified amount of specific item to your inventory
export const AddItem = ({ navigation, route }) => {
    const [item, setItem] = useState({})
    const [doInputValueCheck, setDoInputValueCheck] = useState(false)
    const [error, setError] = useState('')
    let invalidInputsList = []
    const colors = useTheme().colors;

    // Get item information if it exists
    useFocusEffect(
      React.useCallback(() => {
        if(route.params.item) {
          setItem({
            name: route.params.item.name,
            description: route.params.item.description,
            amount: route.params.item.amount,
            id: route.params.item.id,
            barcode: route.params.barcode ?? null
          })
        }

        if(item.id) {
          // Autofill item information
          get(ref(
            database, 'users/' + auth.currentUser.uid + '/iteminfo/' + item.id
          ))
          .then(snapshot => {
            const itemSnapshot = snapshot.val();
            if(itemSnapshot) {
              setItem({
                ...item, 
                name: itemSnapshot.name, 
                description: itemSnapshot.description
              })
            }
            return item
          })
        }
        return () => {
        };
      }, [route])
    );

    useEffect(() => {
      if(doInputValueCheck && !invalidInputsList.length > 0) {
        submit()
      }
    }, [doInputValueCheck])

    // Function called by Styled Input
    const handleInvalidValue = (inputName, valueIsInvalid) => {
      invalidInputsList =
        updateInvalidInputsList(
          invalidInputsList, inputName, valueIsInvalid
        ) 
    }

    const submit = () => {
      setError('')
      let errMsg
      
      // Add new item
      if(!route.params.edit) {
        addItem(
          route.params.collection, 
          item.name, 
          item.amount,
          item.barcode,
          item.description
        )
        .catch(e => {
          errMsg = "Error while adding item (" + e.code + ")"
        })

      // Edit already existing item
      } else {
        saveItem(
          route.params.collection, 
          item.name,
          item.amount,
          item.id,
          item.description
        )
        saveItemInfo(
          item.id, 
          item.name, 
          item.description,
          item.barcode
        )
      }

      if(!errMsg) {
        navigation.navigate('Item List', {
          collection: route.params.collection,
          color: route.params.color,
          item: {...item}
        })
      } else setError(errMsg)
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
                    {/* Form */}
                    <StyledInput
                      label="Name"
                      matchType="text"
                      checkValue={doInputValueCheck}
                      handleInvalidValue={handleInvalidValue}
                      onChangeText={name => {setItem({...item, name: name}); setError('')}}
                      value={item.name}
                      placeholder="Name for item"
                      icon="tag"
                    />

                    <StyledInput
                      label="Description"
                      checkValue={doInputValueCheck}
                      handleInvalidValue={handleInvalidValue}
                      onChangeText={description => {setItem({...item, description: description}); setError('')}} 
                      value={item.description}
                      placeholder="Item description"
                      icon="quote-right"
                    />

                    <StyledInput
                      label="Amount"
                      checkValue={doInputValueCheck}
                      handleInvalidValue={handleInvalidValue}
                      matchType="number"
                      keyboardType="numeric" 
                      onChangeText={amount => {setItem({...item, amount: amount}); setError('')}} 
                      value={item.amount}
                      placeholder="Amount"
                      icon="cubes"
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          {/* Footer */}
          <View style={[{width:"100%", alignItems:"center"}]}>
            {/* Add button */}
            <View style={{alignItems:"center"}}>
              {!!item.id == ""  && // No id
                <>
                <Text style={{color:colors.text}}>
                  Save with a barcode (optional)
                </Text>
                <SolidButton
                  color="warning"
                  style={{width:200}}
                  onPress={() => 
                    navigation.navigate('Barcode Scanner', {
                      collection: route.params.collection,
                      color: route.params.color,
                      item: {...item}
                    }
                  )} 
                  title="Scan barcode"
                  icon="camera"
                />
                </>
              }  
              <SolidButton
                style={{width:200}}
                onPress={() => setDoInputValueCheck(doInputValueCheck + 1)} 
                title={route.params.edit ? "Save" : "Add item"}
                icon={route.params.edit ? "check" : "plus"}
              />
              {!!error && <Text style={styles.error}>{error}</Text>}
            </View>
          </View>
        </KeyboardAvoidingView>
        </>
    )
}