// export factory

const IFrameExport = require("./impl/IFrameExport.service")
const ZipExport = require("./impl/ZipExport.service")
const JsEmbedExport = require("./impl/JsEmbedExport.service")

const exportStrategies = {
    "iframe": IFrameExport,
    "zip": ZipExport,
    "jsEmbed": JsEmbedExport,
}

class ExportFactory {
    getExportStrategy(type) {
        const ExportStrategy = exportStrategies[type]
        if (!ExportStrategy) {
            throw new Error("Invalid export type")
        }
        return new ExportStrategy()
    }
}

module.exports = new ExportFactory()