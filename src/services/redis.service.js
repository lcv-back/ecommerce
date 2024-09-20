'use strict';

const redis = require('redis')
const { promisify } = require('util') // chuyen doi 1 ham tro thanh 1 ham async await
const redisClient = redis.createClient()

const pexpire = promisify(redisClient.pexpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setnx).bind(redisClient)