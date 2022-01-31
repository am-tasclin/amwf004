'use strict';
var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize'])
angular.element(() => angular.bootstrap(document, ['app']))

class InitPageController {
    constructor($http) {
        let ctrl = this
        const url = 'api.medzakupivli.com.json'
        $http.get(url).then(r => {
            ctrl.ddccData = r.data
            console.log(url, ctrl.ddccData)
            ctrl.ddccData.document_set
                .d_last_content_changed
                = new Date(ctrl.ddccData.document_set.last_content_changed)
            console.log(ctrl.ddccData.document_set.d_last_content_changed)

        })
    }
}

app.controller('InitPageController', InitPageController)