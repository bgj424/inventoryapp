import React, { useState, useEffect, useContext } from 'react';
import { Text, View } from 'react-native';
import { database, auth } from '../Database';
import { emailPasswordReset } from '../database_functions/UserAuth';
import { changeUserData } from '../database_functions/UserData';
import { Dialog } from 'react-native-elements';
import { SolidButton } from './SolidButton';
import { TransparentButton } from './TransparentButton';
import { StyledInput } from './StyledInput';
import { styles } from '../Styles';
import { useTheme } from '@react-navigation/native';
import { updateInvalidInputsList } from '../functions/updateInvalidInputsList';

export const PasswordResetDialog = (props) => {
    const [doInputValueCheck, setDoInputValueCheck] = useState(false)
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    let invalidInputsList = [];
    const colors = useTheme().colors;

    const handleInvalidValue = (inputName, valueIsInvalid) => {
      invalidInputsList =
          updateInvalidInputsList(invalidInputsList, inputName, valueIsInvalid) 
    }

    useEffect(() => {
        if(doInputValueCheck && !invalidInputsList.length > 0) {
            emailPasswordReset(email)
            .then(result => {
                setError('')
                props.changeVisibleDialog("info", {
                    title: "Password reset email sent",
                    message: "Email has been sent to you. Please check your email and follow the instructions."
                })
            })
            .catch(e => setError(e.message))
        }
    }, [doInputValueCheck])

    return (
      <Dialog
        {...props}
        overlayStyle={{backgroundColor: colors.card}}
        changeVisibleDialog={props.changeVisibleDialog}
        isVisible={props.visibleDialog === "passwordreset" ? true : false}
      >
        <Dialog.Title titleStyle={{color: colors.text}} title="Reset your password" />
            <StyledInput
                label="Email Address"
                matchType="email"
                style={styles.input}
                placeholder="email@example.com"
                checkValue={doInputValueCheck}
                handleInvalidValue={handleInvalidValue}
                onChangeText={email => setEmail(email)}
                value={email}
                icon="user"
            />
            {!!error && <Text style={styles.error}>{error}</Text>}
            <View style={{alignItems: "center", marginTop: 10}}>
                <View style={{flexDirection: "row"}}>
                    <SolidButton
                        style={{width: "50%", marginRight:5}}
                        onPress={() => setDoInputValueCheck(doInputValueCheck + 1)} 
                        title="Reset password" 
                    />
                    <SolidButton
                        style={{width: "50%",marginLeft:5}}
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