'use strict';

const mongoose = require('mongoose');
const { countConnect } = require('../helpers/check.connect');
const { db: { host, name, port } } = require('../configs/config.mongodb');
// const connectStr = `mongodb://${host}:${port}/${name}`;
const connectString1 = `mongodb+srv://lcvdev:lecongvi1805@ecommercluster.xagztxz.mongodb.net/`;
const connectString = `mongodb+srv://lcvdev:lecongvi1805@ecommercluster.xagztxz.mongodb.net/?retryWrites=true&w=majority&appName=ecommerCluster`;
const conString = `mongodb+srv://lcvdev:lecongvi1805@ecommercluster.xagztxz.mongodb.net/`;
// mongodb+srv://lcvdev:<db_password>@ecommercluster.xagztxz.mongodb.net/?retryWrites=true&w=majority&appName=ecommerCluster
console.log(`Connect String: ${connectString1}`);

class Database {
    constructor() {
        this.connect();
    }
    connect(type = 'mongodb') { // if using mysql, oracle, .. change the type
        if (1 == 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true })
        }

        mongoose.connect(connectString1, {
                maxPoolSize: 50
            })
            .then(_ => {
                console.log(`Connected Mongodb Success`);
                countConnect();
            })
            .catch(err => console.error(err));
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