const {promises: {readFile, writeFile, readdir }} = require('fs');
const {resolve} = require('path');
const pathToPages = resolve(__dirname,'..', 'src','pages');
console.info(pathToPages);
const environments = require('../../config/environments.json');
const serviceEnv = process.env.SERVICE_ENV || 'LUXID';
const {urls : {ui:baseUrl}} = environments.find(element => element.id === serviceEnv);

console.info('SERVICE_ENV is: [%s]',baseUrl);

const append = (pagePath, appender) => readFile(pagePath)
    .then(content => JSON.parse(content))
    .then(content => {
        // console.log(content.url);
        const {groups: {uri}} = /(?<uri>\/[#!\w]*)$/.exec(content.url);
        content.url = appender + uri;
        return content;
    })
    .then(content => writeFile(pagePath, JSON.stringify(content)));

const corrector = url => {
    const {groups: {appender}} = /^(?:http(s)?:\/\/)?(?:.*?)(?<appender>\/.*)$/.exec(url);
    console.info('Appender is [%s]', appender);
    return readdir(pathToPages)
        .then(files => files.filter(filename => /.page.json$/.test(filename)))
        // .then(files => {
        //     console.info(files); return files;
        // })
        .then(pages => pages.forEach(page => append(resolve(pathToPages, page), appender)))
        .catch(error => {
            error.message += 'Error occured during correction PO urls.';
            return error;
        });
};

corrector(baseUrl);
