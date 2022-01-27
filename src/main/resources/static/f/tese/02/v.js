const page = {}
page.head = { title: 'DDCC:VS' }
page.H1 = [
    'Ланцюжок поставки',
    'Рекомендації з вакцинації (протокол)',
    'Словники даних',
    'FHIR структури',
]
page.fhir = { structureIds: [359249], structureEl: {}, }

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
        const to = 255
        $timeout(() => {
            this.buildFhirStructure(page.fhir.structureIds[0])
        }, to)
        console.log(this)
    }

    jsonToString = o => JSON.stringify(o, ' ', 2)

    buildFhirStructure = docId => {
        let e = this.conf.eMap[docId]
        console.log(docId, e)
        let bE = { fhirStructureName: e.value_22 }
        let rootEl = page.fhir.structureEl[e.value_22] = bE[e.value_22] = {}
        console.log(conf.parentChild[docId])
        angular.forEach(conf.parentChild[docId], id => {
            let e = conf.eMap[id]
            let k = e.value_22; k = k ? k : e.r_value_22
            rootEl[k] = ['BackboneElement'].includes(e.r_value_22) ? {} : 'String'
            console.log(id, k, e, ['BackboneElement'].includes(e.r_value_22))
        })
        console.log(bE)
    }
    readADNDeep = docId => this.dataFactory.readADNDeep({ id: docId, deep: 7 })

}; app.controller('InitPageController', InitPageController)