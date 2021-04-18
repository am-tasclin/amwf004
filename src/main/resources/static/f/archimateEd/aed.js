'use strict';
var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize']);
angular.element(() => angular.bootstrap(document, ['app']))
const parser = new DOMParser()
const conf = {}
conf.openedFolderList = []
conf.elMap = {}

//app.factory("am2f", ArchiMateFileFactory)
class ArchiMateFileFactory {
    constructor() { }
    clickAmItem = (x) => {
        if (conf.openedFolderList.includes(x.id)) {
            conf.openedFolderList.splice(conf.openedFolderList.indexOf(x.id), 1)
            console.log(conf.openedFolderList.indexOf(x.id), 22)
        } else {
            conf.openedFolderList.push(x.id)
        }
        console.log(1, x.id)
        conf.currentX = x
    }
}
app.factory("am2f", ArchiMateFileFactory)

// app.controller("FirstController", FirstController)
const initFirstElMap = (x) => {
    conf.firstListIds.push(x.id)
    conf.elMap[x.id] = x
    initDeepElMap(x)
}
const initDeepElMap = (x) => {
    if (x.children) angular.forEach(x.children, (x) => {
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
            })
    }
}
app.controller("FirstController", FirstController)
