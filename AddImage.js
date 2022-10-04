import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { database, auth, storage } from './Database'
import { addItem, saveItem, saveItemInfo } from './database_functions/ItemData'
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './Styles';
import { StyledInput } from './components/StyledInput';
import { updateInvalidInputsList } from './functions/updateInvalidInputsList';
import { SolidButton } from './components/SolidButton';
import { get, set, child, update,remove, increment } from "firebase/database";
import { put, ref, uploadBytes } from "firebase/storage";


export const AddImage = ({navigation, route}) => {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      //aspect: [4, 4],
      quality: 1,
    });
    const response = await fetch(result.uri);
    const blob = await response.blob();
    uploadBytes(ref(storage, "images/" + auth.currentUser.uid + "/avatar.jpg"), blob)
    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>
  );
}
