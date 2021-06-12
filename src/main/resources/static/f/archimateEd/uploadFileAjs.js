'use strict';
var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize'])
angular.element(() => angular.bootstrap(document, ['app']))

app.directive('ngFiles', ['$parse', $parse => {
    return {
        link: (scope, element, attrs) =>
            element.on('change', event => $parse(attrs.ngFiles)(scope, { $files: event.target.files }))
    }
}])

let formdata = new FormData()

//app.controller("InitPageController", InitPageController)
class InitPageController {
    constructor($http) {
        const ctrl = this
        let loadStorage = () => $http.get('/r/storagem').then(response => ctrl.filesData = response.data)
        loadStorage()

        ctrl.getTheFiles = $files => angular.forEach($files, value => formdata.append('file', value))

        ctrl.uploadFiles = () => $http({
            method: 'POST', url: '/r/storagem', headers: { 'Content-Type': undefined },
            data: formdata,
        }).then(d => loadStorage())
    }
}
app.controller("InitPageController", InitPageController)
