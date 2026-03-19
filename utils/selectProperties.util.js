const _ = require("lodash")

function selectProperties(obj, properties) {
    return _.pick(obj, properties)
}

function selectPropertiesFromArray(arr, properties) {
    return arr.map(obj => selectProperties(obj, properties))
}

module.exports = {
    selectProperties,
    selectPropertiesFromArray
}