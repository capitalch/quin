"use strict";
var handler = require('./handler');
var express = require('express');
var fs = require('fs');
var http = require('http');
var router = express.Router();
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
var util = require('util');
var def = require('./definitions');
var messages = require('./messages');
var helper = require('./helper');

router.get('/api/test', (req, res, next) => {
    let data = {
        action: 'post:speech:to:text'
    };
    handler.emit(res, next, 'post:speech:to:text', data);
    // res.status(200).end("ok");
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
            let filePath = util.format("%s%s", "c:\\temp\\", fileName);
            
            fs.writeFile(filePath, data, 'binary', (err) => {
                if (err) {
                    return (console.log(err));
                } else {
                    let data = {
                        action: 'post:speech:to:text',                        
                        filePath:filePath
                    };
                    handler.emit(res, next, 'post:speech:to:text', data);
                }
            });
        // let filePath = 'c:\\temp\\testBinary-223.29.199.212-1491141871397.wav';
            // let data1 = {
            //             action: 'post:speech:to:text',                        
            //             filePath:filePath
            //         };
            //         handler.emit(res, next, 'post:speech:to:text', data1);
        }
        // res
        //     .status(200)
        //     .end();
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});

router.post('/api/cris', function (req, res, next) {
    try {
        let out1 = {
            cris: 'This is output of cris service'
        };
        let out = Object.assign({}, req.body, out1);
        res.json(out);
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});

router.post('/api/luis', function (req, res, next) {
    try {
        let out1 = {
            luis: 'This is output of LUIS service'
        };
        let out = Object.assign({}, req.body, out1);
        res.json(out);
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});

router.post('/api/pathFinder', function (req, res, next) {
    try {
        let out1 = {
            pathfinder: 'This is output of Pathfinder'
        };
        let out = Object.assign({}, req.body, out1);
        res.json(out);
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});

router.get('/api', (req, res, next) => {
    try {
        let data = { in: 'This is input to cris service'
        };
        handler.httpRequest('post:cris', 'POST', data, res);
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
});

module.exports = router;
//deprecated
/*

*/
