import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backgroundContainer: {
    flex:1, 
    alignItems:"center", 
    padding: 10
  },
  contentContainer: {
    width:"100%",
    borderRadius:5, 
    padding:20
  },
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
  },
  inputBox: {
    margin: 20,
    width: 400,
  },
  input: {
    padding: 10,
  },
  buttonContainer: {
      width: 200,
      alignItems: 'center',
  }
});