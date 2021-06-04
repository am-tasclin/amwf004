'use strict';
const singlePage = {}, conf = {}, sql_app = {}
var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize']);
angular.element(() => angular.bootstrap(document, ['app']))

// app.controller("InitPageController", InitPageController)

// app.factory("p2f", PageFactory)
class PageFactory {
    hi = () => {
        console.log('hi')
    }
}
app.factory("p2f", PageFactory)

class InitPageController {
    p2f
    constructor($http, p2f) {
        p2f.hi()
    }
}
app.controller("InitPageController", InitPageController)
