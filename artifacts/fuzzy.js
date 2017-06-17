require('./stopWords');
// let fuzzySet = require('fuzzyset.js');
// let fuzzy = require('fuzzy');
// let fuse = require('fuse.js');
let pathfinder = require('./pathfinder');
let handler = require('./handler');
let def = require('./definitions');
let messages = require('./messages');

(function init() {
    let subscriptions = handler
        .filterOn('get:fuzzy:feature:list')
        .subscribe(d => {
            if (d.data.error) {
                console.log(d.data.error);
                let err = new def.NError(501, messages.errFeatureFamiliesLoadingError, d.data.error)
                d
                    .res
                    .next(err);
            } else {
                try {
                    let featureList = d
                        .data
                        .map(x => {
                            return ({fName: x.name, fKey: x.key});
                        }).slice(0,20);
                    d
                        .res
                        .json(featureList);
                } catch (error) {
                    let err = new def.NError(500, messages.errInternalServerError, error.message);
                    d
                        .res
                        .next(err);
                }
            }
        });
})();

function getKeyWords(wordString) {
    let keyWords = wordString.removeStopWords()
    return (keyWords);
}
exports.getKeyWords = getKeyWords;

// function getFuse(inputString) {
//     let features = pathfinder.getFeatureNames();
//     var options = {
//         keys: ['fName'],
//         includeScore: true,
//         threshold: 0.2,
//         tokenize: true,
//         // includeMatches: true//,
//         shouldSort: true
//     };
//     var f = new fuse(features, options)
//     let ret = f.search(inputString);
//     return (ret);
// }
// exports.getFuse = getFuse;

function getFuzzyDB(inputString, res) {
    inputString = inputString
        .split(' ')
        .join('+');
    handler.httpRequest('get:fuzzy:feature:list', 'GET', null, res, {query: inputString});
}
exports.getFuzzyDB = getFuzzyDB;

/* Deprecated
function getFuzzy(inputStrig) {
//     let a = FuzzySet();
//     a.add('AppSecure - AppFW JWEB support for configuration and reporting');
//     a.add('AppSecure - AppFW rule set features expanded');
//     a.add('AppSecure - Application Firewall (AppFW) [Support for Policy Services]');
//     let ret = a.get(inputStrig);
//     return (ret);
// }
// exports.getFuzzy = getFuzzy;

// function getFuzzy1(inputString, res) {
//     var list = ['AppSecure - AppFW JWEB support for configuration and reporting', 'AppSecure - AppFW rule set features expanded', 'AppSecure - Application Firewall (AppFW) [Support for Policy Services]'];
//     var results = fuzzy.filter(inputString, list)
//     var matches = results.map(function (el) {
//         res.send(el.string);
//     });
//     console.log(matches);
// }
// exports.getFuzzy1 = getFuzzy1;
*/