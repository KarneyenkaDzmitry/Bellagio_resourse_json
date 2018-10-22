'use strict';

const pages = require('../source/pages.json');

function getChain(po, name) {
    let array = [];
    if (po.children) {
        const keys = Object.keys(po.children);
        const ind = keys.findIndex(key => { array.push(key); return key === name; });
        if (ind > -1) {
            return array[ind];
        } else {
            let result = '';
            let key = keys.find(key => { result = getChain(po.children[key], name); return result });
            return key + ' > ' + result;
        }
    } else {
        return po.children;
    }
}
console.log(getChain(pages['en.html']['home page'], 'menu items'))//['home page']['children']['header']);