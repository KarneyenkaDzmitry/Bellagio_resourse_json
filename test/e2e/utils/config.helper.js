'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const { logger, getStr } = require('../configs/logger.conf.js');
const message = {};

function getTagsString({ tags }) {
    message.function = 'getTagsString';
    let result = '';
    if ((tags !== undefined) && (tags !== null)) {
        tags.split(',').forEach((element, ind, array) => {
            try {
                if (element.startsWith('@')) {
                    result += (ind < array.length - 1) ? element + ' or ' : String(element);
                } else {
                    throw new Error(`Was passed wrong parameter [${getStr(element)}]. Every tag have to start with [@] and seporates with comma`);
                }
            } catch (error) {
                logger.error(error, message);
                throw error;
            }
        });
    }
    logger.debug(`The result string of tags is [${getStr(result)}]`, message);
    return result;
}

function getCapabilities({ browserName = 'chrome', maxInstances = 1 }) {
    message.function = 'getCapabilities';
    const capabilities = {};
    capabilities.browserName = browserName;
    capabilities.shardTestFiles = maxInstances > 1;
    capabilities.maxInstances = maxInstances;
    capabilities.chromeOptions = capabilities.browserName === 'chrome' ? {
        args: ['disable-infobars', '--test-type']
    } : undefind;
    logger.debug(`getCapabilities method has returned : [${getStr(capabilities)}]`, message);
    return capabilities;
}

async function combineJsonReports(directory) {
    message.function = 'combineJsonReports';
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
        return fs.writeFileSync(resultFile, JSON.stringify(data), 'utf8');
    } catch (error) {
        logger.error(error, message);
        throw error;
    }
}

module.exports = { combineJsonReports, getCapabilities, getTagsString };