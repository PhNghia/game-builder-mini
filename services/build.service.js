const path = require("path");
const fs = require("fs");
const { BrowserWindow } = require("electron");

class BuildService {

    buildGameIntoHtml(game) {
        const { template, data } = game;
        // mode: render and zip

        // path tới template
        const templatePath = path.join(
            __dirname,
            "../templates",
            template,
            "index.html"
        );

        // đọc html template
        let html = fs.readFileSync(templatePath, "utf8");

        // inject data
        const injection = `
            <script>window.MY_APP_DATA = ${JSON.stringify(data)};</script>
            `;

        // ưu tiên inject trước </head>
        html = html.replace(/<script/, injection + "\n<script");

        return html;
    }

    downloadFile(zipPath) {
        const win = BrowserWindow.getFocusedWindow();

        if (!win) throw new Error("No active window");

        const fileUrl = `file://${zipPath}`;

        win.webContents.downloadURL(fileUrl);
    }
}

module.exports = new BuildService();