'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const { logger } = require('../configs/logger.conf.js');

function getTagsString({ tags }) {
    let result = '';
    if ((tags !== undefined) && (tags !== null)) {
        tags.split(',').forEach((element, ind, array) => {
            if (element.startsWith('@')) {
                result += (ind < array.length - 1) ? element + ' or ' : String(element);
            } else {
                logger.error(`Was passed wrong parameter [${element}]. Every tag have to start with [@] and seporates with comma`);
                throw new Error('Was passed wrong data. Every tag have to start with [@]');
            }
        });
    }
    logger.debug(`The result string of tags is [${result}]`,result);
    return result;
}

function getCapabilities({ browserName = 'chrome', maxInstances = 1 }) {
    const capabilities = {};
    capabilities.browserName = browserName;
    capabilities.shardTestFiles = maxInstances > 1;
    capabilities.maxInstances = maxInstances;
    capabilities.chromeOptions = capabilities.browserName === 'chrome' ? {
        args: ['disable-infobars', '--test-type']
    } : undefind;
    logger.debug(`getCapabilities method has returned : [${capabilities}]`);
    logger.debug(capabilities.toString());
    return capabilities;
}

async function combineJsonReports(directory) {
    try {
        const files = await readdir(directory);
        let data = [];
        files.forEach(filename => {
            const filePath = path.resolve(`${directory}/${filename}`);
            if (filePath.endsWith('.json')) {
                const filedata = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                data = [...data, ...filedata];
            }
        });
        const resultFile = path.resolve(`${directory}/report.json`);
        return fs.writeFileSync(resultFile, JSON.stringify(data), 'utf8')
    } catch (err) {
        console.log(err);
    }
}

module.exports = { combineJsonReports, getCapabilities, getTagsString };