import { database, auth } from './Database'
import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, KeyboardAvoidingView } from 'react-native';
import { ref, onValue } from "firebase/database";
import { ListItem, ButtonGroup, Badge, Divider } from 'react-native-elements';
import { styles } from './Styles';
import { SolidButton } from './components/SolidButton';
import { useTheme } from '@react-navigation/native';
import { TransparentButton } from './components/TransparentButton';

export const CollectionList = ({ navigation, route }) => {
    const [collections, setCollections] = useState([]);
    const [sortedBy, setSortedBy] = useState(0);
    const [reverseSortedBy, setReverseSortedBy] = useState(false);
    const colors = useTheme().colors;

    // Setup listener that updates the list
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
                setCollections([])
            }
        })
    }, []);
    
    const listElement = ({ item }) => (
      <ListItem 
        bottomDivider
        onPress={() =>
        navigation.navigate('Item List', {
          collection: item.key,
          itemCount: item.itemCount,
          color: item.color
        })}
        titleStyle={{fontWeight: 'bold'}}
        containerStyle={{backgroundColor: item.color}}
      >
        <ListItem.Content>
          <View style={{flexDirection:"row"}}>
            <ListItem.Title style={{flex:1}}>
              <Text style={{padding:10, color: item.color?colors.lightText:colors.text, fontWeight: "bold"}}>
                {item.key}
              </Text>
            </ListItem.Title>
            <Text style={{color: item.color?colors.lightText:colors.text}}>{item.itemCount} items</Text>
          </View>
        </ListItem.Content>
        <ListItem.Chevron size={20} />
      </ListItem>
    )
  
    const sortListData = (data) => {
      if(!data) return
      let sortedData;
      if(sortedBy === 1) { // by date
        sortedData = data.sort((a, b) => a.creationDate > b.creationDate)
      } else { // by name
        sortedData = data.sort((a, b) => a.key.toLowerCase().localeCompare(b.key.toLowerCase())) // Sort by name
        if(sortedBy !== 0) // by name + itemcount
          sortedData = data.sort((a, b) => a.itemCount < b.itemCount)
      }
      if(reverseSortedBy)
        sortedData = sortedData.reverse()
      return sortedData
    }

    return(
      <KeyboardAvoidingView style={[{flex:1, alignItems:"center", backgroundColor:colors.background, padding: 20}]}>
      <View style={{flex:1}}>
        {/* Main Container */}
        <View style={[{width:"100%",flexDirection:"row",alignItems:"center", backgroundColor:colors.card, borderRadius:5, padding:20}]}>
          <View style={{width:"100%"}}>
          <Text style={{color:colors.subtle, fontSize:13, marginLeft:10}}>Sorted by:</Text>
            <View style={{flexDirection:"row"}}>
              <ButtonGroup
                buttons={['Name', 'Created', 'Item Count']}
                onPress={(value) => {
                  setSortedBy(value)
                }}
                selectedIndex={sortedBy}
                containerStyle={{backgroundColor: colors.background, width:400}}
                selectedButtonStyle={{backgroundColor: colors.primary}}
                textStyle={{color: colors.text}}
              />
              <TransparentButton 
                style={{width:40, borderColor:"white", marginLeft:-10}}
                icon={reverseSortedBy ? "arrow-up": "arrow-down"}
                iconColor={reverseSortedBy ? colors.warning : colors.primary}
                iconSize={25}
                onPress={() => {
                  setReverseSortedBy(!reverseSortedBy)
                }}
              />
            </View>
            {/* Collection List */}
            {collections !== [] ? <>
              <Text style={{color:colors.extradark, fontSize:20, fontWeight:"bold", marginTop:5}}>Own collections</Text>
              <Divider color={colors.reverse.card} style={{marginTop:10,marginBottom:10}} />
              <FlatList
                style={{minHeight:500}}
                data={sortListData(collections) ?? null}
                renderItem={listElement}
              />
            </> : null}
          </View>
        </View>
      </View>
      {/* Footer */}
      <View style={[{width:"100%",flexDirection:"row",alignItems:"center"}]}>
        {/* Add button */}
        <View style={{flex:1, alignItems:"center"}}>
          <SolidButton
            style={{width:200}}
            icon="plus" 
            title="Create new collection" 
            color="primary"
            onPress={() => navigation.navigate('New Collection')} 
          />
        </View>
      </View>
      </KeyboardAvoidingView>
    )
}
