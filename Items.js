import * as db from './Database'
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Camera } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';
import { ref, get, onValue, orderByChild, equalTo, query } from "firebase/database";
import { ListItem, Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

export const ItemList = ({ navigation, route }) => {
  const [items, setItems] = useState('');
  
  // Updating list from db
  useEffect(() => {

    onValue(ref(db.database, 'users/' + db.auth.currentUser.uid + '/itemdata'), (snapshot) => {
      const data = snapshot.val();
      if(data) {
        setItems( // Make array with keys for flatlist
          Object.entries(data).map(item => ({...item[1], key: item[0]}))
        )
      }
    })
  }, []);

  const listElement = ({ item }) => (
      <ListItem bottomDivider onPress={() =>
        navigation.navigate('Item Information', {
          itemKey: item.key,
          itemName: item.name,
          itemDescription: item.description,
          barcode: item.barcode,
          amount: item.amount
        })
      }>
        <ListItem.Content>
          <ListItem.Title>{item.name} ({item.amount}x)</ListItem.Title>
          <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
  )

  return(
      <View>
          <Text>Items list</Text>
          <Button 
            onPress={() => navigation.navigate('Barcode Scanner')} 
            title="Add item"
            icon={
              <Icon
                name="plus"
                size={15}
                color="white"
              />
            }
          />
          <FlatList 
                data={items}
                renderItem={listElement}
            />
      </View>
  )
}

export const ItemInfo = ({ navigation, route }) => {
  const [items, setItems] = useState([]);
  
  // Updating list from db
  useEffect(() => {
    onValue(ref(db.database, 'users/' + db.auth.currentUser.uid + '/itemdata'), (snapshot) => {
      const data = snapshot.val();
      if(data) {
        setItems(Object.values(data))
      }});
  }, []);

  return(
      <View>
          <Text>Item info</Text>
          <Text>ID: {route.params.itemKey}</Text>
          <Text>Name: {route.params.itemName}</Text>
          <Text>Description: {route.params.itemDescription}</Text>
          <Text>Amount: {route.params.amount}</Text>
      </View>
  )
}

// Insert specified amount of specific item to your inventory
export const AddItem = ({ navigation, route }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');

    useFocusEffect(
      React.useCallback(() => {
        if(route.params.itemName) {
          setName(route.params.itemName)
        }
        if(route.params.itemDescription) {
          setDescription(route.params.itemDescription)
        }
        return () => {
        };
      }, [])
    );

    const add = () => {
        db.storeItem(route.params.barcodeData, route.params.itemName, route.params.itemDescription, amount)
        navigation.navigate('Item List', {
          itemName: name,
          itemDescription: description
        })
    }

    return(
        <View>
            <Text>Add item</Text>
            <Text>Name</Text>
            <Input 
              style={styles.input} 
              onChangeText={name => setName(name)} 
              value={name}
              placeholder="Name for item"
              leftIcon={
                <Icon name='tag' size={22} color='#757575' />
              }
              />
            <Text>Description</Text>
            <Input 
              style={styles.input}
              onChangeText={description => setDescription(description)} 
              value={description}
              placeholder="Item description"
              leftIcon={
                <Icon name='quote-right' size={22} color='#757575' />
              }
            />
            <Text>Quantity</Text>
            <Input 
              keyboardType="numeric" 
              style={styles.input} 
              onChangeText={amount => setAmount(amount)} 
              value={amount}
              placeholder="Quantity"
              leftIcon={
                <Icon name='cubes' size={22} color='#757575' />
              }
            />
            <Button onPress={() => add()} title="Add item" />
        </View>
    )
}

// Insert item info (name, description) associated with barcode
export const AddItemInfo = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const add = () => {
      db.addItemInfo(route.params.barcodeData, name, description)
      navigation.navigate('Add Item', {
        itemName: name,
        itemDescription: description,
        barcodeData: route.params.barcodeData,
      })
  }

  return(
      <View>
          <Text>Insert item information</Text>
          <Text>Name</Text>
          <Input 
            style={styles.input} 
            onChangeText={name => setName(name)} 
            value={name}
            placeholder="Name for item"
            leftIcon={
              <Icon name='tag' size={22} color='#757575' />
            }
          />
          <Text>Description</Text>
          <Input 
            style={styles.input}
            onChangeText={description => setDescription(description)} 
            value={description}
            placeholder="Item description"
            leftIcon={
              <Icon name='quote-right' size={22} color='#757575' />
            }
          />
          <Button onPress={() => add()} title="Add item" />
      </View>
  )
}

/* This uses the barcode scanner example code from Expo docs
https://docs.expo.dev/versions/latest/sdk/bar-code-scanner/ */
export const BarcodeScanner = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Set scanner active/inactive on page focus/unfocus
  useFocusEffect(
    React.useCallback(() => {
      setScanned(false)
      return () => {
        setScanned(true)
      };
    }, [])
  );

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    
    // query to check if barcode exists in db
    get(query(
      ref(db.database, 'users/' + db.auth.currentUser.uid + '/iteminfo'), 
      ...[orderByChild("barcode"), equalTo(data)]
    ))
    .then(snapshot => {
      const itemInfo = snapshot.val();

      if(itemInfo == null) { // Item does not exist in db
        navigation.navigate('Add Item Information', {
          barcodeData: data,
        })

      } else { // Item exists in db
        const key = Object.keys(itemInfo)[0];
        navigation.navigate('Add Item', {
          barcodeData: data,
          itemName: itemInfo[key].name,
          itemDescription: itemInfo[key].description,
        })
      }
    })
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }
});