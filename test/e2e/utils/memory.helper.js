'use strict';

const { logger } = require('../configs/logger.conf');

class Memory {
    constructor() {
        logger.debug('Instance of Memory has been created.')
        this.storage = {};
    }

    getValue(string) {
        const result = /^\$/.test(string) ? this.get(string.substring(1)) : string;
        logger.debug(`Memory.prototype.getValue([${string}]) returns [${result}]`);
        return result;
    }

    async store(string, value) {
        if (!/^\$/.test(string)) {
            logger.error(`Wrong syntax in [${string}]! There is not [$]`);
            throw new Error(`Wrong syntax in [${string}]! There is not [$]`);
        }
        const key = string.substring(1) + (await browser.getSession()).getId();
        this.storage[key] === undefined ? logger.debug(`Was been stored new pair: key [${key}] - value [${value}]`) :
            logger.warn(`Owerwriting [${this.storage[key]}] into [${value}] by key [${key}]`);
        this.storage[key] = value;
    }

    async get(key) {
        const value = this.storage[key + (await browser.getSession()).getId()];
        if (!value) {
            logger.error(`No object was found in memory by key [${key}]`);
            throw new Error(`No object was found in memory by key [${key}]`);
        }
        return value;
    }

    clean() {
        this.storage = {};
    }
}

const memory = new Memory();

module.exports = memory;