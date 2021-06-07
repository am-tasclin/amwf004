'use strict';
const singlePage = {}, conf = {}, sql_app = {}, calc_fr = {}
var app = angular.module("app", ['ngRoute', 'ngResource', 'ngSanitize', 'ngLocale']);
angular.element(() => angular.bootstrap(document, ['app']))
conf.form = {}
conf.form.hourMap = {}
conf.form.startHour = 8
conf.form.hoursOfDay = Array.from(Array(24).keys()).map(n =>
    n + conf.form.startHour - (n + conf.form.startHour > 24 ? 24 : 0))
conf.form.dayForBlank = 10
conf.form.dayBlank = Array.from(Array(conf.form.dayForBlank).keys()).map(n => n).reverse()
conf.fr = {}
conf.fr.cp = {
    frn: 'CarePlan',
}
conf.fr.gl = {
    frn: 'Goal',
    amRsRowHtml: "{{r.g_text}} {{r.code}} {{r.comparator}} {{r.valuequantity_f}}",
    sql_app_children001: {
        gl7tt: { id_name: 'measure_id' }
    },
}
/**
 * FHIR MedicationRequest calc
 */
calc_fr.mr = {}
calc_fr.mr.period = (i) => {
    let startTS = Date.now()
    let mr = conf.fr.cp.docbody.children.mr[i]
    let mal = 24 / mr.period
    // console.log(calc_fr.$filter('date')(startTS, 'short'), mr.period, mr.periodunit, 1)
    return Array.from(Array(mal).keys()).map((n) => startTS + n * 3600 * 1000 * mr.period)
}

conf.fr.mr = {
    frn: 'MedicationRequest',
    amRsRowHtml: '<span>{{r.substance_code}} {{r.n_quantity_value}}</span> \n\
    <span>{{r.quantity_value}} {{r.quantity_code}}</span> \n\
    <span data-ng-if="r.timing_id">кожні {{r.period}} {{r.periodunit}}</span> \n\
    <span class="w3-tiny" data-ng-if="!r.medication_id">id={{r.medicationrequest_id}}</span> {{r.duration_s}} {{r.unit}}',
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
                    v => innerHtml = innerHtml ? innerHtml[v] : confEl[v])
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
    constructor($http, p2f, dataBeFactory, $filter) {
        this.conf = conf
        p2f.hi()
        dataBeFactory.docbodyjson.get({ doc_id: 372844 }).$promise.then((data) => {
            conf.fr.cp.docbody = data
            console.log('conf.fr.cp.docbody', conf.fr.cp.docbody)
            angular.forEach(conf.fr.cp.docbody.children.mr, (mr, k) => {
                let calc_period = calc_fr.mr.period(k)
                mr.calc_period = calc_period
                let hourMap = mr.calc_period.map(ts => $filter('date')(ts, 'H'))
                angular.forEach(hourMap, h => {
                    if (!conf.form.hourMap[h])
                        conf.form.hourMap[h] = []
                    conf.form.hourMap[h].push(mr)
                })
                console.log(conf.form.hourMap, 2)
            })
        })
    }
}
app.controller("InitPageController", InitPageController)
