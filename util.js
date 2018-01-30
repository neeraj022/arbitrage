let utilMethods = {
    to2DecimalPlaces (value) {
        let result = value
        try {
            result = parseFloat(Math.round(value * 100) / 100).toFixed(2);
        } 
        catch (e) {

        }
        return result
    },
    to3DecimalPlaces (value) {
        let result = value
        try {
            result = parseFloat(value.toFixed(3));
        } 
        catch (e) {

        }
        return result
    },
}



module.exports = utilMethods