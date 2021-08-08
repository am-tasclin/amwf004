'use strict';
const singlePage = {}, conf = {}, sql_app = {}
console.log(1)
var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize'])
angular.element(() => angular.bootstrap(document, ['app']))


class AbstractController { singlePage = singlePage; conf = conf }
class InitPageController extends AbstractController {
    constructor($scope, $route) {
        super()
        console.log(2)
    }
}
// app.controller("InitPageController", InitPageController)
app.controller("InitPageController", InitPageController)