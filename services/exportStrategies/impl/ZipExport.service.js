const BaseExport = require("../baseExport.service")

class ZipExport extends BaseExport {

    export(game) {
        return "zip export"
    }

}

module.exports = ZipExport