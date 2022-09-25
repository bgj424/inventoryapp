import * as db from './Database'
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Camera } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';
import { ref, get, onValue, orderByChild, equalTo, query } from "firebase/database";
import { ListItem, Input, Button, Avatar, Badge, ListItemProps, Switch, lightColors } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BarcodeScanner } from './BarcodeScanner';
import { ItemList } from './ItemList';
import { styles } from './Styles';

export const ItemInfo = ({ navigation: { goBack }, route }) => {
  const [items, setItems] = useState([]);
  
  // Updating list from db
  /*
  useEffect(() => {
    onValue(ref(db.database, 'users/' + db.auth.currentUser.uid + '/itemdata/' + collection), (snapshot) => {
      const data = snapshot.val();
      if(data) {
        setItems(Object.values(data))
      }});
  }, []); */

  return(
      <View>
          <Text>Item info</Text>
          <Text>Collection: {route.params.collection}</Text>
          <Text>ID: {route.params.item.id}</Text>
          <Text>Name: {route.params.item.name}</Text>
          <Text>Description: {route.params.item.description}</Text>
          <Text>Amount: {route.params.item.amount}</Text>
          <Button 
            onPress={() => {
              db.removeItem(route.params.collection, route.params.item.id)
              goBack()
            }} 
            title="Delete item"
            icon={
              <Icon
                name="trash"
                size={15}
                color="white"
              />
            }
          />
      </View>
  )
}