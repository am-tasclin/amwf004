'use strict'
app.config(RouteProviderConfig)
singlePage.session = { tree: { l: {}, r: {} } }
singlePage.index_template = 'index_template.html'

sql_app.SelectADN = {
    name: 'Зчитати абстрактий вузел - TeSe',
    sql: 'SELECT d.*, s.value value_22, su.value value_u_22, o.sort \n\
    , srr.value rr_value_22 \n\
    , sr.value r_value_22, dr.doctype r_doctype \n\
    FROM tese.doc d \n\
     LEFT JOIN sort o ON sort_id=d.doc_id \n\
     LEFT JOIN string_u su ON su.string_u_id=d.doc_id \n\
     LEFT JOIN string sr ON sr.string_id=d.reference \n\
     LEFT JOIN doc dr ON dr.doc_id=d.reference \n\
     LEFT JOIN string srr ON srr.string_id=dr.reference \n\
     LEFT JOIN string s ON s.string_id=d.doc_id',
    oderBy: 'sort',
    rowId: 'doc_id',
    whereDocAlias: 'd',
}; sql_app.SelectADNi18n = {
    name: 'TeSe абстрактий вузел з перекладом',
    sql: 'SELECT d.*, i18n FROM (:sql_app.SelectADN ) d \n\
    LEFT JOIN (SELECT reference r1, value i18n FROM (SELECT d.* FROM doc d, doc p \n\
        WHERE d.parent=p.doc_id AND p.reference=285596 ) x \n\
    LEFT JOIN string ON string_id=doc_id) dv ON d.doc_id=dv.r1',
    oderBy: 'sort',
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

    sqlKeyValue = () => singlePage.session.sqlUrl ?
        singlePage.session.sqlUrl.split(replaceSlash)[2] : null

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

    initRL = () => {
        this.dataFactory.getReadADN(singlePage.session.tree.l.id)
        if (singlePage.session.tree.r.id)
            this.dataFactory.getReadADN(singlePage.session.tree.r.id)
    }

    readSessionSqlTable = () => {
        console.log(singlePage.session.sql)
        if (singlePage.session.sql) {
            const sql = this.dataFactory.buildSqlWithKeyValue(singlePage.session.sql
                , singlePage.session.sqlKey, singlePage.session.sqlValue)
            console.log(sql)
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
        console.log(iS)
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
        console.log( singlePage.UrlMap()['children'])
        // console.log(singlePage.session)

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
                singlePage.session.sqlValue = sqlWhereKV[1]
            }

            this.readSessionSqlTable()
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

    buildSqlWithKeyValue = (sqlName, key, value) => {
        const whereDocAlias = sql_app[sqlName].whereDocAlias ?
            (sql_app[sqlName].whereDocAlias + '.') : ''
        let sql = readSql2R(sqlName)
        if (key && value)
            sql += ' WHERE ' + whereDocAlias + key + ' = ' + value
        if (sql_app[sqlName].oderBy) sql += ' ORDER BY ' + sql_app[sqlName].oderBy
        return sql
    }

    //ADN - Abstract Data Node
    getReadADN = docId => {
        let deferred = this.$q.defer()
        conf.eMap[docId] ? deferred.resolve(conf.eMap[docId]) : this.readSql(
            this.buildSqlWithKeyValue('SelectADN', 'doc_id', docId)
            , responceADN_Data => deferred.resolve(add_eMap(responceADN_Data.list[0]))
        )
        return deferred.promise
    }

    getReadADN_children = docId => this.getReadADN(docId).then(() => this.readSql(
        this.buildSqlWithKeyValue('SelectADN', 'parent', docId)
        , responceChildren => angular.forEach(responceChildren.list
            , child => addParentChild(add_eMap(child)))))

}; app.factory('dataFactory', RWADNDataFactory)
