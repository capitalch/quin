"use strict";
var settings = require('./settings');
var Mustache = require('mustache');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
var edge = require('edge');
var request = require('request');
var rx = require('rxjs');
var def = require('./definitions');
var messages = require('./messages');
var subject = new rx.Subject();

var marshal = edge.func({assemblyFile: 'SpeechRecognition.dll', typeName: 'SpeechRecognition.JPConnector', methodName: 'Invoke'});

function initSpeechRecog(res, next) {
    let data = {
        action: 'init',
        speechSettings: config.speechSettings
    };
    marshal(data, (error, result) => {
        if (error) {
            next(error);
        } else if (result.error) {
            next(result.error);
        }
    });
};

initSpeechRecog();
exports.initSpeechRecog = initSpeechRecog;

function emit(res, next, id, data) {
    marshal(data, (error, result) => {
        if (error) {
            next(error);
        } else {
            subject.next({res: res, next: next, id: id, result: result, data: data});
        }
    });
};
exports.emit = emit;

//filter
let filterOn = (id) => {
    return (subject.filter(d => d.id === id));
}
exports.filterOn = filterOn;

let initSubscriptions = () => {
    let sub1 = filterOn('post:speech:to:text').subscribe(d => {
        if (d.data.error) {
            console.log(d.data.error);
        } else {
            // fs.unlinkSync(d.data.filePath);
            d
                .res
                .json(d.result);
        }
    });
};
initSubscriptions();

let httpRequest = (id, method, data, res, templateData) => {
    try {
        let url = settings.urls[id];
        if (templateData) { //mustache template
            url = Mustache.render(url, templateData)
        }
        let options = {
            url: url,
            method: method,
            json:true
        };
        if (data) {
            options = Object.assign(options, {
                form: data
                ,json: false
            });
        }
        request(options, (error, response, body) => {
            if (error) {
                let data = {};
                data.error = error;
                subject.next({id: id, data: data, res: res});
            } else {
                subject.next({id: id, data: body, res: res});
            }
        });
    } catch (error) {
        let err = new def.NError(500, messages.errInternalServerError, error.message);
        next(err);
    }
}
exports.httpRequest = httpRequest;
