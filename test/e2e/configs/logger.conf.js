'use strict';

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, colorize } = format;
const archive = [];

const myFormat = printf(info => {
    function fillSpaces(string, length, replacer) {
        if (string)
            while (string.length < length) string += replacer;
        return string;
    }
    const base = `${info.timestamp} [${fillSpaces(info.level.toUpperCase(), 5, ' ')}]`;
    let strings = info.message.split(/(?:(.{2,129})),/);
    strings = strings.filter(elem=> elem!=='');
    let message;
    if (strings.length > 1) {
        let ending = `\n\t\t\t\t\t${strings[strings.length - 1]}`;
        ending = `${ending.length > 129 ? ending + '\n' + fillSpaces('', 129, ' ') : fillSpaces(ending, 129, ' ')} Func : [${info.function ? info.function : info.label}]`;
        strings.splice(strings.length - 1, 1);
        message = `${base} : ${strings.join(',\n\t\t\t\t\t')} ${ending} `;
     } else {
        message = `${base} : ${info.message.length > 129 ? info.message + '\n' + fillSpaces('', 129, ' ') : fillSpaces(info.message, 124, ' ')} Func : [${info.function ? info.function : info.label}]`;
    } 
    return message;
});
const transport = {
    error: new transports.File({
        name: 'error-log',
        filename: './test/e2e/logs/error.log',
        level: 'error'
    }),
    combined: new transports.File({
        name: 'combined-log',
        filename: './test/e2e/logs/combined.log'
    }),
    console: new transports.Console({
        colorize: true
    })
    ,
    collector: new transports.File({
        name: 'page.collector-log',
        filename: './test/e2e/logs/page.collector.log',
        level: 'debug'
    })
};

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
        transport.error,
        transport.combined
    ]
});

function getStr(obj) {
    if (Array.isArray(obj)) {
        let result = '['
        return result += obj.reduce((a, b) => a + ', ' + b) + ']';
    }
    if (obj.__proto__ === Object.prototype) {
        let result = '{';
        Object.keys(obj).forEach((key, ind, arr) => { result += key + ' : ' + getStr(obj[key]); result += (ind < arr.length - 1) ? ', ' : '' });
        return result += ' }';
    }
    return obj;
}

module.exports = { logger, getStr, transport };