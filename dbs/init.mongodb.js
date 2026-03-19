'use strict'

const mongoose = require('mongoose')
const { db : { host, port, name } } = require('../configs/config.app')
const connectString = `mongodb://${host}:${port}/${name}`

class Database {
    constructor() {
        this.connect()
    }

    connect() {
        mongoose.connect(connectString)
            .then(() => {
                console.log(`Connect string: `, connectString)
                console.log('Database connected successfully')
            })
            .catch((err) => {
                console.error('Database connection error:', err)
            })
        
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb