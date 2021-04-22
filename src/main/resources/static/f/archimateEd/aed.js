'use strict';
var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize']);
angular.element(() => angular.bootstrap(document, ['app']))
const parser = new DOMParser()
const singlePage = {}, conf = {}, sql_app = {}
conf.openedFolderList = []
conf.elMap = {}

// app.controller("FirstController", FirstController)
const initFirstElMap = (x) => {
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
class FirstController {
    am2f
    constructor($http, am2f) {
        this.am2f = am2f
        this.conf = conf
        const ctrl = this
        ctrl.singlePage = singlePage
        $http.get('/f/archimate/regulations-data-model.archimate.xml')
            .then((response) => {
                const xmlDoc = parser.parseFromString(response.data, "text/xml")
                ctrl.xmlDoc = xmlDoc
                console.log(xmlDoc.firstChild.getAttribute('name'), xmlDoc.firstChild)
                conf.firstListIds = []
                angular.forEach(xmlDoc.firstChild.children, (x) => initFirstElMap(x))
                let vf = conf.firstListIds.splice(conf.firstListIds.length - 1, 1)
                conf.firstListIds.splice(0, 0, vf)
                console.log(conf.firstListIds)
                console.log(singlePage.Url())
                console.log(singlePage.LastUrlId())
            })
    }
}
app.controller("FirstController", FirstController)

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

// app.config(ElementArchiMateController)
const forEachParent = (el, f) => {
    if (el.parentElement) {
        f(el.parentElement)
        forEachParent(el.parentElement, f)
    }
}
class ElementArchiMateController {
    constructor(am2f) {
        conf.currentX = conf.elMap[singlePage.LastUrlId()]
        forEachParent(conf.currentX, (x) => conf.openedFolderList.push(x.id))
    }
}
app.controller('ElementArchiMateController', ElementArchiMateController)

// app.config(RouteProviderConfig)
class RouteProviderConfig {
    constructor($routeProvider) {
        console.log(11)
        $routeProvider
            .when("/banana", {
                template: "<h1>Banana</h1><p>Bananas contain around 75% water.</p>"
            })
            .when("/tomato", {
                template: "<h1>Tomato</h1><p>Tomatoes contain around 95% water.</p>"
            })
            .when("/el_:el_id", {
                templateUrl: "ElementArchiMate.html",
                controller: 'ElementArchiMateController',
            })
            .when("/v_:el_id", {
                templateUrl: "ElementArchiMate.html",
                controller: 'ElementArchiMateController',
            })
            .when("/", {
                templateUrl: "ElementArchiMate.html",
                controller: 'ElementArchiMateController',
            })
            .otherwise({
                template: "<h1>?</h1><p>Щось невідоме</p>"
            })
    }
}
app.config(RouteProviderConfig)

// lib singlePage
singlePage.Url = () => window.location.href.split('#!')[1]

singlePage.LastUrl = () => singlePage.Url() ? singlePage.Url().split('/')[singlePage.Url().split('/').length - 1] : ''
singlePage.LastUrlTag = () => singlePage.LastUrl().split('_')[0]
singlePage.LastUrlId = () => singlePage.LastUrl().split('_')[1]
