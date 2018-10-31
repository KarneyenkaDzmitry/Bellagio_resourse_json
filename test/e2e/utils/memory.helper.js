'use strict';

const { logger } = require('../configs/logger.conf');

class Memory {
    constructor() {
        logger.info('Instance of Memory has been created.', {func: 'Memory'})
        this.storage = {
            "test":"first"
        };
    }

    getValue(string) {
        const result = /^\$/.test(string) ? this.get(string.substring(1)) : string;
        logger.debug(`Function getValue([${string}]) returns [${result}]`, {func: 'Memory.getValue'});
        return result;
    }

    store(string, value) {
        if (!/^\$/.test(string)) {
            const error = new Error(`Wrong syntax in [${string}]! There is not [$]`);
            logger.error(error, {func: 'Memory.store'});
            throw error;
        }
        const key = string.substring(1);
        this.storage[key] === undefined ? logger.debug(`Was been stored new pair: key [${key}] - value [${value}]`, {func: 'Memory.store'}) :
            logger.warn(`Owerwriting [${this.storage[key]}] into [${value}] by key [${key}]`, {func: 'Memory.store'});
        this.storage[key] = value;
    }

    get(key) {
        const value = this.storage[key];
        if (!value) {
            const error = new Error(`No object was found in memory by key [${key}]`);
            logger.error(error, {func: 'Memory.get'});
            throw error;
        }
        return value;
    }

    clean() {
        this.storage = {};
        logger.debug(`All properties have been deleted. The storage is empty now.`, {func: 'Memory.clean'});
    }

    getProperties() {
        const keys = Object.keys(this.storage);
        keys =  keys.map(key => key + ' : ' + this.storage[key] ).join('\n');
        logger.debug(`The function [getProperties] returns all values from memory: [${keys}]`, {func: 'Memory.getProperties'});
        return keys;
    }
}

const memory = new Memory();

module.exports = memory;