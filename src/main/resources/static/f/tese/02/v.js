'use strict'
sql_app.group.gp_ADN01.add()
const page = {}
page.head = { title: 'DDCC:VS' }
page.H1 = [
    'Ланцюжок поставки',
    'Рекомендації з вакцинації (протокол)',
    'Словники даних',
    'FHIR структури',
]
page.fhir = { structureIds: [359249, 368788, 372925, 368833], structureEl: {}, }

singlePage.session = {
    tree: {
        H1: {
            3: {
                l: {}, r: {
                    id: [359249],
                    openIds: [359249, 372042, 372043],
                }
            }
        }
    }
}

// for data-ng-include="'treeADN.html'"
singlePage.session.tree.H1_3_r_id_0 = singlePage.session.tree.H1[3].r

class RWADNDataFactory extends RWADN01DataFactory {
    constructor($http, $q, $timeout) { super($http, $q) }
    readADNDeep = (a, inSql) => {
        a.i ? a.i++ : a.i = 1
        inSql = !inSql ? 'SELECT doc_id FROM doc WHERE doc_id=' + a.id
            : 'SELECT doc_id FROM doc WHERE parent IN (' + inSql + ')'

        // console.log(a, inSql)
        if (a.i < a.deep && a.i < 10) {
            const sqlObj = sql_app['SelectADN']
            let sql = sqlObj.sql
            sql += ' WHERE d.doc_id IN (' + inSql + ') '
            if (sqlObj.oderBy) sql += ' ORDER BY ' + sqlObj.oderBy
            // if (a.i == 1) console.log(sql)
            this.readSql(sql, r => {
                // console.log(r.list, a, r.list.length)
                angular.forEach(r.list, row => {
                    let x = addParentChild(add_eMap(row))
                })
                // if (r.list.length > 0) this.readADNDeep(a, inSql)
            })
            this.readADNDeep(a, inSql)
        }
    }
}; app.factory('dataFactory', RWADNDataFactory)

class InitPageController extends AbstractController {
    page = page
    constructor(dataFactory, $timeout) {
        super(); this.dataFactory = dataFactory; this.$timeout = $timeout
        this.date = new Date()
        angular.forEach(page.fhir.structureIds, docId => this.readADNDeep(docId))
        let to = 350 //ms
        $timeout(() => buildFhir.structure(page.fhir.structureIds[0]), to)
        $timeout(() => buildFhir.structure(page.fhir.structureIds[1]), to * 2)
        $timeout(() => buildFhir.structure(page.fhir.structureIds[2]), to * 2)
        $timeout(() => buildFhir.structure(page.fhir.structureIds[3]), to * 4)
    }

    jsonToString = o => JSON.stringify(o, ' ', 2)

    readADNDeep = docId => this.dataFactory.readADNDeep({ id: docId, deep: 7 })

}; app.controller('InitPageController', InitPageController)

const buildFhir = {}
buildFhir.structure = docId => {
    let e = conf.eMap[docId]
    console.log(docId, e)
    console.log(conf.parentChild[docId])
    let bE = { fhirStructureName: e.value_22 }
    let parentEl = page.fhir.structureEl[e.value_22] = bE[e.value_22] = {}
    buildFhir.children(docId, parentEl)
}

buildFhir.children = (docId, parentEl) => angular.forEach(conf.parentChild[docId], id => {
    let e = conf.eMap[id]
    let k = e.value_22; k = k ? k : e.r_value_22
    let isChildObj = ['BackboneElement'].includes(e.r_value_22)
    let childObj = parentEl[k] = isChildObj ? {} : 'String'

    let isChildList = [37].includes(e.doctype || e.r_doctype) || (e.value_22 && e.value_22.includes('[x]'))
    parentEl[k] = isChildList ? [{}] : parentEl[k]
    childObj = isChildList ? parentEl[k][0] : childObj
    if (373674 == id)
        console.log(id, k, isChildObj, childObj, e)

    if (isChildObj || isChildList) buildFhir.children(id, childObj)
})
