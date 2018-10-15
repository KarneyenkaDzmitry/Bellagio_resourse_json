'use strict';

const { After, Status } = require('cucumber');
const { setDefaultTimeout } = require('cucumber');
setDefaultTimeout(60 * 1000);
/* eslint-disable */
After(function(scenario) {
    if (scenario.result.status === Status.FAILED) {
        return browser.takeScreenshot().then((screenShot) => {
            let decodedImage = new Buffer(screenShot, 'base64');
            return this.attach(decodedImage, 'image/png');
        });
    }
});
/* eslint-enable */