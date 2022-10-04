export function updateInvalidInputsList(invalidInputsList, inputName, valueIsInvalid) {    
    if(valueIsInvalid) {
        if(!invalidInputsList.includes(inputName))
            return ([...invalidInputsList, inputName])
        else 
            return invalidInputsList
    } else {
        return(
            invalidInputsList.filter(
                el => el !== inputName
            )       
        )
    }
}