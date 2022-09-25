import React from 'react';
import { styles } from "../Styles"
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Button with preset colors and styling
// Additional props are:
// icon, iconColor
export const SolidButton = (props) => {
    const colors = useTheme().colors;

    return (
        <TouchableOpacity 
            onPress={props.onPress}
            style={[
                styles.buttonSolid, {
                    backgroundColor: colors[props.color ?? "primary"],
                    ...props.style
                },
            ]}
        >
            <View style={{flexDirection: "row"}}>
                {!!props.icon &&
                    <Icon
                        style={{marginRight: props.title ? 10 : 0}}
                        name={props.icon}
                        size={20}
                        color={props.iconColor ?? "white"}
                    />
                }

                <Text 
                    numberOfLines={1} 
                    adjustsFontSizeToFit={true}
                    style={{
                        color: props.titleColor ?? "white",
                        fontWeight: "bold",
                        fontSize: 15,
                    }}
                >
                    {props.title}
                </Text>
            </View>
        </TouchableOpacity>      
    )
}