'use strict'
app.config(RouteProviderConfig)
singlePage.session = {}

sql_app.SelectADN = {
    name: 'Зчитати абстрактий вузел - TeSe',
    sql: 'SELECT d.*, s.value value1_22 FROM tese.doc d \n\
    LEFT JOIN string s ON s.string_id=doc_id',
    rowId: 'doc_id',
}
sql_app.SelectADNx = {
    name: 'Зчитати абстрактий вузел - test',
    sql: 'SELECT d.*, s.value value1_22 FROM doc d \n\
    LEFT JOIN string s ON s.string_id=doc_id',
    rowId: 'doc_id',
}

class InitPageController extends AbstractController {
    constructor(dataFactory) {
        super(); this.dataFactory = dataFactory
        this.date = new Date()
    }

    sqlNames = () => Object.keys(sql_app)

    isSelectedRow = r => this.selectedRowId
        && this.selectedRowId == r[this.getSql(singlePage.UrlMap()['sql']).rowId]

}
app.controller('InitPageController', InitPageController)

let routeController = controllerClass => {
    let controllerName = controllerClass.toString().split(' ')[1]
    app.controller(controllerName, controllerClass)
    return { templateUrl: 'x.html', controller: controllerName, }
}

class InitChildController extends InitPageController {
    constructor(dataFactory) {
        super(dataFactory)
        console.log(123)
    }
}
angular.forEach(['children_:lId',]
    , v => singlePage[v] = routeController(InitChildController))

class InitTreeController extends InitPageController {
    constructor(dataFactory) {
        super(dataFactory)
        if (!singlePage.session.tree) singlePage.session.tree = {}
        if (singlePage.UrlMap()['tree'] == 'tree'
        && !singlePage.session.tree.lId
        ) singlePage.session.tree.lId = 45
        console.log(123, singlePage.UrlMap()['tree'], singlePage.session.tree)
        
        this.dataFactory.readADN(singlePage.session.tree.lId)
        
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

class RWDataFactory2 extends RWDataFactory {
    constructor($http, $q) { super($http, $q) }

    readSql = (sql, fn) => this.httpGetSql({ sql: sql }).then(fn)

    readSqlTable = sql => this.readSql(sql
        , responceData => conf.sqlTableData = responceData.list)

    readADN = docId => {
        let sql = sql_app.SelectADN.sql
        sql += ' WHERE doc_id= ' + docId
        console.log(sql, docId)

        this.readSql(sql
            , responceData => angular.forEach(responceData.list
                , v => add_eMap(v)))
    }

}
app.factory('dataFactory', RWDataFactory2)


