'use strict';

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, colorize } = format;

const myFormat = printf(info => {
    return `${info.timestamp} [${info.level.toUpperCase()}] : [function: ${info.function}] - ${info.message}`;
});

const logger = createLogger({
    level: 'debug',
    format: combine(
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