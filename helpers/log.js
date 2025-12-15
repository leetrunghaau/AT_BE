const checkDupLog = (logsDESC, now, direction) => {
    return (
        logsDESC.length > 0 &&
        logsDESC[0].direction === direction 
    )
}
module.exports = {
    checkDupLog
}