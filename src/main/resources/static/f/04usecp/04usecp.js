'use strict';
const singlePage = {}, conf = {}, sql_app = {}
var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize']);
angular.element(() => angular.bootstrap(document, ['app']))
conf.fr = {}
conf.fr.cp = {}

// app.factory("dataBeFactory", DataDBexchangeService)
class DataDBexchangeService {
    constructor($http, $q, $resource) {
        return {
            docbodyjson: $resource('/r/docbodyjson/:doc_id', { doc_id: '@doc_id'}),
        }
    }
}
app.factory("dataBeFactory", DataDBexchangeService)

// app.factory("p2f", PageFactory)
class PageFactory {
    hi = () => {
        console.log('hi')
    }
}
app.factory("p2f", PageFactory)

// app.controller("InitPageController", InitPageController)
class InitPageController {
    p2f
    constructor($http, p2f, dataBeFactory) {
        p2f.hi()
        dataBeFactory.docbodyjson.get({doc_id:372844}).$promise.then((data)=>{
            console.log(data)
            conf.fr.cp.docbody = data
        })
    }
}
app.controller("InitPageController", InitPageController)
