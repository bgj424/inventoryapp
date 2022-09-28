import { database, auth } from './Database'
import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, SafeAreaView } from 'react-native';
import { ref, onValue } from "firebase/database";
import { ListItem, ButtonGroup, Badge } from 'react-native-elements';
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
            database, 'users/' + auth.currentUser.uid + '/collections'
        ), (snapshot) => {
            const data = snapshot.val();

            if(data) {
                let flatlistArray = 
                  Object.entries(data).map( // Make array with keys for flatlist
                    collection => ({...collection[1], key: collection[0]})
                  )
                setCollections(flatlistArray)
                navigation.setOptions({ title: `My Collections (${flatlistArray.length ?? 0})` })
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
          containerStyle={{backgroundColor: item.color}}
        >
          <ListItem.Content>
            <View>
              <ListItem.Title style={{color: colors.text}}>
                <Badge
                  value={item.itemCount + " items"}
                  containerStyle={{
                   height:20
                  }}
                />
                <Text
                  style={{padding:10, color: item.color?colors.lightText:colors.text}}
                >
                  {item.key}
                </Text>
              </ListItem.Title>
            </View>
          </ListItem.Content>
        </ListItem>
      )
  
    const sortListData = (data) => {
      if(!data) return
      if(sortedBy === 1) { // by date
        return (data.sort((a, b) => a.creationDate > b.creationDate))
      } else { // by name
        data = data.sort((a, b) => a.key.toLowerCase().localeCompare(b.key.toLowerCase())) // Sort by name
        if(sortedBy === 0) 
          return data
        else // by name + itemcount
          return (data.sort((a, b) => a.itemCount < b.itemCount))
      }
    }

    return(
      <SafeAreaView>
        <ButtonGroup
          onPress={(value) => {setSortedBy(value)}}
          selectedIndex={sortedBy}
          buttons={buttons}
          containerStyle={{backgroundColor: colors.background}}
          selectedButtonStyle={{backgroundColor: colors.primary}}
          textStyle={{color: colors.text}}
        />
        <View style={{height:600}} >
          <FlatList
            style={{minHeight:400}}
            data={sortListData(collections) ?? null}
            renderItem={listElement}
          />
        </View>
        <View style={{alignItems:"center",marginTop:20}}>
            <SolidButton
                style={{width:200}}
                icon="plus" 
                title="Create new collection" 
                color="primary"
                onPress={() => navigation.navigate('New Collection')} 
            />
        </View>
      </SafeAreaView>
    )
}