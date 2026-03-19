const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");
const archiver = require("archiver");

class TemplateService {

    buildTemplate = async (data) => {
        const repoUrl = "https://github.com/bhbghghbgb/thuctap-demo.git"
        const projectPath = "demo-game-groupsort2/player/vite-project"
        const clientData = {
            "groups": [
                { "id": "group1", "name": "Trái cây", "imgsrc": "./assets/basket.svg" },
                { "id": "group2", "name": "Rau củ", "imgsrc": "./assets/box.svg" },
                { "id": "group3", "name": "Đồ dùng", "imgsrc": "./assets/backpack.svg" }
            ],
            "items": [
                {
                    "id": "item1",
                    "name": "Táo",
                    "imgsrc": "./assets/apple.svg",
                    "groupId": "group1"
                },
                {
                    "id": "item2",
                    "name": "Chuối",
                    "imgsrc": "./assets/banana.svg",
                    "groupId": "group1"
                },
                {
                    "id": "item3",
                    "name": "Cà rốt",
                    "imgsrc": "./assets/carrot.svg",
                    "groupId": "group2"
                },
                {
                    "id": "item4",
                    "name": "Khoai tây",
                    "imgsrc": "./assets/potato.svg",
                    "groupId": "group2"
                },
                {
                    "id": "item5",
                    "name": "Sách",
                    "imgsrc": "./assets/book.svg",
                    "groupId": "group3"
                },
                {
                    "id": "item6",
                    "name": "Bút",
                    "imgsrc": "./assets/pen.svg",
                    "groupId": "group3"
                },
                {
                    "id": "item7",
                    "name": "Cam",
                    "imgsrc": "./assets/orange.svg",
                    "groupId": "group1"
                },
                {
                    "id": "item8",
                    "name": "Dâu",
                    "imgsrc": "./assets/strawberry.svg",
                    "groupId": "group1"
                }
            ]
        }
        const outputZip = path.join(__dirname, "..", "exports", `${path.basename(repoUrl, ".git")}.zip`);
        await this.buildAndPackage(repoUrl, projectPath, clientData, outputZip);
    }

    runCommand(cmd, cwd) {
        console.log(`👉 ${cmd}`);
        execSync(cmd, { stdio: "inherit", cwd });
    }

    detectBuildTool(repoPath) {
        const pkg = JSON.parse(fs.readFileSync(path.join(repoPath, "package.json")));
        if (pkg.scripts?.build?.includes("vite")) return { cmd: "npm run build", out: "dist" };
        if (pkg.scripts?.build?.includes("react-scripts")) return { cmd: "npm run build", out: "build" };
        if (pkg.scripts?.build?.includes("vue-cli-service")) return { cmd: "npm run build", out: "dist" };
        if (pkg.scripts?.build?.includes("ng build")) return { cmd: "npm run build", out: "dist" };
        return { cmd: "npm run build", out: "dist" }; // fallback
    }

    buildAndPackage = async (repoUrl, projectPath, clientData, outputZip) => {
        // 1. Tạo thư mục tạm
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "repo-"));
        const repoName = path.basename(repoUrl, ".git");
        const repoPath = path.join(tmpDir, repoName);
        try {
            // 2. Clone repo vào thư mục tạm
            this.runCommand(`git clone ${repoUrl}`, tmpDir);

            // 3. Chọn thư mục project con
            const projectFullPath = path.join(repoPath, projectPath);

            this.runCommand("npm install --legacy-peer-deps", projectFullPath);
            const { cmd, out } = this.detectBuildTool(projectFullPath);
            this.runCommand(cmd, projectFullPath);


            // 5. Copy folder build sang thư mục templates
            const distPath = path.join(projectFullPath, out);
            console.log("📂 Dist path:", distPath);
            console.log("📂 Files in dist:", fs.readdirSync(distPath));
            const templatesDir = path.join(__dirname, "..", "templates", repoName + "-" + path.basename(projectPath));
            fs.mkdirSync(templatesDir, { recursive: true });
            // // inject data
            // fs.writeFileSync(path.join(distPath, "clientData.json"), JSON.stringify(clientData, null, 2));

            // copy toàn bộ dist sang templates (bao gồm index.html + assets)
            this.runCommand(`cp -r ${distPath}/* ${templatesDir}/`, process.cwd());


            // 7. Xoá thư mục tạm
            fs.rmSync(tmpDir, { recursive: true, force: true });

            console.log(`🎉 Build success!`);
        } catch (err) {
            console.error("❌ Build lỗi:", err.message);
        } finally {
            // luôn xoá thư mục tạm, kể cả khi lỗi
            fs.rmSync(tmpDir, { recursive: true, force: true });
            console.log(`🎉Xóa rồi!`);
        }
    }

}

module.exports = new TemplateService();
