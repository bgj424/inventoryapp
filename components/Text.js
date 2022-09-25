import React, { useEffect, useState } from 'react';
import { Text as ReactNativeText } from 'react-native';
import { useTheme } from '@react-navigation/native';

export const Text = (props) => {
    return (
        <ReactNativeText
            style={{color: useTheme().text, ...props.style}}
        > 
        </ReactNativeText>
    )
}