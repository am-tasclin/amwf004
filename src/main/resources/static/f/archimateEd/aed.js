'use strict';
const singlePage = {}, conf = {}, sql_app = {}
// lib singlePage
import('/f/js/lib.singlePage001.js')
var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize']);
angular.element(() => angular.bootstrap(document, ['app']))
const parser = new DOMParser()
conf.openedFolderList = []
conf.elMap = {}

//app.factory("am2f", ArchiMateFileFactory)
class ArchiMateFileFactory {
    constructor() { }
    setXopen = (x) => {
        if (x) {
            console.log(2, x.id)
            if (conf.openedFolderList.includes(x.id)) {
                conf.openedFolderList.splice(conf.openedFolderList.indexOf(x.id), 1)
            } else {
                conf.openedFolderList.push(x.id)
            }
        }
    }
    clickAmItem = (x) => {
        if (x) {
            this.setXopen(x)
            conf.currentX = x
        }
    }
}
app.factory("am2f", ArchiMateFileFactory)

// app.config(InitArchiMateElementController)
const forEachParent = (el, fLambda) => {
    if (el.parentElement) {
        fLambda(el.parentElement)
        forEachParent(el.parentElement, fLambda)
    }
}
class InitArchiMateElementController {
    constructor(am2f) {
        console.log(singlePage.LastUrlId(), conf.elMap)
        conf.currentX = conf.elMap[singlePage.LastUrlId()]
        if (conf.currentX)
            forEachParent(conf.currentX, (x) => conf.openedFolderList.push(x.id))
    }
}
app.controller('InitArchiMateElementController', InitArchiMateElementController)

// app.config(RouteProviderConfig)
class RouteProviderConfig {
    constructor($routeProvider) {
        console.log(11)
        $routeProvider
            .when("/el_:el_id", {
                templateUrl: "ElementArchiMate.html",
                controller: 'InitArchiMateElementController',
            })
            .when("/v_:el_id", {
                templateUrl: "ElementArchiMate.html",
                controller: 'InitArchiMateElementController',
            })
            .when("/", {
                templateUrl: "ElementArchiMate.html",
                controller: 'InitArchiMateElementController',
            })
            .otherwise({
                template: "<h1>?</h1><p>Щось невідоме</p>"
            })
    }
}
app.config(RouteProviderConfig)

// app.controller("InitPageController", InitPageController)
const initPageMap = (x) => {
    conf.firstListIds.push(x.id)
    conf.elMap[x.id] = x
    initDeepElMap(x)
}
const initDeepElMap = (x) => {
    // if (x.children) 
    angular.forEach(x.children, (x) => {
        if (x.id) {
            conf.elMap[x.id] = x
            initDeepElMap(x)
        }
    })
}
class InitPageController {
    am2f
    constructor($http, am2f) {
        this.am2f = am2f
        this.conf = conf
        const ctrl = this
        ctrl.singlePage = singlePage
        let filePath = '/f/archimate/AlgoritmedFHIR-202104.archimate.xml'
        // let filePath = '/f/archimate/regulations-data-model.archimate.xml'
        $http.get(filePath)
            .then((response) => {
                const xmlDoc = parser.parseFromString(response.data, "text/xml")
                ctrl.xmlDoc = xmlDoc
                console.log(xmlDoc.firstChild.getAttribute('name'), xmlDoc.firstChild)
                conf.firstListIds = []
                angular.forEach(xmlDoc.firstChild.children, (x) => initPageMap(x))
                let vf = conf.firstListIds.splice(conf.firstListIds.length - 1, 1)
                conf.firstListIds.splice(0, 0, vf)
                console.log(conf.firstListIds)
                console.log(singlePage.Url())
                console.log(singlePage.LastUrlId())
            })
    }
}
app.controller("InitPageController", InitPageController)

