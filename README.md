# Tests framework based on mixin approach. Resource - bellagio.com


## Implementation

### Dependencies

The application needs to have the following dependencies:
1. npm --version 6.1.0
2. node --version 8.*.*

### Deploy

#### $ npm install

Before start the program is supposed to run the command [npm install].<br> 
It downloads needed modules and prepars the programm for starting.<br>
i.e. will be created folders : 'logs' and 'reports'.<br>
And will be run webdriver-manager update.

#### There is a list of modules and their versions:

    `"chai": "^4.1.2",
    "cucumber": "^5.0.1",
    "cucumber-json-reporter-to-html": "git+https://github.com/KarneyenkaDzmitry/cucumber-json-reporter-to-html.git",
    "protractor": "^5.4.0",
    "protractor-cucumber-framework": "^6.1.1",
    "winston": "^3.0.0",
    "yargs": "^12.0.2"`

## Structure 
### Folders:

- [test](https://github.com/KarneyenkaDzmitry/bellagio.com_with_mixin/tree/master/test) - there are all files and folders connected with tests;
- [node_modules] - will be created after [npm install] command. There will be stored all additional modules;
- [reports] - will be created after the first run of [npm test] command. There will be stored all data that are need for report;

### Files in root:

- [.eslintignore](https://github.com/KarneyenkaDzmitry/bellagio.com_with_mixin/blob/master/.eslintignore) - all folders and files that should not be indexed by [eslint] are listed here;
- [.eslintrc.js](https://github.com/KarneyenkaDzmitry/bellagio.com_with_mixin/blob/master/.eslintrc.js) - all rulles for [eslint] are placed there;
- [.gitignore](https://github.com/KarneyenkaDzmitry/bellagio.com_with_mixin/blob/master/.gitignore) -  all folders and files that should not be indexed by [git] are listed here;
- [package.json](https://github.com/KarneyenkaDzmitry/bellagio.com_with_mixin/blob/master/package.json) - includes all data for [npm]
- [README.md](https://github.com/KarneyenkaDzmitry/bellagio.com_with_mixin/blob/master/README.md) - readme file with special information about the application and git-syntacs. 

## Usage

There are some scripts in [package.json](https://github.com/KarneyenkaDzmitry/bellagio.com_with_mixin/blob/master/package.json) that helps us.<br>

1. `$ .\node_modules\.bin\protractor .\configs\conf.js --tags '@Restaurants,@Search'`<br>
2. `$ npm test -- --tags '@Restaurants,@Search'`<br>
3. `$ npm test`

### NPM scripts 



### Author
#### Dzmitry_Karneyenka, Republic of Belarus, Minsk 

## N.B.

### Why console.log() does not print in console anything if it locates in onPrepare() method?
- You run test in more than one instances of browser. Note any loggers print everything instead of console.log();<br>
i.e. Use logger instead of console.log()<br>

### How to ran posttest script after test script if the test has failed
- Use special construction `<scriptName>: "<script> || exit 0"` <br>
e.g. `"test": "./node_modules/.bin/protractor ./configs/conf.js || exit 0"`<br>

### How to run tests by using multiple tags with protractor-cucumber-framework
 1. using npm script (e.g. "test": "protractor ./pathToConfig.js") <br>
`$ npm test -- --cucumberOpts.tags='@Search'`<br>
Don't forget use additional '--' dashes because it is the special simbols that say to npm that there are some arguments for running command<br>
[see review](https://corgibytes.com/blog/2017/04/18/npm-tips/)<br>
 2. using plant command<br>
`$ .\node_modules\.bin\protractor .\configs\conf.js --cucumberOpts.tags='@Search or @Restaurants'`<br>
Set 'cucumberOpts.tags' according to needed tests with related tags.<br>
 Use construction : '@tag1 and @tag2' - for tests that contains these two tags<br>
 -------------------: '@tag1 or @tag2' --- for tests that include or tag1 or tag2<br>
 -------------------: '@tag1 or not @tag2' - fortests that includes @tag1 or doesn't include @tag2<br>
 [see documentation](https://docs.cucumber.io/cucumber/tag-expressions/)<br>

