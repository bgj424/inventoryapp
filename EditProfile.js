import { database, auth } from './Database'
import { addCollection } from './database_functions/CollectionData';
import { changeUserData, changeUserProfile, changeUserAvatar } from './database_functions/UserData'
import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Keyboard } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Dialog, Avatar, Divider, ListItem, Badge } from 'react-native-elements';
import { increment } from "firebase/database";
import { ColorPicker } from './components/ColorPicker';
import { SolidButton } from './components/SolidButton';
import { StyledInput } from './components/StyledInput';
import { updateInvalidInputsList } from './functions/updateInvalidInputsList';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { UserContext } from './AppContext'; 
import { styles } from './Styles';

export const EditProfile = ({ navigation, route }) => {
    const colors = useTheme().colors;
    const { user, setUser } = useContext(UserContext);
    const [name, setName] = useState(auth.currentUser.displayName);
    const [email, setEmail] = useState(auth.currentUser.email);
    const [updatedValues, setUpdatedValues] = useState({});
    const [keyboardStatus, setKeyboardStatus] = useState(false);
    const [error, setError] = useState('');
    const [enabledInput, setEnabledInput] = useState('');
    const [checkInputValues, setCheckInputValues] = useState(false);
    let invalidInputsList = [];

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            //aspect: [4, 4],
            quality: 1,
        });

        if(result.cancelled) return

        changeUserAvatar(result)
        .then(url => {
            setUser({...user, photoURL: url})
        })
        .catch(e => console.log(e))
    };
  

    const submit = () => {
        setError('')

        if(updatedValues !== {}) {
            changeUserProfile(updatedValues)
            .then(res => {
                navigation.navigate('Settings')
            })
            .catch(e => console.log(e))
        }

    }

    useEffect(() => {
      if(checkInputValues) {
          submit()
      }
    }, [checkInputValues])

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardStatus(true);
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardStatus(false);
        });
    
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    // Function called by Styled Input
    const handleInvalidValue = (inputName, valueIsInvalid) => {
        invalidInputsList =
            updateInvalidInputsList(
                invalidInputsList, inputName, valueIsInvalid
            ) 
    }

    return(
        <>
        <KeyboardAvoidingView style={[{flex:1, alignItems:"center", backgroundColor:colors.background, padding: 10}]}>
          <View style={{flex:1}}>
            <View style={{height:"100%", justifyContent:"center"}}>
              {/* Main container */}
              <View style={[{width:"100%",flexDirection:"row",alignItems:"center", backgroundColor:colors.card, borderRadius:5, padding:20}]}>
                <View style={{width:"100%"}}>
                  <Text style={{color:colors.primary3, fontSize:22, fontWeight:"bold", display: keyboardStatus ? "none" : null}}>Edit profile</Text>
                  <Divider color={colors.reverse.card} style={{marginVertical:10}} />
                  <View style={{alignItems:"center", display: keyboardStatus ? "none" : null}}>
                    <Avatar
                      title="user"
                      size={65}
                      rounded
                      source={ user?.photoURL ? { uri: user?.photoURL || {} } : require("./assets/user.png")}
                      containerStyle={{backgroundColor:colors.backgroundColor, marginBottom: 5}}
                    />
                    <SolidButton 
                      onPress={pickImage}
                      icon="pencil"
                      color="warning"
                      style={{width:40}}
                    />
                  </View>
                  <View style={{flexDirection:"row"}}>
                    <StyledInput
                      label="Username"
                      disabled={enabledInput === "username" ? false : true}
                      style={{width:50}}
                      onChangeText={name => {
                        setName(name)
                        setUpdatedValues({...updatedValues, displayName: name}); 
                        setError('')
                      }} 
                      value={name}
                      icon="tag"
                      iconColor={colors.subtle}
                      checkValue={checkInputValues}
                      handleInvalidValue={handleInvalidValue}
                    />
                    <SolidButton 
                      onPress={() => setEnabledInput("username")}
                      icon="pencil"
                      color="warning"
                      style={{width:40, marginTop:25, marginLeft:-50}}
                    />
                  </View>
                  <View style={{flexDirection:"row"}}>
                    <StyledInput
                      label="Email address"
                      disabled={enabledInput === "email" ? false : true}
                      style={{width:50}}
                      onChangeText={email => {
                        setEmail(name)
                        setUpdatedValues({...updatedValues, email: email}); 
                        setError('')
                      }} 
                      value={email}
                      icon="user"
                      iconColor={colors.subtle}
                      checkValue={checkInputValues}
                      handleInvalidValue={handleInvalidValue}
                      inputContainerStyle={{marginBottom:-10}}
                    />
                    <SolidButton 
                      onPress={() => setEnabledInput("email")}
                      icon="pencil"
                      color="warning"
                      style={{width:40, marginTop:25, marginLeft:-50}}
                    />
                  </View>
                </View>
              </View>
            </View>
            {/* Footer */}
            <View style={[{width:"100%", alignItems:"center", position:"absolute", bottom:0}]}>
              {/* Save button */}
              <View style={{alignItems:"center", marginVertical: keyboardStatus ? 0 : 20, width: "90%"}}>
                <Text style={styles.error}>{error}</Text>
                <SolidButton
                    style={{width: 200}}
                    onPress={() => setCheckInputValues(checkInputValues + 1)} 
                    title="Save changes"
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
        </>
    )
}