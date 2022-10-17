import React, { useState, useEffect, useContext } from 'react';
import { Text, View } from 'react-native';
import { database, auth }from '../Database';
import { changePassword } from '../database_functions/UserAuth';
import { changeUserData } from '../database_functions/UserData';
import { Dialog } from 'react-native-elements';
import { SolidButton } from './SolidButton';
import { TransparentButton } from './TransparentButton';
import { StyledInput } from './StyledInput';
import { styles } from '../Styles';
import { useTheme } from '@react-navigation/native';
import { updateInvalidInputsList } from '../functions/updateInvalidInputsList';

export const PasswordChangeDialog = (props) => {
    const [doInputValueCheck, setDoInputValueCheck] = useState(false)
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    let invalidInputsList = [];
    const colors = useTheme().colors;

    const handleInvalidValue = (inputName, valueIsInvalid) => {
      invalidInputsList =
          updateInvalidInputsList(invalidInputsList, inputName, valueIsInvalid) 
    }

    useEffect(() => {
        if(doInputValueCheck && !invalidInputsList.length > 0) {
            changePassword(auth.currentUser, password)
            .catch(e => {
                if(e.code === 'auth/requires-recent-login') {
                    props.changeVisibleDialog('reauthenticate')
                    setError('')
                } else 
                    setError(e.message)
            })
        }
    }, [doInputValueCheck])

    return (
      <Dialog
        {...props}
        overlayStyle={{backgroundColor: colors.card}}
        changeVisibleDialog={props.changeVisibleDialog}
        isVisible={props.visibleDialog === "passwordchange" ? true : false}
      >
        <Dialog.Title titleStyle={{color: colors.text}} title="Change Password" />
          <StyledInput
              label="New Password"
              matchType="password"
              placeholder="Password" 
              secureTextEntry={true}
              checkValue={doInputValueCheck}
              handleInvalidValue={handleInvalidValue}
              onChangeText={password => setPassword(password)} 
              value={password}
              icon="lock"
            />
          <StyledInput
              label="Type password again"
              matchType={{match: password===passwordConfirmation ? true : false, errMsg: "Passwords do not match"}}
              placeholder="Type password again" 
              secureTextEntry={true}
              checkValue={doInputValueCheck}
              handleInvalidValue={handleInvalidValue}
              onChangeText={passwordConfirmation => setPasswordConfirmation(passwordConfirmation)} 
              value={passwordConfirmation}
              icon="lock"
          />
          {!!error && <Text style={styles.error}>{error}</Text>}
          <View style={{alignItems: "center", marginTop: 10}}>
            <View style={{flexDirection: "row"}}>
              <SolidButton
                  style={{width: "50%", marginRight:5}}
                  onPress={() => setDoInputValueCheck(doInputValueCheck + 1)} 
                  title="Change password" 
              />
              <SolidButton
                  style={{width: "50%", marginLeft:5}}
                  title="Cancel"
                  color="error"
                  onPress={() => { props.changeVisibleDialog(''); setError('') }}
              />
            </View>
          </View>
        <View style={{width:350}}>
          <Dialog.Actions>
          </Dialog.Actions>
        </View>
      </Dialog>
    )
}