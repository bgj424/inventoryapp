import React from 'react';
import { Text, View } from 'react-native';
import { Dialog } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SolidButton } from './SolidButton';
import { TransparentButton } from './TransparentButton';
import { StyledInput } from './StyledInput';
import { styles } from '../Styles';
import { useTheme } from '@react-navigation/native';

// Infodialog allows to create simple dialogs with text provided with props
export const InfoDialog = (props) => {
    const colors = useTheme().colors;

    return (
      <Dialog
        {...props}
        overlayStyle={{backgroundColor: colors.card}}
        changeVisibleDialog={props.changeVisibleDialog}
        isVisible={props.visibleDialog === "info" ? true : false}
      >
        <Dialog.Title titleStyle={{color: colors.text}} title={props?.title} />
        <View style={{flexDirection:"row"}}>
        {!!props.icon &&
          <Icon
              style={{marginRight: props.message ? 15 : 0}}
              name={props.icon}
              size={30}
              color={props.iconColor ?? colors.primary3}
          />
        }
        <Text style={{fontSize:16}}>{props?.message}</Text>
        </View>
        <View style={{alignItems: "center", marginTop: 10}}>
          <View style={{flexDirection: "row"}}>
            {props.secondaryButton 
            ?
              <SolidButton
                style={{width: 150}}
                title={props?.secondaryButton?.title}
                color={props?.secondaryButton?.color}
                icon={props?.secondaryButton?.icon}
                onPress={() => props?.secondaryButton?.onPress}
              />
            :null}
            <SolidButton
                style={{width: 150}}
                title="Close"
                onPress={() => props.changeVisibleDialog('', {title: '', message: ''})}
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