'use strict';

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, colorize } = format;

const myFormat = printf(info => {
    function fillSpaces(string, length, replacer) {
        if (string)
            while (string.length < length) string += replacer;
        return string;
    }
    const base = `${info.timestamp} [${fillSpaces(info.level.toUpperCase(), 5, ' ')}]`;
    const message = `${base} : ${fillSpaces(info.message, 110, ' ')}`
    return `${message}${message.length > 129 ? `\n${fillSpaces(base, 129, ' ')}` : ''} Place: [${info.function ? info.function : info.label}]`;
});

const logger = createLogger({
    level: 'debug',
    format: combine(
        label({ label: 'Bellagio.com' }),
        timestamp({
            format: 'HH:mm:ss'
        }),
        myFormat
    ),
    transports: [
        // new transports.Console({
        //     colorize: true
        // }),
        new (transports.File)({
            filename: './test/e2e/logs/combined.log'
            //  maxsize: 1000
        }),
        new (transports.File)({
            name: 'error-log',
            filename: './test/e2e/logs/error.log',
            level: 'error'
            // maxsize: 1000
        })
    ]
});

function getStr(obj) {
    if (Array.isArray(obj)) {
        let result = '\n['
        return result += obj.reduce((a, b) => a + ', ' + b) + ']';
    }
    if (obj.__proto__ === Object.prototype) {
        let result = '\n{';
        Object.keys(obj).forEach((key, ind, arr) => { result += key + ' : ' + getStr(obj[key]); result += (ind < arr.length - 1) ? '\n ' : '' });
        return result += '}';
    }
    return obj;
}

module.exports = { logger, getStr };