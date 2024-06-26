'use strict';

const development = {
    app: {
        port: process.env.DEV_APP_PORT || 3055
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'DBShop',
    }
}

const production = {
    app: {
        port: process.env.PRO_APP_PORT || 3000
    },
    db: {
        host: process.env.PRO_DB_HOST || 'localhost',
        port: process.env.PRO_DB_PORT || 27017,
        name: process.env.PRO_DB_NAME || 'shopPRO',
    }
}

const config = { development, production };
const env = process.env.NODE_ENV || 'development';

console.log(config[env]);
console.log(`Enviroment type: ${env}`);
module.exports = config[env];