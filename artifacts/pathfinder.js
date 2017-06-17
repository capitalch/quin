let handler = require('./handler');
let def = require('./definitions');
var fs = require('fs');
let _ = require('lodash');
let featureNames = [];

(function init() {
    let res;
    let sub1 = handler
        .filterOn('get:path:finder:feature:families')
        .subscribe(d => {
            if (d.data.error) {
                console.log(d.data.error);
                let err = new def.NError(501, messages.errFeatureFamiliesLoadingError, d.data.error)
                next(err);
            } else {
                let ff = d.data;
                let featureList = [];
                ff.forEach(x => handler.httpRequest('get:path:finder:feature:names', 'GET', null, res, {ff_key: x.ffKey}));
                console.log('Feature names getting completed');
            }
        });

    let sub2 = handler
        .filterOn('get:path:finder:feature:names')
        .subscribe(d => {
            if (d.data.error) {
                console.log(d.data.error);
                let err = new def.NError(501, messages.errFeatureFamiliesLoadingError, d.data.error)
                next(err);
            } else {
                featureNames = _.concat(featureNames, d.data);
                console.log('Count:Feature:Names:', featureNames.length);
            }
        });

    let sub3 = handler
        .filterOn('post:path:finder:feature:details')
        .subscribe(d => {
            let ret = false;
            if (d.data.error) {
                console.log(d.data.error);
                let err = new def.NError(501, messages.errFeatureFamiliesLoadingError, d.data.error)
                next(err);
            } else {
                let results = JSON.parse(d.data);
                let selection = results.find(x => x.relPlatformVO.platform.toLowerCase() == d.res.platformName.toLowerCase());
                let platform = selection && selection.relPlatformVO.platform;
                // let platform = selection.relPlatformVO.platform;
                if (platform) {
                    ret = true;
                }
            }
            d
                .res
                .json({feature: d.res.featureName, platform: d.res.platformName, supported: ret});
        });
})();

function loadFeatures(res) {
    featureNames = [];
    handler.httpRequest('get:path:finder:feature:families', 'GET', null, res);
};
exports.loadFeatures = loadFeatures;

function getFeatureKey(featureName) {
    let featureKey;
    let feature = _.find(featureNames, (x) => x.fName.toLowerCase() == featureName.toLowerCase())
    if (feature) {
        featureKey = feature.fKey;
    }
    return (featureKey);
}
exports.getFeatureKey = getFeatureKey;

function isFeatureSupportedInPlatform(featureKey, featureName, platformName, res) {
    let ret = false;
    featureKey || (featureKey = getFeatureKey(featureName));
    // let featureKey = getFeatureKey(featureName);
    if (featureKey) {
        res.platformName = platformName; // res is working as bag for platformName and featureName.
        res.featureName = featureName;
        handler.httpRequest('post:path:finder:feature:details', 'POST', {
            fKey: featureKey
        }, res);
    } else {
        res.json({feature: featureName, platform: platformName, supported: 'feature not found'});
    }
}
exports.isFeatureSupportedInPlatform = isFeatureSupportedInPlatform;
exports.getFeatureNames = ()=>{
    return(featureNames);
}