import React, { useState, useEffect } from 'react';
import { database, auth } from './Database'
import { removeCollection } from './database_functions/CollectionData';
import { StyleSheet, Text, View, FlatList, Dimensions, KeyboardAvoidingView } from 'react-native';
import { ref, onValue } from "firebase/database";
import { ListItem, Dialog, Badge, ButtonGroup, Divider } from 'react-native-elements';
import { ColorPresets, styles } from './Styles';
import { SolidButton } from './components/SolidButton';
import { useTheme } from '@react-navigation/native';
import { color } from 'react-native-elements/dist/helpers';
import { TransparentButton } from './components/TransparentButton';
import { AddItem } from './AddItem';
import { InfoDialog } from './components/InfoDialog'

export const ItemList = ({ navigation, route }) => {
    const [items, setItems] = useState('')
    const [deletionDialogVisible, setDeletionDialogVisible] = useState(false)
    const [sortedBy, setSortedBy] = useState(0);
    const [reverseSortedBy, setReverseSortedBy] = useState(false);
    const [dialogMessage, setDialogMessage] = useState({});
    const [visibleDialog, setVisibleDialog] = useState('');
    const colors = useTheme().colors;
  
    const changeVisibleDialog = (value, data = null) => { 
        if(value !== null) setVisibleDialog(value)
        if(data) setDialogMessage(data)
    }

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
          navigation.setOptions({ title: `${route.params.collection} (${flatlistArray.length ?? 0} items)`, headerTintColor: route.params.color ? '#fff' : colors.text })
        } else {
          setItems('')
        }
      })
    }, []);

    const sortListData = (data) => {
      if(!data) return
      let sortedData;
      if(sortedBy === 1) { // by date
        sortedData = data.sort((a, b) => a.creationDate > b.creationDate)
      } else { // by name
        sortedData = data.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())) // Sort by name
        if(sortedBy !== 0) // by name + itemcount
          sortedData = data.sort((a, b) => a.amount < b.amount)
      }
      if(reverseSortedBy)
        sortedData = sortedData.reverse()
      return sortedData
    }

    const listElement = ({ item }) => (
        <ListItem.Swipeable 
          bottomDivider
          onPress={() => {
            setDialogMessage({title: item.name, message:
              <ListItem bottomDivider containerStyle={{backgroundColor: colors.card}}>
              <ListItem.Content>
                <View style={{flexDirection:"row"}}>
                  <ListItem.Title style={{color: colors.text, flex: 10}}>
                    Description
                  </ListItem.Title>
                  <ListItem.Subtitle style={{color: colors.subtitle}}>
                    {item.de}
                  </ListItem.Subtitle>
                </View>
              </ListItem.Content>
            </ListItem>})
          }}
          containerStyle={{backgroundColor: colors.card}}
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
            textStyle={{fontWeight:"bold"}}
            badgeStyle={{
              backgroundColor: route.params.color ?? colors.primary,
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
      <>
      <KeyboardAvoidingView style={[{flex:1, alignItems:"center", backgroundColor:colors.background, padding: 20}]}>
        <View style={{flex:1}}>
          {/* Main container */}
          <View style={[{width:"100%",flexDirection:"row",alignItems:"center", backgroundColor:colors.card, borderRadius:5, padding:20}]}>
            <View style={{width:"100%"}}>
              <Text style={{color:colors.subtle, fontSize:13, marginLeft:10}}>Sorted by:</Text>
              <View style={{flexDirection:"row"}}>
                {/* Sorting */}
                <ButtonGroup
                  buttons={['Name', 'Empty', 'Amount']}
                  onPress={(value) => {
                    setSortedBy(value)
                  }}
                  selectedIndex={sortedBy}
                  containerStyle={{backgroundColor: colors.background, width:400}}
                  selectedButtonStyle={{backgroundColor: route.params.color ?? colors.primary}}
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
              {/* Item List */}
              {items !== [] ? <>
                <Text style={{color:colors.extradark, fontSize:20, fontWeight:"bold", marginTop:5}}>Items</Text>
                <Divider color={colors.reverse.card} style={{marginTop:10,marginBottom:10}} />
                <FlatList
                  style={{minHeight:500}}
                  data={sortListData(items)}
                  renderItem={listElement}
                />
              </> : null}
            </View>
          </View>
        </View>
        {/* Footer */}
        <View style={[{width:"100%", alignItems:"center"}]}>
          {/* Add button */}
          <View style={{flexDirection:"row"}}>
            <SolidButton
              style={{width:200}}
              onPress={() => 
                navigation.navigate('Add Item', {
                  collection: route.params.collection
                })
              } 
              title="Add Item"
              icon="plus"
              color="primary"
            />
            <SolidButton
              style={{width:200}}
              onPress={() => {
                  setDeletionDialogVisible(!deletionDialogVisible)
              }} 
              title="Edit Collection"
              icon="edit"
              color="warning"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
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
      <InfoDialog 
        message={dialogMessage}
        visibleDialog={visibleDialog}
        changeVisibleDialog={changeVisibleDialog}
      />
      </>
    )
}