'use strict';

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const logger = createLogger({
    level: 'debug',
    format: combine(
        label({ label: 'bellagio.com' }),
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        myFormat
    ),
    transports: [
        // new transports.Console({
        //     colorize: true
        // }),
        new (transports.File)({
            filename: './logs/combined.log'
            //  maxsize: 1000
        }),
        new (transports.File)({
            name: 'error-log',
            filename: './logs/error.log',
            level: 'error'
            // maxsize: 1000
        })
    ]
});

module.exports = { logger };