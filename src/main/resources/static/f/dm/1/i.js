'use strict'
app.config(RouteProviderConfig)
singlePage.session = { tree: { l: { id: [45] }, r: { id: [45] } } }
singlePage.index_template = 'index_template.html'

class InitPageController extends AbstractController {
    constructor(dataFactory) {
        super(); this.dataFactory = dataFactory
        this.date = new Date()
    }

    sqlNames = () => Object.keys(sql_app)
    delSqlKeyValue = () => {
        delete singlePage.session.sqlKey
        delete singlePage.session.sqlValue
    }
    isSelectedRow = r => singlePage.session.selectedRowId
        && (singlePage.session.selectedRowId == r[this.getSql(singlePage.session.sql).rowId]
            || singlePage.session.selectedRowId == r.doc_id
        )

    selectADN = (adnId, lr) => {
        singlePage.session.tree[lr].selectedId = adnId
        if (!singlePage.session.tree[lr].openIds)
            singlePage.session.tree[lr].openIds = []
        if (singlePage.session.tree[lr].openIds.includes(adnId))
            singlePage.session.tree[lr].openIds
                .splice(singlePage.session.tree[lr].openIds.indexOf(adnId), 1)
        else
            singlePage.session.tree[lr].openIds.push(adnId)
    }

    isSelectADN = (adnId, lr) => singlePage.session.tree[lr].selectedId &&
        singlePage.session.tree[lr].selectedId == adnId

    hasADNClosedChild = (adnId, lr) => singlePage.session.tree[lr]
        .openIds && !singlePage.session.tree[lr].openIds
            .includes(adnId) && conf.parentChild[adnId] && conf
                .parentChild[adnId].length > 0

    initSession = () => JSON.stringify(singlePage.session)

    initRL = () => angular.forEach(['l', 'r']
        , lr => angular.forEach(singlePage.session.tree[lr].id
            , id => this.dataFactory.getReadADN(id)))

    readSessionSqlTable = () => {
        console.log(singlePage.session.sql, sql_app[singlePage.session.sql])
        if (singlePage.session.sql) {
            const sql = buildSqlWithKeyValue(singlePage.session.sql
                , singlePage.session.sqlKey, singlePage.session.sqlValue)
            this.dataFactory.readSqlTable(sql)
        }
    }
    
    exeSql = () => {
        console.log(123)
        this.dataFactory.readSqlTable(this.rowSql)
        console.log(123)
    }
    
    createTabSql = () => {
        console.log(123)
    }

    createRowSql = () => {
        console.log('-> click autoSql \n----\n', sql_app.autoSql.sql)
        this.rowSql = sql_app.autoSql.createRowSql({ parent: singlePage.session.tree.l.selectedId })
    }

}; app.controller('InitPageController', InitPageController)

const routeController = controllerClass => {
    const controllerName = controllerClass.toString().split(' ')[1]
    app.controller(controllerName, controllerClass)
    return { templateUrl: 'mc-sql-design.html', controller: controllerName, }
}

class InitSessionController extends InitPageController {
    constructor(dataFactory) {
        super(dataFactory)
        let iS = JSON.parse(decodeURI(singlePage.UrlMap()['init']))
        console.log(iS)
        singlePage.session = iS
        this.initRL()
        this.readSessionSqlTable()

        let parents = ''
        angular.forEach(['l', 'r'], lr => angular.forEach(singlePage.session
            .tree[lr].openIds, parent => parents += ',' + parent))
        console.log(parents)

        angular.forEach(['l', 'r'], lr => angular.forEach(singlePage.session
            .tree[lr].openIds, parent => this.dataFactory.getReadADN_children(parent)
        ))
    }
}; angular.forEach(['init_:json',]
    , v => singlePage[v] = routeController(InitSessionController))

class InitChildrenController extends InitPageController {
    constructor(dataFactory) {
        super(dataFactory)
        if (!singlePage.session.tree.l.id)
            singlePage.session.tree.l.id = singlePage.UrlMap()['children']
        console.log(singlePage.UrlMap()['children'], singlePage.session.sqlKey)
        // console.log(singlePage.session)
        if (singlePage.session.sqlKey == 'parent') {
            singlePage.session.sqlValue = singlePage.UrlMap()['children'].split('_')[0]
            singlePage.session.sqlLR = singlePage.UrlMap()['children'].split('_')[1]
            console.log(singlePage.session)
            this.readSessionSqlTable()
        }

        console.log(singlePage.UrlMap()['children'].split('_')[0])
        this.dataFactory.getReadADN_children(singlePage.UrlMap()['children'].split('_')[0])

    }
}; angular.forEach(['children_:lId',]
    , v => singlePage[v] = routeController(InitChildrenController))

class InitTreeController extends InitPageController {
    constructor(dataFactory) {
        super(dataFactory)
        angular.forEach(singlePage.UrlMap()['tree'].split(',')
            , (t, tk) => angular.forEach(t.split('_')
                , (v, k) => singlePage.session.tree[!tk ? 'l' : 'r'].id[k] = v))
        if (singlePage.UrlMap()['tree'] == 'tree'
            && isNaN(singlePage.session.tree.l.id)
        ) singlePage.session.tree.l.id = 45

        console.log(123, singlePage.UrlMap()['tree']
            , singlePage.session.tree)

        this.initRL()

    }

}; angular.forEach(['tree', 'tree_:lId', 'tree_:lId,:rId',]
    , v => singlePage[v] = routeController(InitTreeController))

const replaceSlash = ';'

class InitSqlTableController extends InitPageController {
    constructor(dataFactory) { super(dataFactory); this.readSqlTable() }

    readSqlTable = () => {
        if (singlePage.session.sqlUrl != singlePage.Url()) {
            singlePage.session.sqlUrl = singlePage.Url().replace(/\//g, replaceSlash)
            singlePage.session.sql = singlePage.UrlMap()['sql']

            if (singlePage.UrlList()[2]) {
                let sqlWhereKV = singlePage.UrlList()[2].split('=')
                singlePage.session.sqlKey = sqlWhereKV[0]
                singlePage.session.sqlValue = sqlWhereKV[1].split('_')[0]
                singlePage.session.sqlLR = sqlWhereKV[1].split('_')[1]
            }

            this.readSessionSqlTable()
        }
    }

}; angular.forEach(['sql_:sql', 'sql_:sql/:key1=:val1',]
    , v => singlePage[v] = routeController(InitSqlTableController))

class RWADNDataFactory extends RWADN01DataFactory {
    constructor($http, $q) { super($http, $q) }

    // readSql = (sql, fn) => this.httpGetSql({ sql: sql }).then(rD => { fn(rD) })
    // readSql = (sql, fn) => this.httpGetSql({ sql: sql }).then(fn)
    readSqlTable = sql => this.readSql(sql
        , responceData => conf.sqlTableData = responceData.list)


    //ADN - Abstract Data Node
    getReadADN = docId => {
        const deferred = this.$q.defer()
        conf.eMap[docId] ? deferred.resolve(conf.eMap[docId]) : this.readSql(
            buildSqlWithKeyValue('SelectADN', 'doc_id', docId)
            , responceADN_Data => deferred.resolve(add_eMap(responceADN_Data.list[0]))
        )
        return deferred.promise
    }

    getReadADN_children = docId => this.getReadADN(docId).then(() => this.readSql(
        buildSqlWithKeyValue('SelectADN', 'parent', docId)
        , responceChildren => angular.forEach(responceChildren.list
            , child => addParentChild(add_eMap(child)))))

}; app.factory('dataFactory', RWADNDataFactory)


let CarePlan_1 = {
    // fdf
    title: "Доступні Вакцини і способи їх застосування.",
    activity: [

    ]
}
let x = CarePlan_1
// вибірка з https://build.fhir.org/valueset-vaccine-code.html
let ValueSet_1 = {
    system: "http://hl7.org/fhir/sid/cvx",
    compose: {
        include: [{
            concept: [
                {
                    code: "207",
                    display: "SARS-COV-2 (COVID-19) vaccine, mRNA, spike protein, LNP, preservative free, 100 mcg/0.5mL dose"
                }]
        }]
    }
}

conf.doctype_fa = {
    14: 'far fa-folder',
    17: 'far fa-file',
}
