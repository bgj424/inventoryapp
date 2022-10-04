import React from 'react';
import { styles } from "../Styles"
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Button with preset colors and styling
/**
 * @param props.icon fontawesome icon name
 * @param props.iconColor icon color
 */
export const TransparentButton = (props) => {
    const colors = useTheme().colors;

    return (
        <TouchableOpacity
            {...props}
            onPress={props.onPress}
            style={[
                styles.buttonSolid, {
                    backgroundColor: "transparent",
                    ...props.style
                },
            ]}
        >
            <View style={{flexDirection: "row"}}>
                {!!props.icon &&
                    <Icon
                        style={{marginRight: props.title ? 10 : 0}}
                        name={props.icon}
                        size={props.iconSize ?? 20}
                        color={props.iconColor ?? colors.reverse.card}
                    />
                }

                <Text 
                    numberOfLines={1} 
                    adjustsFontSizeToFit={true}
                    style={{
                        textDecorationLine: "underline",
                        color: props.titleColor ?? "#1f349c",
                        fontSize: 15,
                    }}
                >
                    {props.title}
                </Text>
            </View>
        </TouchableOpacity>      
    )
}