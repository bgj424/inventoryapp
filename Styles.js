import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column'
    },
    row: {
      flexWrap: 'wrap',
      flexDirection: "row",
    },
    error: {
      color: 'red'
    },
    buttonSolid: {
        height: 40,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "column",
        margin: 5,
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
    },
});