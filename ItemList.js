import React, { useState, useEffect } from 'react';
import { database, auth } from './Database'
import { removeCollection } from './database_functions/CollectionData';
import { StyleSheet, Text, View, FlatList, Dimensions } from 'react-native';
import { ref, onValue } from "firebase/database";
import { ListItem, Dialog, Badge } from 'react-native-elements';
import { ColorPresets, styles } from './Styles';
import { SolidButton } from './components/SolidButton';
import { useTheme } from '@react-navigation/native';
import { color } from 'react-native-elements/dist/helpers';
import { TransparentButton } from './components/TransparentButton';
export const ItemList = ({ navigation, route }) => {
    const [items, setItems] = useState('')
    const [deletionDialogVisible, setDeletionDialogVisible] = useState(false)
    const colors = useTheme().colors;
  
    // Updating list from db
    useEffect(() => {
      onValue(ref(
        database, 'users/' + auth.currentUser.uid + '/itemdata/' + route.params.collection
      ), (snapshot) => {
        const data = snapshot.val();
        if(data) {
          let flatlistArray =
            Object.entries(data).map( // Make array with keys for flatlist
              item => ({...item[1], key: item[0]})
            )
          setItems(flatlistArray)
          navigation.setOptions({ title: `${route.params.collection} (${flatlistArray.length ?? 0} items)` })
        } else {
          setItems('')
        }
      })
    }, []);

    const listElement = ({ item }) => (
        <ListItem.Swipeable 
          bottomDivider
          onPress={() =>
            navigation.navigate('Item Information', {
              collection: route.params.collection,
              item: {
                id: item.key,
                name: item.name,
                description: item.description,
                amount: item.amount
              }
            }
          )}
          containerStyle={{backgroundColor: colors.background}}
          leftContent={
            <View style={{flexDirection: "row", minHeight: '100%', flex: 1}}>
            <SolidButton
              style={{flex: 1, margin: 0, minHeight: '100%', borderRadius: 0}}
              icon="trash"
              color="error"
              onPress={() => {
                removeItem(route.params.collection, item.key)
              }}
            />
            <SolidButton
              style={{flex: 1, margin: 0, minHeight: '100%', borderRadius: 0}}
              icon="pencil"
              color="warning"
              onPress={() => {
                navigation.navigate('Add Item', {
                  collection: route.params.collection,
                  item: {
                    id: item.key,
                    name: item.name,
                    description: item.description,
                    amount: item.amount,
                  },
                  edit: true
                })
              }} 
            />
            </View>
          }
        >
          <Badge 
            value={item.amount}
            badgeStyle={{
              backgroundColor: "red"
            }}
          />
          <ListItem.Title style={{color: colors.text}}>
            {item.name}
          </ListItem.Title>
          <ListItem.Subtitle style={{color: colors.subtitle}}>
            {item.description}
          </ListItem.Subtitle>
        </ListItem.Swipeable>
    )
  
    return(
      <View>
        <FlatList 
          data={items}
          renderItem={listElement}
        />
        <SolidButton
          onPress={() => 
            navigation.navigate('Add Item', {
              collection: route.params.collection
            })
          } 
          title="Add item"
          icon="plus"
          color="primary"
        />
        <SolidButton 
          onPress={() => {
              setDeletionDialogVisible(!deletionDialogVisible)
          }} 
          title="Delete collection"
          icon="trash"
          color="error"
        />

        <Dialog
          isVisible={deletionDialogVisible}
          onBackdropPress={() => setDeletionDialogVisible(!deletionDialogVisible)}
          overlayStyle={{backgroundColor: colors.card}}
        >
          <Dialog.Title titleStyle={{color: colors.text}} title="Confirm deletion" />
          <Text style={{color: colors.text}}>Are you sure you want 
            to delete collection {route.params.collection}?
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
                  removeCollection(route.params.collection)
                  navigation.navigate('Collections')
                }}
              />
            </Dialog.Actions>
          </View>
        </Dialog>
      </View>
    )
}