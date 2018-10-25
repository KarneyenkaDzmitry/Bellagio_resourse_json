'use strict';

const { logger } = require('../configs/logger.conf');

class Memory {
    constructor() {
        logger.debug('Instance of Memory has been created.')
        this.storage = {
            "test":"first"
        };
    }

    getValue(string) {
        const result = /^\$/.test(string) ? this.get(string.substring(1)) : string;
        logger.debug(`Memory.prototype.getValue([${string}]) returns [${result}]`);
        return result;
    }

    store(string, value) {
        if (!/^\$/.test(string)) {
            logger.error(`Wrong syntax in [${string}]! There is not [$]`);
            throw new Error(`Wrong syntax in [${string}]! There is not [$]`);
        }
        const key = string.substring(1); //+ (await browser.getSession()).getId();
        this.storage[key] === undefined ? logger.debug(`Was been stored new pair: key [${key}] - value [${value}]`) :
            logger.warn(`Owerwriting [${this.storage[key]}] into [${value}] by key [${key}]`);
        this.storage[key] = value;
    }

    get(key) {
        const value = this.storage[key];
        if (!value) {
            logger.error(`No object was found in memory by key [${key}]`);
            throw new Error(`No object was found in memory by key [${key}]`);
        }
        return value;
    }

    clean() {
        this.storage = {};
        logger.debug(`All properties have been deleted. The storage is empty now.`);
    }

    getProperties() {
        const keys = Object.keys(this.storage);
        return keys.map(key => key + ' : ' + this.storage[key] ).join('\n');
    }
}

const memory = new Memory();

module.exports = memory;