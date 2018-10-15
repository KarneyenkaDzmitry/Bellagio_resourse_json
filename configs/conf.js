'use strict';
const logger = require('./logger.conf.js').logger;
const { getTagsString, getCapabilities } = require('../utils/config.helper.js');
const yargs = require('yargs').argv;

exports.config = {
    getPageTimeout: 60000,
    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    cucumberOpts: {
        "require": ['../features/step_definitions/*steps.js', '../features/step_definitions/hooks.js'],
        "profile": false,
        'no-source': true,
        "format": 'json:./reports/report.json',
        "ignoreUncaughtExceptions": true,
        "tags": getTagsString(yargs)
    },
    specs: ['../features/*.feature'],
    logLevel: 'ERROR',
    // seleniumAddress: 'http://localhost:4444/wd/hub', if seleniumAddress nas no value, null or undefined - server will be run automaticaly
    allScriptsTimeout: 500000,
    onPrepare: () => {
        logger.info('Browser starts in maximize size for running tests');
        browser.driver.manage().window().maximize();
        browser.driver.manage().timeouts().implicitlyWait(20000);
        browser.waitForAngularEnabled(true);
        global.ec = protractor.ExpectedConditions;
    },
    capabilities: getCapabilities(yargs),
    beforeLaunch: () => {
        logger.info('Get started!');
    },
    afterLaunch: () => {
        logger.info('Done');
    },
};