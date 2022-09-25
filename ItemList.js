import * as db from './Database';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions } from 'react-native';
import { ref, get, onValue, orderByChild, equalTo, query } from "firebase/database";
import { ListItem, Input, TouchableOpacity, Button, Avatar, Badge, ListItemProps, Switch, lightColors } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ColorPresets, styles } from './Styles';
import { SolidButton } from './components/SolidButton';
import { useTheme } from '@react-navigation/native';
import { color } from 'react-native-elements/dist/helpers';

export const ItemList = ({ navigation, route }) => {
    const [items, setItems] = useState('')
    const colors = useTheme().colors;
  
    // Updating list from db
    useEffect(() => {
      onValue(ref(
        db.database, 'users/' + db.auth.currentUser.uid + '/itemdata/' + route.params.collection
      ), (snapshot) => {
        const data = snapshot.val();
        if(data) {
          setItems( // Make array with keys for flatlist
            Object.entries(data).map(item => ({...item[1], key: item[0]}))
          )
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
                db.removeItem(route.params.collection, item.key)
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
            db.removeCollection(route.params.collection)
            navigation.navigate('Collections')
          }} 
          title="Delete collection"
          icon="trash"
          color="error"
        />
      </View>
    )
}