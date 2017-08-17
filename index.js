const translate = require('google-translate-api');
const inputFile = require('./input');
const jsonfile = require('jsonfile');
const TAB_SIZE = 4;
const TRANSLATE_FROM = 'en';
const TRANSLATE_TO = 'sv';
const MAGIC_NUMBER = 7777;

let result = inputFile;

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function translateJSON(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            translateJSON(obj[key]);
        } else {
            sendOnTranslation(obj, key);
        }
    }
}

function sendOnTranslation(obj, key) {
    translate(obj[key], { from: TRANSLATE_FROM, to: TRANSLATE_TO }).then((res) => {
        obj[key] = res.text.capitalize();
    }).catch(err => {
        console.log(err);
    });
}

function saveTranslationOnDisk(data) {
    jsonfile.writeFile(`./${TRANSLATE_TO}.js`, data, { spaces: TAB_SIZE }, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('SUCCESS!');
    });
}

function goGoGo() {
    console.log('PROCESSING...');
    translateJSON(result);
    setTimeout(() => {
        saveTranslationOnDisk(result);
    }, MAGIC_NUMBER);
}


goGoGo();