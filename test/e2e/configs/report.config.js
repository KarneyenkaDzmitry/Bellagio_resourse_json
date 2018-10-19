'use strict';

const reporter = require('cucumber-json-reporter-to-html');
const { combineJsonReports } = require('../utils/config.helper');

async function create() {
    await combineJsonReports('./test/e2e/reports');
    reporter.create('./test/e2e/reports/report.json', './test/e2e/reports/Bellagio.html', 'Bellagio.com UI-Tests', 'Tests based on: cucumber with protractor approach ');
}
create();