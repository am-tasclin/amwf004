'use strict'

class RWDataFactory2 extends RWDataFactory {
    constructor($http, $q) {
        super($http, $q)
    }

    readSqlTable = (sql, ctrl) => {
        this.httpGetSql({ sql: sql }
        ).then(responceData => {
            console.log(responceData)
            ctrl.sqlTableData = responceData.list
        })
    }

}

sql_app.SelectADN = {
    name: 'Зчитати абстрактий вузел',
    sql: 'SELECT d.*, s.value value1_22 FROM tese.doc d \n\
    LEFT JOIN string s ON s.string_id=doc_id',
    rowId: 'doc_id',
}

class InitPageController extends AbstractController {
    constructor(dataFactory) {
        super(); this.dataFactory = dataFactory
        this.readSqlTable()
    }

    readSqlTable = () => {
        if (singlePage.UrlMap()['sql']) {
            let sql = sql_app[singlePage.UrlMap()['sql']].sql
            this.dataFactory.readSqlTable(sql, this)
        }
    }

    isSelectedRow = r => this.selectedRowId
        && this.selectedRowId == r[this.getSql(singlePage.UrlMap()['sql']).rowId]

}

angular.forEach([
    'sql_:sql',
    'sql_:sql/:key/=/:val',
    'sql_:sql/upd', 'sql_:sql/ins',
], v => singlePage[v] = {
    // templateUrl: '/f/tese/01/sqlTable.html',
    controller: 'InitPageController',
})

app.factory("dataFactory", RWDataFactory2)
app.controller("InitPageController", InitPageController)
app.config(RouteProviderConfig)