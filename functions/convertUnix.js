export function convertUnix(unix, showMinutes) {
    var d = new Date(unix)
    if(!showMinutes)
        return (
            d.getFullYear() + "-" + 
            ('0' + (d.getMonth()+1)).slice(-2) + "-" + 
            ('0' + d.getDate()).slice(-2)
        )
    else
        return (
            d.getFullYear() + "-" + 
            ('0' + (d.getMonth()+1)).slice(-2) + "-" + 
            ('0' + d.getDate()).slice(-2) + " " +
            ('0' + d.getHours()).slice(-2) + ":" +
            ('0' + d.getMinutes()).slice(-2)
        )
}