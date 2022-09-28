import React, { createRef, useEffect } from 'react';
import { styles } from "../Styles"
import { Input } from 'react-native-elements';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useState } from 'react';
import { checkInputValue } from '../functions/checkInputValue';

// Input element with styling and error messages
// Additional props are:
//  matchType (type of value prop), 
//  handleInvalidValue - call function in parent when value prop is invalid,
//  icon, iconColor,
//  checkValue - call the checkvalue function anytime
export const StyledInput = (props) => {
    const colors = useTheme().colors;
    const inputRef = createRef();
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
            label={props.label}
            keyboardType={props.keyboardType}
            errorMessage={error.display ? error.message : ''}
            ref={inputRef}
            style={[styles.input, {...props.style, color: colors.text}]}
            onChangeText={props.onChangeText}
            value={props.value ?? ''}
            placeholder={props.placeholder}
            onChange={() => { checkValue(false) }}
            onBlur={() => { checkValue(true) }}
            leftIcon={
                <Icon 
                    name={props.icon} 
                    size={22} 
                    color={props.iconColor ?? '#757575'} 
                />
            }
        />
    )
}