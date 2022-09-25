import * as db from './Database'
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, KeyboardAvoidingView } from 'react-native';
import { ref, get, onValue, orderByChild, equalTo, query } from "firebase/database";
import { ListItem, Input, Button, ButtonGroup, Avatar, Badge, ListItemProps, Switch, lightColors } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import ColorPicker from 'react-native-wheel-color-picker';
import { styles } from './Styles';
import { SolidButton } from './components/SolidButton';
import { useTheme } from '@react-navigation/native';

export const CollectionList = ({ navigation, route }) => {
    const [collections, setCollections] = useState('');
    const [sortedBy, setSortedBy] = useState(0)
    const buttons = ['Name', 'Created', 'Item Count']
    const colors = useTheme().colors;

    // Updating list from db
    useEffect(() => {
        onValue(ref(
            db.database, 'users/' + db.auth.currentUser.uid + '/collections'
        ), (snapshot) => {
            const data = snapshot.val();

            if(data) {
                setCollections( // Make array with keys for flatlist
                    Object.entries(data).map(collection => ({...collection[1], key: collection[0]}))
                )
            } else {
                setCollections('')
            }
        })
      }, []);
    
      const listElement = ({ item }) => (
        <ListItem 
          bottomDivider 
          onPress={() =>
          navigation.navigate('Item List', {
            collection: item.key,
            itemCount: item.itemCount
          })}
          titleStyle={{fontWeight: 'bold'}}
          containerStyle={{backgroundColor: colors.background}}
        >
          <ListItem.Content>
              <ListItem.Title style={{color: colors.text}}>
                <Badge 
                  value={item.itemCount + " items"}
                  badgeStyle={{
                    backgroundColor: item.color ?? "red"
                  }}
                />
                {item.key}
              </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      )
  
    const sortListData = (data) => {
      if(!data) return
      if(sortedBy === 1) { // by date
        return (data.sort((a, b) => a.creationDate > b.creationDate))
      } else { // by name
        data = data.sort((a, b) => a.key.localeCompare(b.key)) // Sort by name
        if(sortedBy === 0) 
          return data
        else // by name + itemcount
          return (data.sort((a, b) => a.itemCount < b.itemCount))
      }
    }

    return(
      <View>
        <ButtonGroup
          onPress={(value) => {setSortedBy(value)}}
          selectedIndex={sortedBy}
          buttons={buttons}
          containerStyle={{backgroundColor: colors.background}}
          selectedButtonStyle={{backgroundColor: colors.primary}}
          textStyle={{color: colors.text}}
        />
        <FlatList 
          data={sortListData(collections) ?? null}
          renderItem={listElement}
        />
        <SolidButton 
            icon="plus" 
            title="test" 
            color="primary"
            onPress={() => navigation.navigate('New Collection')} 
        />
      </View>
    )
}