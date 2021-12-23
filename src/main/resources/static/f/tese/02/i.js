'use strict'
app.config(RouteProviderConfig)
singlePage.session = {}

sql_app.SelectADN = {
    name: 'Зчитати абстрактий вузел - TeSe',
    sql: 'SELECT d.*, s.value value_22 FROM tese.doc d \n\
    LEFT JOIN string s ON s.string_id=doc_id',
    rowId: 'doc_id',
}
sql_app.SelectADNx = {
    name: 'Зчитати абстрактий вузел - test',
    sql: 'SELECT d.*, s.value value_22 FROM doc d \n\
    LEFT JOIN string s ON s.string_id=doc_id',
    rowId: 'doc_id',
}

class InitPageController extends AbstractController {
    constructor(dataFactory) {
        super(); this.dataFactory = dataFactory
        this.date = new Date()
    }

    sqlNames = () => Object.keys(sql_app)

    isSelectedRow = r => singlePage.session.selectedRowId
        && singlePage.session.selectedRowId == r[this.getSql(singlePage.UrlMap()['sql']).rowId]

}
app.controller('InitPageController', InitPageController)

const routeController = controllerClass => {
    const controllerName = controllerClass.toString().split(' ')[1]
    app.controller(controllerName, controllerClass)
    return { templateUrl: 'x.html', controller: controllerName, }
}

class InitTreeAbstractController extends InitPageController {
    constructor(dataFactory) {
        super(dataFactory)
        if (!singlePage.session.tree) singlePage.session.tree = { l: {}, r: {} }
    }

    selectADN = (adnId, lr) => singlePage.session.tree[lr].selectedId = adnId

    isSelectADN = (adnId, lr) => singlePage.session.tree[lr].selectedId &&
        singlePage.session.tree[lr].selectedId == adnId

}

class InitChildrenController extends InitTreeAbstractController {
    constructor(dataFactory) {
        super(dataFactory)
        if (!singlePage.session.tree.l.id)
            singlePage.session.tree.l.id = singlePage.UrlMap()['children']
        console.log(123, singlePage.session, singlePage.UrlMap()['children'])

        this.dataFactory.getReadADN_children(singlePage.UrlMap()['children'])
    }
}
angular.forEach(['children_:lId',]
    , v => singlePage[v] = routeController(InitChildrenController))

class InitTreeController extends InitTreeAbstractController {
    constructor(dataFactory) {
        super(dataFactory)
        if (singlePage.UrlMap()['tree'] == 'tree'
            && !singlePage.session.tree.l.id
        ) singlePage.session.tree.l.id = 45

        console.log(123, singlePage.UrlMap()['tree']
            , singlePage.session.tree)

        this.dataFactory.getReadADN(singlePage.session.tree.l.id)

    }
}
angular.forEach(['tree', 'tree_:lId', 'tree_:lId,:rId',]
    , v => singlePage[v] = routeController(InitTreeController))

class InitSqlTableController extends InitPageController {
    constructor(dataFactory) {
        super(dataFactory)
        this.readSqlTable()
    }

    readSqlTable = () => {
        console.log(123, singlePage.UrlMap()['sql'])

        if (singlePage.UrlMap()['sql']
            && singlePage.session.sql != singlePage.UrlMap()['sql']
        ) {
            console.log(singlePage, conf)
            singlePage.session.sql = singlePage.UrlMap()['sql']
            if (sql_app[singlePage.UrlMap()['sql']]) {
                let sql = sql_app[singlePage.UrlMap()['sql']].sql
                this.dataFactory.readSqlTable(sql)
            }
        }
    }

}
angular.forEach(['sql_:sql', 'sql_:sql/:key1=:val1',]
    , v => singlePage[v] = routeController(InitSqlTableController))

class RWADNDataFactory extends RWDataFactory {
    constructor($http, $q) { super($http, $q) }

    // readSql = (sql, fn) => this.httpGetSql({ sql: sql }).then(rD => { fn(rD) })
    readSql = (sql, fn) => this.httpGetSql({ sql: sql }).then(fn)
    readSqlTable = sql => this.readSql(sql
        , responceData => conf.sqlTableData = responceData.list)

    //ADN - Abstract Data Node
    getReadADN = docId => {
        let deferred = this.$q.defer()
        conf.eMap[docId] ? deferred.resolve(conf.eMap[docId]) : this.readSql(
            sql_app.SelectADN.sql + ' WHERE doc_id = ' + docId,
            responceADN_Data => deferred.resolve(add_eMap(responceADN_Data.list[0]))
        )
        return deferred.promise
    }

    getReadADN_children = docId => this.getReadADN(docId).then(() => this.readSql(
        sql_app.SelectADN.sql + ' WHERE parent = ' + docId
        , responceChildren => angular.forEach(responceChildren.list
            , child => addParentChild(add_eMap(child)))))

}
app.factory('dataFactory', RWADNDataFactory)


