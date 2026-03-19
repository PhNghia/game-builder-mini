const gameService = require('../services/game.service')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

class GameController {

    getAllGames = async () => {
        const result = await gameService.getAllGames()
        return result
    }

    getGameById = async (id) => {
        const result = await gameService.getGameById(id)
        return result
    }

    createGame = async (payload) => {
        try {
            const result = await gameService.createGame(payload)
            return result
        } catch (error) {
            console.log(error)
            return { error: "Create game failed" }
        }
    }

    exportGame = async (id) => {
        try {
            const result = await gameService.exportGame(id)
            return result
        } catch (error) {
            console.log(error)
            return { error: "Export game failed" }
        }
    }
}

module.exports = new GameController()