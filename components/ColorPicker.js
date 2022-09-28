import React, { useState } from 'react';
import { styles } from "../Styles"
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SolidButton } from './SolidButton';
import { color } from 'react-native-elements/dist/helpers';

export const ColorPicker = (props) => {
    const colors = useTheme().colors;
    const [selectedColor, setSelectedColor] = useState(null);
    let selectableColors = 
        [null, "#05ab3f", "#2b93ed", "#0257a1", "#7138f5", "#d85bf5", "#de2a42", "#fc8923"];

    const ColorButtons = () => {
        let list = []
        selectableColors.forEach((el, index) => {
            list.push(
                <SolidButton
                    style={{width:40, borderRadius:20, borderWidth: selectedColor===el?0:4, borderColor: selectedColor===el?null:"transparent"}}
                    color={!el ? colors.reverse.card : el}
                    onPress={() => {
                        props.onColorChange(el)
                        setSelectedColor(el)
                    }}
                    key={index}
                />
            )
        })
        return list
    }

    return (
        <View style={{flexDirection: "row"}}>
            <ColorButtons />
        </View>
    )
}