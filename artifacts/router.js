"use strict";
var handler = require('./handler');
var settings = require('./settings');
var express = require('express');
var fs = require('fs');
var http = require('http');
var router = express.Router();
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
var util = require('util');
var def = require('./definitions');
var messages = require('./messages');
var helper = require('./helper');
let pathFinder = require('./pathfinder');
// let _ = require('lodash'); let featureNames=[];

pathFinder.loadFeatures();
router.get('/api/test', (req, res, next) => {
    let data = {
        action: 'post:speech:to:text'
    };
    handler.emit(res, next, 'post:speech:to:text', data);
});

router.get('/api/features', (req, res, next) => {
    res.json(featureNames);
})

router.get('/api/load/features', (req, res, next) => {
    try {
        pathFinder.loadFeatures(res);
        res.json({status: messages.messFeaturesLoaded});
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});

router.post('/api/feature/supported', (req, res, next) => {
    try {
        let featurePlatform = req.body;
        if(!featurePlatform.Feature){
            featurePlatform.Feature = 'Loopback';
        }
        if(!featurePlatform.Platform){
            featurePlatform.Platform = 'J2320';
        }
        pathFinder.isFeatureSupportedInPlatform(featurePlatform.Feature, featurePlatform.Platform, res);
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
})

router.get('/api/feature', (req, res, next) => {
    try {
        let fKey = pathFinder.getFeatureKey('FTP');
        res.json({fKey: fKey});
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});

router.get('/api/mobile/js', function (req, res, next) {
    let clientId = 'SushBingSpeech';
    let clientSecret = 'c5dc90f5a715476280166b8da5e5733d';
    clientSecret = 'c5dc90f5a715476280166b8da5e5733d';
    helper.getAccessToken(clientId, clientSecret, (d) => {
        console.log(d);
    });
    res.end("ok");
});

router.post('/api/mobile', function (req, res, next) {
    try {
        let dataArray = req
            .body
            .src
            .split(',');
        if (dataArray.length > 1) {
            let data = new Buffer(dataArray[1], 'base64');
            let timestamp = Number(new Date());
            let fileName = util.format("%s-%s-%s.%s", "testBinary", helper.getClientIp(req), timestamp, "wav");
            let filePath = util.format("%s%s", "temp\\", fileName);

            fs.writeFile(filePath, data, 'binary', (err) => {
                if (err) {
                    return (console.log(err));
                } else {
                    let data = {
                        action: 'post:speech:to:text',
                        filePath: filePath
                    };
                    handler.emit(res, next, 'post:speech:to:text', data);
                }
            });
        }
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});

module.exports = router;
