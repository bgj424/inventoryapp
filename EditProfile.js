import { database, auth } from './Database'
import { addCollection } from './database_functions/CollectionData';
import { changeUserData, changeUserProfile, changeUserAvatar } from './database_functions/UserData'
import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native';
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

export const EditProfile = ({ navigation, route }) => {
    const colors = useTheme().colors;
    const { user, setUser } = useContext(UserContext);
    const [name, setName] = useState(auth.currentUser.displayName);
    const [email, setEmail] = useState(auth.currentUser.email);
    const [updatedValues, setUpdatedValues] = useState({});
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

    // Function called by Styled Input
    const handleInvalidValue = (inputName, valueIsInvalid) => {
        invalidInputsList =
            updateInvalidInputsList(
                invalidInputsList, inputName, valueIsInvalid
            ) 
    }

    return(
        <KeyboardAvoidingView style={[styles.container, {alignItems:"center"}]}>
            <View style={[styles.inputBox]}>
                <View style={{alignItems:"center"}}>
                    <Avatar
                        title="user"
                        size={65}
                        rounded
                        source={ user?.photoURL ? { uri: user?.photoURL || {} } : require("./assets/user.png")}
                        containerStyle={{backgroundColor:colors.backgroundColor}}
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
                    />
                    <SolidButton 
                        onPress={() => setEnabledInput("email")}
                        icon="pencil"
                        color="warning"
                        style={{width:40, marginTop:25, marginLeft:-50}}
                    />
                </View>
                <View style={{marginTop:100, alignItems:"center"}}>
                    <Text style={styles.error}>
                        {error}
                    </Text>
                    <SolidButton
                      style={{width: 200}}
                      onPress={() => setCheckInputValues(checkInputValues + 1)} 
                      title="Save changes"
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
    },
    row: {
      flexWrap: 'wrap',
      flexDirection: "row",
    },
    error: {
      color: 'red'
    },
    buttonSolid: {
      width: 50,
    },
    inputBox: {
      margin: 20,
      width: 400,
    },
    input: {
      padding: 10,
    },
    buttonLabel: {
      marginBottom: 5, 
      marginTop: 15
    }
});