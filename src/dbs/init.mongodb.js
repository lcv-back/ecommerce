'use strict';

const mongoose = require('mongoose');
const { countConnect } = require('../helpers/check.connect');
const { db: { host, name, port } } = require('../configs/config.mongodb');
// const connectStr = `mongodb://${host}:${port}/${name}`;
const connectString = `mongodb+srv://lcvdev:lecongvi1805@ecommercluster.xagztxz.mongodb.net/`;

console.log(`Connect String: ${connectString}`);

class Database {
    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') { // if using mysql, oracle, .. change the type
        if (1 == 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true })
        }

        mongoose.connect(connectString, {
                maxPoolSize: 50
            })
            .then(_ => {
                console.log(`Connected Mongodb Success`);
                countConnect();
            })
            .catch(err => console.log(`Error Connecting`));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;