export function checkInputValue(type, value) {
    if(!type) return
    if(!value) {
        throw 'Field cannot be empty'
    } else {
        let check = checkTypeMatch(type, value)
        if(!check.match) throw check.errMsg ?? "Invalid value provided"
    }
}

function checkTypeMatch(type, value) {
    switch(type) {
        case "number":
            return {
                match: !isNaN(value), 
                errMsg: "Value needs to be a number"
            }
        case "email":
            return {
                match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value), 
                errMsg: "Value is not a valid email"
            }
        case "password":
            return {
                match: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value), 
                errMsg: "Password has to contain at least 8 characters, and at least one number and one letter"
            }
        case "username":
            return {
                match: /^(?=.{3,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+$/.test(value), 
                errMsg: "Username has to contain 3 to 16 characters, and no special characters"
            }
        case "text":
            return {
                match: true, // todo: validate all text
            }
        default: // custom check
            return type
    }
}