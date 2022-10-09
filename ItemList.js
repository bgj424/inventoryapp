import React, { useState, useEffect, useMemo } from 'react';
import { database, auth } from './Database'
import { removeCollection } from './database_functions/CollectionData';
import { StyleSheet, Text, View, FlatList, Dimensions, KeyboardAvoidingView } from 'react-native';
import { ref, onValue } from "firebase/database";
import { ListItem, Dialog, Badge, ButtonGroup, Divider } from 'react-native-elements';
import { ColorPresets, styles } from './Styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SolidButton } from './components/SolidButton';
import { useTheme } from '@react-navigation/native';
import { color } from 'react-native-elements/dist/helpers';
import { TransparentButton } from './components/TransparentButton';
import { AddItem } from './AddItem';
import { InfoDialog } from './components/InfoDialog'
import { convertUnix } from './functions/convertUnix';
import Barcode from "react-native-barcode-builder";
import { StyledInput } from './components/StyledInput';
import { Ionicons } from '@expo/vector-icons';

export const ItemList = ({ navigation, route }) => {
    const [items, setItems] = useState('');
    const [selectedItem, setSelectedItem] = useState({});
    const [sortedBy, setSortedBy] = useState(0);
    const [reverseSortedBy, setReverseSortedBy] = useState(false);
    const [expandAccordions, setExpandAccordions] = useState([])
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
          sortedData = data.sort((a, b) => a.added > b.added)
        } else { // by name
          sortedData = data.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())) // Sort by name
          if(sortedBy !== 0) // by name + itemcount
            sortedData = data.sort((a, b) => a.amount < b.amount)
        }
        if(reverseSortedBy)
          sortedData = sortedData.reverse()
        return sortedData
    }

    const itemData = (item) => [
      {
        title: "Name",
        value: item.name,
        icon: "tag"
      },
      {
        title: "Description",
        value: item.description,
        icon: "quote-right"
      },
      {
        title: "Amount",
        value: item.amount,
        icon: "cubes"
      },
      {
        title: "Added",
        value: convertUnix(item.added, true),
        icon: "calendar"
      },
    ]

    const itemDataElement = ({ item }) => {
      return(
        <ListItem bottomDivider containerStyle={{backgroundColor:colors.background}}>
          <ListItem.Content>
            <View style={{flexDirection:"row"}}>
              <View style={{flex:1}}>
                <Icon
                  name={item.icon}
                  style={{marginTop:3}}
                  size={16}
                  color={colors.subtle}
                />
              </View>
              <View style={{flex:3}}>
                <ListItem.Title style={{color: colors.text, width:100}}>
                  {item.title}
                </ListItem.Title>
              </View>
              <View style={{flex:9}}>
                <ListItem.Subtitle style={{color: colors.subtitle, width:200}}>
                  {item.value}
                </ListItem.Subtitle>
              </View>
            </View>
          </ListItem.Content>
        </ListItem>
      )
    }

    const listElement = ({ item }) => {
      let expanded = expandAccordions.includes(item.key)
      return (
        <ListItem.Accordion
          bottomDivider
          noIcon
          isExpanded={expanded}
          onPress={() => {
            if(expanded) {
              setExpandAccordions(
                expandAccordions.filter(
                  el => el !== item.key
                )   
              )
            } else {
              setExpandAccordions([
                ...expandAccordions,
                item.key
              ])
            }
          }}
          containerStyle={{backgroundColor: expanded ? colors.border : colors.card}}
          content={
            <> 
            {/* Accordion top */}
            <View style={{flex:1, alignItems:"flex-start"}}>
            <Badge 
              containerStyle={{flex:5}}
              value={item.amount}
              textStyle={{fontWeight:"bold"}}
              badgeStyle={{
                backgroundColor: route.params.color ?? colors.primary, marginTop:3
              }}
            />
            </View>
            <ListItem.Title style={{color: colors.text, flex:2}}>
              {item.name}
            </ListItem.Title>
            <ListItem.Subtitle style={{color: colors.subtitle, flex:5}}>
              {item.description}
            </ListItem.Subtitle>
            <View style={{flex:1, alignItems:"flex-end"}}>
              {expanded ?
                <Ionicons name="chevron-up-outline" size={20} color={colors.subtle} /> :
                <Ionicons name="chevron-down-outline" size={20} color={colors.subtle} />
              }
            </View>
            </>
          }
        >
          {/* Accordion content */}
          <View style={{}}>
            <FlatList
              data={itemData(item)}
              renderItem={itemDataElement}
            />
            <View style={{alignItems:"center", backgroundColor:colors.background}}>
              <View style={{flexDirection:"row"}}>
                <SolidButton
                  style={{width: 150}}
                  icon="trash"
                  color="error"
                  onPress={() => {
                    removeItem(route.params.collection, item.key)
                  }}
                />
                <SolidButton
                  style={{width: 150}}
                  icon="edit"
                  color="warning"
                  onPress={() => {
                    navigation.navigate('Add Item', {
                      collection: route.params.collection,
                      color: route.params.color,
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
            </View>
            <Divider color={colors.reverse.background} style={{height:1}} />
          </View>
        </ListItem.Accordion>
      )
    }
  
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
                  buttons={['Name', 'Added', 'Amount']}
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
                  collection: route.params.collection,
                  color: route.params.color
                })
              } 
              title="Add Item"
              icon="plus"
              color="primary"
            />
            <SolidButton
              style={{width:200}}
              onPress={() => {
                navigation.navigate('New Collection', {
                  collection: route.params.collection,
                  color: route.params.color,
                  edit: true
                })
              }}  
              title="Edit Collection"
              icon="edit"
              color="warning"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
      </>
    )
}