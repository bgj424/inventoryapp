// Function that's used to update invalid inputs list
export function updateInvalidInputsList(invalidInputsList, inputName, valueIsInvalid) {    
    if(valueIsInvalid) {
        if(!invalidInputsList.includes(inputName))
            // Add to invalid inputs list
            return ([...invalidInputsList, inputName])
        else 
            return invalidInputsList
    } else {
        // Remove from invalid inputs list
        return(
            invalidInputsList.filter(
                el => el !== inputName
            )       
        )
    }
}