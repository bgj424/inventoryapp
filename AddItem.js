import { database, auth } from './Database'
import { addItem, saveItem, saveItemInfo } from './database_functions/ItemData'
import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ref, get } from "firebase/database";
import { styles } from './Styles';
import { StyledInput } from './components/StyledInput';
import { updateInvalidInputsList } from './functions/updateInvalidInputsList';
import { SolidButton } from './components/SolidButton';
// Insert specified amount of specific item to your inventory
export const AddItem = ({ navigation, route }) => {
    const [item, setItem] = useState({})
    const [checkInputValues, setCheckInputValues] = useState(false)
    const [error, setError] = useState('')
    let invalidInputsList = []
    
    // Get item information if it exists
    useFocusEffect(
      React.useCallback(() => {
        if(route.params.item) {
          setItem({
            name: route.params.item.name,
            description: route.params.item.description,
            amount: route.params.item.amount,
            id: route.params.item.id
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

    // Add item to db
    const add = () => {
        setError('')
        if(invalidInputsList.length > 0) return
        
        // Add new item
        if(!route.params.edit) {
          addItem(
              route.params.collection, 
              item.id ?? item.name, 
              item.name, item.description, item.amount
          )
          .catch(e => {
              setError(e)
              return
          })

        // Edit already existing item
        } else {
            saveItem(
              route.params.collection, 
              item.id ?? item.name, 
              item.name, item.description, item.amount
            )
            saveItemInfo(
              item.id, 
              item.name, 
              item.description
            )
        }

        navigation.navigate('Item List', {
            collection: route.params.collection,
            item: {
                name: item.name,
                description: item.description,
            }
        })
    }

    return(
        <View style={{margin: 50}}>
            <StyledInput
              label="Name"
              checkValue={checkInputValues}
              handleInvalidValue={handleInvalidValue}
              onChangeText={name => {setItem({...item, name: name}); setError('')}}
              value={item.name}
              placeholder="Name for item"
              icon="tag"
            />

            <StyledInput
              label="Description"
              checkValue={checkInputValues}
              handleInvalidValue={handleInvalidValue}
              onChangeText={description => {setItem({...item, description: description}); setError('')}} 
              value={item.description}
              placeholder="Item description"
              icon="quote-right"
            />

            <StyledInput
              label="Quantity"
              checkValue={checkInputValues}
              handleInvalidValue={handleInvalidValue}
              matchType="number"
              keyboardType="numeric" 
              onChangeText={amount => {setItem({...item, amount: amount}); setError('')}} 
              value={item.amount}
              placeholder="Quantity"
              icon="cubes"
            />

            {!!item.id == ""  && // No id
              <View>
                <Text style={styles.buttonLabel}>
                  Save with a barcode (optional)
                </Text>
                <SolidButton 
                  onPress={() => 
                    navigation.navigate('Barcode Scanner', {
                      collection: route.params.collection,
                      name: item.name,
                      description: item.description,
                      amount: item.amount
                    }
                  )} 
                  title="Scan barcode"
                  icon="camera"
                />
              </View>
            }  
            <SolidButton 
              onPress={() => setCheckInputValues(checkInputValues + 1) } 
              title={route.params.edit ? "Save" : "Add item"}
              icon={route.params.edit ? "check" : "plus"}
            />
            {!!error && <Text style={styles.error}>{error}</Text>}
        </View>
    )
}