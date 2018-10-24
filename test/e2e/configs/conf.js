'use strict';
const { logger } = require('./logger.conf.js');
const { getTagsString, getCapabilities } = require('../utils/config.helper.js');
const storage = require('../utils/memory.helper');
const yargs = require('yargs').argv;

exports.config = {
    getPageTimeout: 60000,
    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    cucumberOpts: {
        "require": ['../features/step_definitions/*steps.js', '../features/step_definitions/hooks.js'],
        "profile": false,
        'no-source': true,
        "format": 'json:test/e2e/reports/report.json',
        "ignoreUncaughtExceptions": true,
        "tags": getTagsString(yargs)
    },
    specs: ['../features/*.feature'],
    logLevel: 'ERROR',
    // seleniumAddress: 'http://localhost:4444/wd/hub', if seleniumAddress nas no value, null or undefined - server will be run automaticaly
    allScriptsTimeout: 500000,
    onPrepare: async () => {
        console.log('On prepare');
        logger.info((await browser.driver.getSession()).getId());
        console.log((await browser.driver.getSession()).getId());
        logger.info('Browser starts in maximize size for running tests');
        browser.driver.manage().window().maximize();
        browser.driver.manage().timeouts().implicitlyWait(20000);
        global.ec = protractor.ExpectedConditions;
        browser.waitForAngularEnabled(false);
    },
    capabilities: getCapabilities(yargs),
    beforeLaunch: () => {
        console.log(`before launch`);
        global.storage = storage;
        logger.info(`Get started`);
    },
    afterLaunch: () => {
        console.log(`After launch`);
        logger.info(`Have been completed!`);
    },
};