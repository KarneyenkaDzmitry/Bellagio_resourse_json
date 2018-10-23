'use strict';

class Memory {
    constructor() {
        this.storage = {};
    }

    getValue(string) {
        return /^\$/.test(string) ? this.get(string.substring(1)) : string;
    }

    async store(string, value) {
        if (!/^\$/.test(string)) throw new Error(`Wrong syntax in [${string}]! There is not [$]`);
        this.storage[string.substring(1) + await browser.getSession()] = value;
    }

    async get(key) {
        const value = this.storage[key + await browser.getSession()];
        if (!value) throw new Error(`No object was found in memory by key [${key}]`);
        return value;
    }

    clean() {
        this.storage = {};
    }
}

const memory = new Memory();

module.exports = memory;