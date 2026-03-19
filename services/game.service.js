const fs = require("fs")
const fsPromises = require('fs/promises')
const path = require('path')
const archiver = require('archiver')
const { app } = require('electron')
const GameDataModel = require('../models/gameData.model')
const { selectProperties, selectPropertiesFromArray } = require('../utils/selectProperties.util')
const { Types } = require('mongoose')
const buildService = require('./build.service')

const exampleData = {
    "groups": [
        { "id": "group1", "name": "Trái cây", "imgsrc": "./assets/basket.svg" },
        { "id": "group2", "name": "Rau củ", "imgsrc": "./assets/box.svg" },
        { "id": "group3", "name": "Đồ dùng", "imgsrc": "./assets/backpack.svg" },
        { "id": "group4", "name": "Đồ dùng 2", "imgsrc": "./assets/backpack.svg" }
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

class GameService {

    getAllGames = async (data) => {
        const games = await GameDataModel.find()
        return selectPropertiesFromArray(games, ["id", "title", "template"])
    }

    getGameById = async (id) => {
        // if (!Types.ObjectId.isValid(id)) {
        //     return 'Invalid game ID';
        // }
        // return await GameDataModel.findById(id)

        const game = await GameDataModel.findById(id)

        const gameAfterConvert = this.convert(game)

        const html = buildService.buildGameIntoHtml({
            template: "group-sort",
            data: gameAfterConvert.data || exampleData
        })

        return html;
    }

    convert(game) {
        const baseFolder = path.join(app.getPath('userData'), 'uploads', game.id)

        // fix groups
        game.data.groups = game.data.groups.map(group => {
            if (group.imgsrc) {
                const fullPath = path.join(baseFolder, group.imgsrc)
                group.imgsrc = `app-file://${encodeURI(fullPath)}`
            }
            return group
        })

        // fix items
        game.data.items = game.data.items.map(item => {
            if (item.imgsrc) {
                const fullPath = path.join(baseFolder, item.imgsrc)
                item.imgsrc = `app-file://${encodeURI(fullPath)}`
            }
            return item
        })

        return game
    }

    normalizeGameData(game) {
        game.data.groups = game.data.groups.map((group) => ({
            ...group,
            imgsrc: group.imgsrc
                ? path.join("assets", group.imgsrc).replace(/\\/g, "/")
                : null,
        }))

        game.data.items = game.data.items.map((item) => ({
            ...item,
            imgsrc: item.imgsrc
                ? path.join("assets", item.imgsrc).replace(/\\/g, "/")
                : null,
        }))
        return game;
    };

    createGame = async (payload) => {
        const { template, title, data } = payload

        const gameId = new Types.ObjectId().toString()

        const uploadRoot = path.join(app.getPath('userData'), 'uploads')
        const gameFolder = path.join(uploadRoot, gameId)

        await fsPromises.mkdir(gameFolder, { recursive: true })

        // xử lý groups
        for (const group of data.groups) {
            if (group.imgFilePath) {
                const fileName = `${Date.now()}-${path.basename(group.imgFilePath)}`
                const dest = path.join(gameFolder, fileName)

                await fsPromises.copyFile(group.imgFilePath, dest)

                group.imgsrc = fileName
            }
            delete group.imgFilePath
        }

        // xử lý items
        for (const item of data.items) {
            if (item.imgFilePath) {
                const fileName = `${Date.now()}-${path.basename(item.imgFilePath)}`
                const dest = path.join(gameFolder, fileName)

                await fsPromises.copyFile(item.imgFilePath, dest)

                item.imgsrc = fileName
            }
            delete item.imgFilePath
        }

        // 👉 tạo Mongo SAU
        const gameDoc = await GameDataModel.create({
            _id: gameId,
            template,
            title,
            data,
        })

        return selectProperties(gameDoc, ["id"])
    }

    exportGame = async (id) => {
        const uploadRoot = path.join(app.getPath("userData"), "uploads");
        const gameFolder = path.join(uploadRoot, id);

        const game = await GameDataModel.findById(id);
        if (!game) throw new Error("Game not found");

        const normalizeGame = this.normalizeGameData(game)

        const html = buildService.buildGameIntoHtml(normalizeGame);

        // 👉 lưu tạm trong temp (chuẩn cho download)
        const zipPath = path.join(app.getPath("temp"), `${id}.zip`);

        await new Promise((resolve, reject) => {
            const output = fs.createWriteStream(zipPath);
            const archive = archiver("zip", { zlib: { level: 9 } });

            output.on("close", resolve);
            archive.on("error", reject);

            archive.pipe(output);

            archive.append(html, { name: "index.html" });
            archive.directory(gameFolder, "assets");

            archive.finalize();
        });

        return zipPath;
    }
}

module.exports = new GameService()