'use strict'
app.config(RouteProviderConfig)
singlePage.session = { tree: { l: {}, r: {} } }
singlePage.index_template = 'index_template.html'

sql_app.SelectADN = {
    name: 'Зчитати абстрактий вузел - TeSe',
    sql: 'SELECT d.*, s.value value_22, su.value value_u_22 \n\
    FROM tese.doc d \n\
     LEFT JOIN sort o ON sort_id=doc_id \n\
     LEFT JOIN string_u su ON su.string_u_id=doc_id \n\
     LEFT JOIN string s ON s.string_id=doc_id',
    oderBy: 'sort',
    rowId: 'doc_id',
}; sql_app.SelectADNx = {
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
        && singlePage.session.selectedRowId == r[this.getSql(singlePage.session.sql).rowId]

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

    initRL = () => {
        this.dataFactory.getReadADN(singlePage.session.tree.l.id)
        if (singlePage.session.tree.r.id)
            this.dataFactory.getReadADN(singlePage.session.tree.r.id)
    }

    readSessionSqlTable = () => {
        if (singlePage.session.sql) {
            let sql = sql_app[singlePage.session.sql].sql
            this.dataFactory.readSqlTable(sql)
        }
    }

}; app.controller('InitPageController', InitPageController)

const routeController = controllerClass => {
    const controllerName = controllerClass.toString().split(' ')[1]
    app.controller(controllerName, controllerClass)
    return { templateUrl: 'x.html', controller: controllerName, }
}

class InitSessionController extends InitPageController {
    constructor(dataFactory) {
        super(dataFactory)
        let iS = JSON.parse(decodeURI(singlePage.UrlMap()['init']))
        singlePage.session = iS
        this.initRL()
        this.readSessionSqlTable()

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
        console.log(123, singlePage.session, singlePage.UrlMap()['children'])

        this.dataFactory.getReadADN_children(singlePage.UrlMap()['children'])

    }
}; angular.forEach(['children_:lId',]
    , v => singlePage[v] = routeController(InitChildrenController))

class InitTreeController extends InitPageController {
    constructor(dataFactory) {
        super(dataFactory)
        singlePage.session.tree.l.id = singlePage.UrlMap()['tree']
        if (singlePage.UrlMap()['tree'].includes(',')) {
            singlePage.session.tree.l.id = singlePage.UrlMap()['tree'].split(',')[0]
            singlePage.session.tree.r.id = singlePage.UrlMap()['tree'].split(',')[1]
        }
        if (singlePage.UrlMap()['tree'] == 'tree'
            && isNaN(singlePage.session.tree.l.id)
        ) singlePage.session.tree.l.id = 45

        console.log(123, singlePage.UrlMap()['tree']
            , singlePage.session.tree)

        this.initRL()

    }

}; angular.forEach(['tree', 'tree_:lId', 'tree_:lId,:rId',]
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

}; angular.forEach(['sql_:sql', 'sql_:sql/:key1=:val1',]
    , v => singlePage[v] = routeController(InitSqlTableController))

class RWADNDataFactory extends RWDataFactory {
    constructor($http, $q) { super($http, $q) }

    // readSql = (sql, fn) => this.httpGetSql({ sql: sql }).then(rD => { fn(rD) })
    readSql = (sql, fn) => this.httpGetSql({ sql: sql }).then(fn)
    readSqlTable = sql => this.readSql(sql
        , responceData => conf.sqlTableData = responceData.list)

    buildKeyValueSql = (sqlName, key, value) => {
        let sql = sql_app[sqlName].sql
        sql += ' WHERE ' + key + ' = ' + value
        if (sql_app[sqlName].oderBy) sql += ' ORDER BY ' + sql_app[sqlName].oderBy
        return sql
    }

    //ADN - Abstract Data Node
    getReadADN = docId => {
        let deferred = this.$q.defer()
        conf.eMap[docId] ? deferred.resolve(conf.eMap[docId]) : this.readSql(
            this.buildKeyValueSql('SelectADN', 'doc_id', docId)
            , responceADN_Data => deferred.resolve(add_eMap(responceADN_Data.list[0]))
        )
        return deferred.promise
    }

    getReadADN_children = docId => this.getReadADN(docId).then(() => this.readSql(
        this.buildKeyValueSql('SelectADN', 'parent', docId)
        , responceChildren => angular.forEach(responceChildren.list
            , child => addParentChild(add_eMap(child)))))

}; app.factory('dataFactory', RWADNDataFactory)
