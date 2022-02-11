'use strict';
app.directive('amSqlHtml', AmSqlHtml)
app.factory("dataFactory", RWDataFactory)

// sql_app.group.gp_002.add()
sql_app.group.gp_EmrAutoSql01.add()
sql_app.group.gp_PWS01.add()
sql_app.group.gp_ADN02.add()

conf.sql_app = { tableList: [] }
// conf.sql_app.tableList = ['SpContragents', 'SpKassOp', 'SpValut',]
angular.forEach(sql_app, (sqlObj, k) => sqlObj.sql && conf.sql_app.tableList.push(k))

// app.controller("SqlController", SqlController)
class SqlController2 extends SqlAbstractController {
    constructor(dataFactory, $routeParams) {
        super(dataFactory)
        if (conf.sqlKeyName != $routeParams.sql)
            delete this.data
        conf.sqlKeyName = $routeParams.sql
        console.log(conf.sqlKeyName)
        // console.log(this)
        if (singlePage.Url().includes('ins')) this.initIns()

        this.readSql()

    }

    isSelectedRow = r => this.selectedRowId
        && this.selectedRowId == r[this.getSql(singlePage.UrlMap()['sql']).rowId]

    initIns = () => {
        sql_app.insObj = sql_app[conf.sqlKeyName].ins
        if (!sql_app.insObj.vars) {
            sql_app.insObj.vars = {}
            let vars = sql_app.insObj.sql.split(':var.')
            angular.forEach(vars, (v, k) => {
                if (k > 0)
                    sql_app.insObj.vars[v.split(' ')[0]] = {}
            })
        }
    }

    readSql = () => {
        console.log(conf.sqlKeyName, this.data)
        if (!this.data) {
            conf.sql = readSql2R(conf.sqlKeyName)
            // console.log(conf.sql)
            // if (singlePage.UrlList()[1].includes('sql_'))
            if (singlePage.UrlList()[3] == '=')
                conf.sql = 'SELECT * FROM (' + conf.sql + ') x \n\
 WHERE ' + singlePage.UrlList()[2] + '=' + singlePage.UrlList()[4]
            console.log(conf.sqlKeyName, conf.sql.length )

            this.dataFactory.httpGetSql({ sql: conf.sql }
            ).then(responceData => {
                conf.data = this.data = responceData
                console.log(this.data)
            })
        }
    }

}; app.controller("SqlController2", SqlController2)

angular.forEach([
    'sql_:sql',
    'sql_:sql/:key/=/:val',
    'sql_:sql/upd', 'sql_:sql/ins',
], v => singlePage[v] = {
    templateUrl: '/f/tese/01/sqlTable.html',
    controller: 'SqlController2',
})
app.config(RouteProviderConfig)

class InitPageController extends AbstractController {

    constructor($routeParams, dataFactory) {
        super()
        this.dataFactory = dataFactory
        // console.log(22, $routeParams, this.dataFactory, this)
    }

    keyDownEsc = () => { if (conf.modalDisplay.display == 'block') conf.modalDisplay.display = null }

    insert = () => {
        let sql = sql_app.insObj.sql
        angular.forEach(sql_app.insObj.vars,
            (v, key) => sql = sql.replace(':var.' + key, "'" + v.val + "'"))
        sql += ';\n\ ' + sql_app[conf.sqlKeyName].sql
        this.dataFactory.httpPostSql({ sql: sql }
        ).then(responceData => conf.data.list = responceData.list1)
    }

    sqlConfig = '/f/kassa2r/config.sql.js'

}

console.log(InitPageController.sqlConfig)

app.controller("InitPageController", InitPageController)
