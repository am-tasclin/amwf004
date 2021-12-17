'use strict';

app.factory("dataFactory", RWDataFactory)

conf.sql_app = {}
conf.sql_app.tableList = ['SpContragents', 'SpKassOp', 'SpValut',]

conf.sql_app.tableList = []
angular.forEach(sql_app, (sqlObj,k) => {
    if(sqlObj.sql){
        conf.sql_app.tableList.push(k)
    }
})

// app.controller("SqlController", SqlController)
class SqlController2 extends SqlAbstractController {
    constructor(dataFactory, $routeParams) {
        super(dataFactory)
        if (conf.sqlKeyName != $routeParams.sql)
            delete this.data
        conf.sqlKeyName = $routeParams.sql
        console.log(conf.sqlKeyName)
        if (singlePage.Url().includes('ins')) this.initIns()

        this.readSql()
    }

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
        if (!this.data) {
            conf.sql = readSql2R(conf.sqlKeyName)
            console.log(conf.sqlKeyName, conf.sql)
            this.dataFactory.httpGetSql({ sql: conf.sql }
            ).then(responceData => {
                this.data = responceData
                conf.data = this.data
                console.log(this.data)
            })
        }
    }

}
app.controller("SqlController2", SqlController2)

angular.forEach([
    'sql_:sql',
    'sql_:sql/upd',
    'sql_:sql/ins',
    'sql_:sql/:key/=/:val',
]
    , v => singlePage[v] = {
        templateUrl: '/f/tese/01/sqlTable.html',
        controller: 'SqlController2',
    }
)
app.config(RouteProviderConfig)

class InitPageController extends AbstractController {

    constructor($routeParams, dataFactory) {
        super()
        this.dataFactory = dataFactory
        console.log(22, $routeParams, this.dataFactory, this)
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
