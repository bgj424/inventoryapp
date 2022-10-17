import React, { createRef, useEffect } from 'react';
import { styles } from "../Styles"
import { Input } from 'react-native-elements';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useState } from 'react';
import { checkInputValue } from '../functions/checkInputValue';
import { Ionicons } from '@expo/vector-icons';
import { color } from 'react-native-elements/dist/helpers';

/**
 * @param props.handleInvalidValue function to call when value is invalid
 * @param props.icon fontawesome icon name
 * @param props.iconColor icon color
 * @param {boolean} props.checkValue call value check on input element
 * @param {string} props.matchType if the value needs to match specific type (text||number||email||password||passwordMatch||{match: Custom condition, errMsg: Custom error})
 * @param iconSet ionicons/null
 */

export const StyledInput = (props) => {
    const colors = useTheme().colors
    const inputRef = createRef()
    const [hidden, setHidden] = useState(false)
    const [error, setError] = useState({
        message: '',
        display: false
    })

    useEffect(() => { 
        if(props.checkValue) checkValue(true)
    }, [props.checkValue])

    // Check whether input value prop matches type prop
    function checkValue(displayError) {
        if(props.handleInvalidValue) {
            try { // Value is valid
                setError({message: '', display: false})
                checkInputValue(props.matchType, props.value)
                props.handleInvalidValue(props.label, false)
            } catch(e) { // Value is invalid
                setError({message: e, display: displayError})
                props.handleInvalidValue(props.label, true)
                if(displayError)
                    inputRef.current.shake()
            }
        }
    }

    return (
        <Input
            {...props}
            selectionColor={colors.reverse.primary3}
            maxLength={props.maxLength ?? 100}
            keyboardType={props.keyboardType}
            errorMessage={error.display ? error.message : ''}
            ref={inputRef}
            containerStyle={{display: hidden ? "none" : null}}
            style={[styles.input, {...props.style, color: colors.text}]}
            onChangeText={props.onChangeText}
            value={props.value ?? ''}
            onChange={() => { checkValue(false) }}
            onBlur={() => { checkValue(true) }}
            labelStyle={{color: colors.text}}
            leftIcon={
                props.iconSet === "ionicons" ?
                <Ionicons
                    name={props.icon} 
                    size={22} 
                    color={props.iconColor ?? '#757575'} 
                /> :
                <Icon
                    name={props.icon} 
                    size={22} 
                    color={props.iconColor ?? '#757575'} 
                />
            }
        />
    )
}