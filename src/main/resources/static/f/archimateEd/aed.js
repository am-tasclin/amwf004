'use strict';
var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize']);
angular.element(() => angular.bootstrap(document, ['app']))
const parser = new DOMParser()
const conf = {}
conf.openedFolderList = []

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
    }
}
app.factory("am2f", ArchiMateFileFactory)

// app.controller("FirstController", FirstController)
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
                angular.forEach(xmlDoc.firstChild.children, (x) => {
                    // console.log(x.localName, x.getAttribute('name'), x)
                    console.log(x.localName, x.getAttribute('name'))
                })
            })
    }
}
app.controller("FirstController", FirstController)
