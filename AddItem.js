import * as db from './Database'
import React, { useState, useEffect, createRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ref, get } from "firebase/database";
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from './Styles';
import { StyledInput } from './components/StyledInput';

// Insert specified amount of specific item to your inventory
export const AddItem = ({ navigation, route }) => {
    const [item, setItem] = useState({})
    const [invalidInputsList, setInvalidInputsList] = useState([])
    const [checkInputValues, setCheckInputValues] = useState(false)

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
            db.database, 'users/' + db.auth.currentUser.uid + '/iteminfo/' + item.id
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
    }, [invalidInputsList])

    // StyledInput calls this to update status of each input element
    const handleInvalidValue = (inputName, valueIsInvalid) => {
        if(valueIsInvalid) {
            if(!invalidInputsList.includes(inputName))
                // Add to invalid inputs list
                setInvalidInputsList([...invalidInputsList, inputName])
            else return
        } else {
            // Remove from invalid inputs list
            setInvalidInputsList(
                invalidInputsList.filter(
                  el => el !== inputName
                )       
            )
        }
    }

    // Add item to db
    const add = () => {
        
        console.log(invalidInputsList.length, "len")
        if(invalidInputsList.length > 0) return

        if(item.id) {
          db.addItemInfo(item.id, item.name, item.description)
        }

        db.storeItem(
          route.params.collection, 
          (item.id ?? item.name), 
          item.name, item.description, item.amount
        )
        
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
              onChangeText={name => setItem({...item, name: name})}
              value={item.name}
              placeholder="Name for item"
              icon="tag"
            />

            <StyledInput
              label="Description"
              checkValue={checkInputValues}
              handleInvalidValue={handleInvalidValue}
              onChangeText={description => setItem({...item, description: description})} 
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
              onChangeText={amount => setItem({...item, amount: amount})} 
              value={item.amount}
              placeholder="Quantity"
              icon="cubes"
            />

            {!!item.id == ""  && // No id
              <View>
                <Text style={styles.buttonLabel}>
                  Save with a barcode (optional)
                </Text>
                <Button onPress={() => 
                  navigation.navigate('Barcode Scanner', {
                    collection: route.params.collection,
                    name: item.name,
                    description: item.description,
                    amount: item.amount
                  })} title="Scan barcode" 
                />
              </View>
            }  

            <Button onPress={() => setCheckInputValues(true) } title="Add item" />
        </View>
    )
}