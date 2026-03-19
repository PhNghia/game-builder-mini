const BaseExport = require("../baseExport.service")

class IFrameExport extends BaseExport {

    export (game) {
        return "iframe export"
    }

}
module.exports = IFrameExport