'use strict';

const { logger } = require('./logger.conf.js');
const { getTagsString, getCapabilities } = require('../utils/config.helper.js');
const yargs = require('yargs').alias({
    't': 'tags',
    'b': 'browserName',
    'i': 'maxInstances'
}).argv;

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
        logger.info('Browser session is ' + (await browser.driver.getSession()).getId(), { func: 'onPrepare' });
        logger.info('Browser starts in maximize size for running tests', { func: 'onPrepare' });
        browser.driver.manage().window().maximize();
        browser.driver.manage().timeouts().implicitlyWait(20000);
        global.ec = protractor.ExpectedConditions;
        global.storage = require('../utils/memory.helper');
        browser.waitForAngularEnabled(false);
    },
    capabilities: getCapabilities(yargs),
    beforeLaunch: () => {
        logger.info(`GET STARTED `, { func: 'beforeLaunch' });
    },
    afterLaunch: () => {
        logger.info(`HAVE BEEN COMPLETED! `, { func: 'afterLaunch' });
    }
};