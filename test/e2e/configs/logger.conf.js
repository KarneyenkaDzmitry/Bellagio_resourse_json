'use strict';

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, colorize } = format;

const myFormat = printf(info => {
    function fillSpaces(string, length) {
        if (string)
        while (string.length < length) string += ' ';
        return string;
    }
    return `${info.timestamp} [${fillSpaces(info.level.toUpperCase(), 5)}] : [${info.function? info.function: info.label}] - ${info.message}`;
});




const logger = createLogger({
    level: 'debug',
    format: combine(
        label({label:'Bellagio.com'}),
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

module.exports = { logger };