'use strict';
const singlePage = {}, conf = {}, sql_app = {}
var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize']);
angular.element(() => angular.bootstrap(document, ['app']))
conf.fr = {}
conf.fr.cp = {
    frn: 'CarePlan',
}
conf.fr.gl = {
    frn: 'Goal',
    amRsRowHtml: "{{r.g_text}} {{r.code}} {{r.comparator}} {{r.valuequantity_f}}",
    sql_app_children001: {
        gl7tt: {id_name:'measure_id'}
    },
}

conf.fr.mr = {
    frn: 'MedicationRequest',
    amRsRowHtml: '<span>{{r.substance_code}} {{r.n_quantity_value}}</span> \n\
    <span>{{r.quantity_value}} {{r.quantity_code}}</span> \n\
    <span data-ng-if="r.timing_id">кожні {{r.period}} {{r.periodunit}}</span> \n\
    <span class="w3-tiny" data-ng-if="!r.medication_id">id={{r.medicationrequest_id}}</span>',
}

// app.factory("dataBeFactory", DataDBexchangeService)
class DataDBexchangeService {
    constructor($http, $q, $resource) {
        return {
            docbodyjson: $resource('/r/docbodyjson/:doc_id', { doc_id: '@doc_id' }),
        }
    }
}
app.factory("dataBeFactory", DataDBexchangeService)

app.directive('amRsRow', ($compile) => {
    return {
        restrict: 'A',
        link: (s, e, a) => {
            let tag = a.tag, confEl, innerHtml
            if (!tag) tag = singlePage.LastUrlTag()
            confEl = conf.fr[tag]
            if (a.innerHtml)
                angular.forEach(a.innerHtml.split('.'),
                    (v) => innerHtml = innerHtml ? innerHtml[v] : confEl[v])
            if (a.innerHtmlRaw) innerHtml = a.innerHtmlRaw
            if (!innerHtml)
                if (confEl)
                    innerHtml = confEl.amRsRowHtml
            // console.log(tag, s, e, a, singlePage.LastUrl(), innerHtml)
            if (innerHtml) {
                e.html(innerHtml)
                $compile(e.contents())(s)
            }
        },
    }
})

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
        this.conf = conf
        p2f.hi()
        dataBeFactory.docbodyjson.get({ doc_id: 372844 }).$promise.then((data) => {
            console.log(data)
            conf.fr.cp.docbody = data
        })
    }
}
app.controller("InitPageController", InitPageController)
