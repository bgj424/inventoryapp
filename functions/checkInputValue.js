// Functions for checking input values

// Check if value is valid
export const checkInputValue = (type, value) => {
    if(!value) {
        throw 'Field cannot be empty'
    } else if(type && !checkTypeMatch(type, value)) {
        throw 'Invalid value provided'
    }
}

// Check if value matches type specified in props
const checkTypeMatch = (type, value) => {
    switch(type) {
        case "number":
            return (!isNaN(value))
        case "email":
            return true
    }
}