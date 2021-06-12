'use strict';
const singlePage = {}, conf = {}, sql_app = {}
// conf.filePath = 'http://algoritmed.com/archi003/f/AlgoritmedFHIR-202104.archimate.xml'
// let filePath = '/f/archimate/regulations-data-model.archimate.xml'
// lib singlePage
var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize']);
angular.element(() => angular.bootstrap(document, ['app']))
const parser = new DOMParser()
conf.filePath = '/f/archimate/AlgoritmedFHIR-202104.archimate.xml'
conf.openedFolderList = []
conf.elMap = {}

conf.clickSvg = (x) => {
    conf.clickEl = { id: x.id, views: [] }
    conf.clickEl.aElId = conf.elMap[conf.clickEl.id].getAttribute('archimateElement')
    angular.forEach(conf.elMap, y => {
        if (y.getAttribute('archimateElement') == conf.clickEl.aElId) {
            conf.clickEl.views.push(y.parentElement.id)
        }
    })
    console.log(conf.clickEl.views)
}

//app.factory("am2f", ArchiMateFileFactory)
class ArchiMateFileFactory {
    constructor() { }
    setEditWiki = (x) => {
        if(conf.editWikiId==x.id){
            delete conf.editWikiId
            delete conf.editWikiText
            return
        } 
        conf.editWikiId = x.id
        conf.editWikiText = x.firstElementChild.innerHTML
        console.log(1, x, x.firstElementChild)
        let x2 = conf.xmlDoc.getElementById(conf.editWikiId)
        console.log(x2)
    }
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
    // fLambda(el)
    if (el.parentElement) {
        fLambda(el.parentElement)
        forEachParent(el.parentElement, fLambda)
    }
}
class InitArchiMateElementController {
    constructor(am2f) {
        conf.currentX = conf.elMap[singlePage.LastUrlId()]
        console.log(singlePage.LastUrlId(), conf.currentX, conf.clickEl)
        if (conf.currentX) {
            forEachParent(conf.currentX, (x) => conf.openedFolderList.push(x.id))
            conf.currentX.yMax = 0
            angular.forEach(conf.currentX.childNodes, (x) => {
                if (x && x.localName == 'child')
                    conf.currentX.yMax = Math.max(conf.currentX.yMax,
                        1 * x.firstElementChild.getAttribute('y')
                        + 1 * x.firstElementChild.getAttribute('height'))
            })
        }
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
const initPageMap = x => {
    conf.firstListIds.push(x.id)
    initDeepElMap(conf.elMap[x.id] = x)
}
const initDeepElMap = x =>
    angular.forEach(x.children, x => x.id ? initDeepElMap(conf.elMap[x.id] = x) : null)

class InitPageController {
    am2f
    constructor($http, am2f) {
        this.am2f = am2f
        this.conf = conf
        const ctrl = this
        ctrl.singlePage = singlePage
        ctrl.markdownInLine = markdownInLine
        $http.get(conf.filePath).then((response) => {
            const xmlDoc = parser.parseFromString(response.data, "text/xml")
            conf.xmlDoc = ctrl.xmlDoc = xmlDoc
            console.log(xmlDoc.firstChild.getAttribute('name'))
            conf.firstListIds = []
            angular.forEach(xmlDoc.firstChild.children, x => initPageMap(x))
            conf.firstListIds = conf.firstListIds.filter(n => n.length>1)
            let vf = conf.firstListIds.splice(conf.firstListIds.length - 1, 1)
            conf.firstListIds.splice(0, 0, vf)
            console.log(singlePage.Url())
            console.log(singlePage.LastUrlId())
        })
    }
}
app.controller("InitPageController", InitPageController)

singlePage.Url = () => window.location.href.split('#!')[1]

singlePage.LastUrl = () => singlePage.Url() ? singlePage.Url().split('/')[singlePage.Url().split('/').length - 1] : ''
singlePage.LastUrlTag = () => singlePage.LastUrl().split('_')[0]
singlePage.LastUrlId = () => singlePage.LastUrl().split('_')[1]

var markdownInLine = function (text) {
    if (!text) return
    var t2 = ('' + text)
    var bold = /\u002A\u002A([\wа-яА-Яі\-]+[\s+[\wа-яА-Яі\-]*]*)\u002A\u002A/gmi;
    //		var bold	= /\u002A\u002A([\wа-яА-Яі\-]+\s*[\wа-яА-Яі\-]*)\u002A\u002A/gmi;
    var t2 = t2.replace(bold, '<strong>$1</strong>');
    //		var bold = "\u002A\u002A([\wа-яА-Яі\-]+\s*[\wа-яА-Яі\-]*)\u002A\u002A";
    //		var t2 = (''+text).replace(new RegExp(bold, 'gi'), '<strong>$1</strong>');
    var link = /\[([^`]{1,40})\]\(([^`)]*)\)/gmi
    //			var link	= /\[([^`]*)\]\(([^`)]*)\)/gmi
    var t2 = t2.replace(link, '<a href="$2">$1</a>');
    return t2
}
