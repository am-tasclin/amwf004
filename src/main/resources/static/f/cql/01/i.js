'use strict'
singlePage.index_template = 'spBody.html'
class RWDataFactory extends RWData0Factory {
    constructor($http, $q) { super($http, $q) }
    exeSql = () => {
        delete conf.sqlInsert; delete conf.table02
        let sqlApp = sql_app[conf.sqlAppKey]
        let sql = sqlApp.sql; if (sqlApp.initSql) sql = sqlApp.initSql()
        console.log(conf.sqlAppKey, ':', sql)
        this.readSql(sql, r => {
            console.log(r)
            conf.table01 = r.list
            sqlApp.initDataFromSql && sqlApp.initDataFromSql(r, this)
        })
    }
}; app.factory('dataFactory', RWDataFactory)


session.tree = { 'l': { id: [] }, 'r': { id: [] } }
conf.tree = { eMap: {} }
conf.treeFn = {}
conf.treeFn.url = () => session.tree.l.id.join('_') + ',' + session.tree.r.id.join('_')
conf.treeFn.urlGo = () => window.location.href = '#!/tree_' + conf.treeFn.url()

const lFn = {}
lFn.parent = (ids, id) => ids.includes(conf.tree.eMap[id].parent) && lFn.minus(ids, ids.indexOf(id)) ||
    (ids[ids.indexOf(id)] = conf.tree.eMap[id].parent)
lFn.minus = (ids, p) => ids.splice(p, 1)

class PageLogicFactory extends PageLogic0Factory {
    constructor(dataFactory) {
        super(dataFactory)
        dataFactory.sqlRowLimit = 20
    }
    treeItemDown = (adnId, lr) => lFn.parent(session.tree[lr].id, adnId) && conf.treeFn.urlGo()
    selectADN = (adnId, lr) => addRemoveListItem(
        getSetList(session.tree[lr], 'openIds'), 1 * adnId)
}; app.factory('pageLogic', PageLogicFactory)

class Abstract02Controller extends AbstractController {
    constructor(dataFactory, pageLogic) {
        super(dataFactory)
        this.pl = pageLogic
        urlMap = {}; singlePage.UrlMap()
    }
}

class InitPageController extends Abstract02Controller {
    constructor(dataFactory, pageLogic) { super(dataFactory, pageLogic) }
    saveSqlInsert1 = () => {
        let sql = conf.sqlInsert
        console.log(123, sql)
        this.dataFactory.writeSql(sql, r => {
            console.log(123, r)
        })
    }
    clickRow = row => conf.clickRow = row
    stringifyJSON = jn => JSON.stringify(jn, null, ' ')
}; app.controller('InitPageController', InitPageController)


class ChildrenController extends Abstract02Controller {
    constructor(dataFactory, pageLogic) {
        super(dataFactory, pageLogic)
        let lr = urlMap.children.split('_')[1],
            adnId = 1 * urlMap.children.split('_')[0]
        let sql = buildSqlWithKeyValue('SelectADN', 'parent', adnId)
        !conf.parentChild[adnId] && dataFactory.readSql(sql, r => ar.forEach(r.list, adn => {
            conf.tree.eMap[adn.doc_id] = adn
            addNewListItem(getSetList(conf.parentChild, adnId), adn.doc_id)
        }))
        addRemoveListItem(getSetList(session.tree[lr], 'openIds'), adnId)
    }
}; route01Controller(ChildrenController, ['children_:lId',])

const getSetList = (o, n) => o[n] || (o[n] = [])
const addRemoveListItem = (l, i) => !l.includes(i) ? l.push(i) : l.splice(l.indexOf(i), 1)
const addNewListItem = (l, i) => !l.includes(i) ? l.push(i) : null

class TreeController extends Abstract02Controller {
    constructor(dataFactory, pageLogic) {
        super(dataFactory, pageLogic)
        initSessionTree(urlMap.tree)
        console.log(session)
        ar.forEach(session.tree, (aLR, lr) => ar.forEach(aLR.id, id => {
            if (!conf.tree.eMap[id]) {
                let sql = buildSqlWithKeyValue('SelectADN', 'doc_id', id)
                dataFactory.readSql(sql, r => conf.tree.eMap[id] = r.list[0])
            }
        }))
    }
}; route01Controller(TreeController, ['tree', 'tree_:lId', 'tree_:lId,:rId',])

const initSessionTree = urlTree => {
    ar.forEach(urlTree.split(','), (t, tk) => ar.forEach(t.split('_')
        , (v, k) => session.tree[!tk ? 'l' : 'r'].id[k] = 1 * v))
}

class SqlController extends Abstract02Controller {
    constructor(dataFactory, pageLogic) {
        super(dataFactory, pageLogic)
        conf.sqlAppKey = singlePage.UrlMap().sql
        dataFactory.exeSql()
    }
}; route01Controller(SqlController, ['sql_:sqlName'])

conf.buildParamSqlInsert01 = () => conf.buildSqlInsert01(conf.table02, conf.ioVar.parentId)
conf.buildSqlInsert01 = (table, parentId) => {
    if (!table) table = conf.table01
    let sqlInsert = 'INSERT INTO doc (:vr ) VALUES (:vl ); ', i = 1
    conf.sqlInsert = ''
    ar.forEach(table, row => {
        let vr = 'doc_id', vl = ':nextDbId' + i
        if (i > 1) {
            vr += ', parent'; vl += ', :nextDbId1'
        } else if (parentId) {
            vr += ', parent'; vl += ', ' + parentId
        }
        if (row.reference) {
            vr += ', reference'; vl += ', ' + row.reference
        }
        if (conf.sqlInsert) conf.sqlInsert += '\n\ '
        conf.sqlInsert += sqlInsert.replace(':vr ', vr).replace(':vl ', vl)
        i++
    })
}

sql_app.readTask = {
    name: 'Read Task data input and output',
    sql: 'SELECT d2.doc_id, sp.value parent, sr.value var_name, d2.reference r_id, sr2.value r2 \n\
    , d2.reference2 val_id  \n\
    FROM doc d \n\
    LEFT JOIN string sp ON sp.string_id=d.reference \n\
    , doc d2 \n\
    LEFT JOIN string sr ON sr.string_id=d2.reference \n\
    LEFT JOIN string sr2 ON sr2.string_id=d2.reference2 \n\
    WHERE d.parent = 374559 \n\
    AND d2.parent = d.doc_id \n\
    ORDER BY d.doc_id',
    buildSQL: conf.buildParamSqlInsert01,
    sql2name: 'patternForSQL',
    initDataFromSql: (r, dataFactory) => {
        conf.ioVar = {}
        ar.forEach(r.list, row => {
            conf.eMap[row.doc_id] = row
            row.var_name && (conf.ioVar[row.var_name] = row.val_id)
            if ('sql_INSERT' == row.var_name) {
                console.log(conf.ioVar)
                let sql = sql_app[sql_app.readTask.sql2name].initSql(conf.ioVar.sql_INSERT)
                console.log(2, sql)
                dataFactory.readSql(sql, r2 => {
                    console.log(r2)
                    conf.table02 = r2.list
                })
            }
        })
    },
}
sql_app.patternForSQL = {
    name: 'Pattern for SQL transformation',
    buildSQL: conf.buildSqlInsert01,
    noSave: true,
    initSql: docId => {
        if (!docId) docId = 374523
        let sql = sql_app.patternForSQL.sql
        sql = sql.replaceAll(':var.docId', docId)
        return sql
    },
    sql: 'SELECT x.* FROM ( \n\
        SELECT CASE WHEN doc_id=:var.docId THEN 1 ELSE 2 END l, d.* FROM doc d WHERE :var.docId in (doc_id,parent) \n\
        ) x ORDER BY x.l',
}
sql_app.p1q5 = {
    name: 'Завдання і їх виконання',
    sql: 'SELECT d.doc_id, s.value note_task, sic.value ad_name, bo.reference2 basedOn FROM doc d \n\
    LEFT JOIN string s ON s.string_id=d.doc_id \n\
    LEFT JOIN doc bo  \n\
    ON bo.reference=369777 AND bo.parent=d.doc_id \n\
    LEFT JOIN doc ic  \n\
    LEFT JOIN string sic ON sic.string_id=ic.reference2 \n\
    ON ic.reference=371927 AND ic.parent=d.doc_id \n\
    WHERE d.reference=374562',
}
sql_app.p1q4 = {
    name: 'Task resource - Завдання',
    sql: 'SELECT s2.value task_parent, s1.value task_resource \n\
    , doc_id, reference r, reference2 r2 FROM doc d  \n\
    LEFT JOIN string s1 on s1.string_id=doc_id \n\
    LEFT JOIN string s2 on s2.string_id=parent \n\
    where 369861 in (reference,reference2)',
}
sql_app.p1q3 = {
    name: 'Імена функцій ActivityDefinition',
    sql: 'SELECT d.doc_id, s.value ad_text, sr.value rtype, d.reference r FROM doc d \n\
    LEFT JOIN string s ON s.string_id=d.doc_id \n\
    LEFT JOIN string sr ON sr.string_id=d.reference \n\
    WHERE d.reference in (373500,371999)',
}
sql_app.p1q1 = {
    name: 'Взаємодії',
    sql: 'SELECT d2.doc_id, s3.value humanname, s1.value datatype FROM doc d3 \n\
    LEFT JOIN string s3 ON s3.string_id=d3.reference2 \n\
    , doc d1 \n\
    LEFT JOIN string s1 ON s1.string_id=d1.reference2 \n\
    , doc d2 \n\
    WHERE d1.reference2 = 371212 \n\
    AND d1.doc_id = d2.parent \n\
    AND d3.doc_id = d2.reference2',
}
sql_app.p1q2 = {
    name: 'Епізоди лікування',
    sql: 'SELECT d2.doc_id, s3.value humanname, s1.value datatype FROM doc d3 \n\
    LEFT JOIN string s3 ON s3.string_id=d3.reference2 \n\
    , doc d1 \n\
    LEFT JOIN string s1 ON s1.string_id=d1.reference2 \n\
    , doc d2 \n\
    WHERE d1.reference2 = 367553 \n\
    AND d1.doc_id = d2.parent \n\
    AND d3.doc_id = d2.reference2',
}
sql_app.SelectADN = {
    name: 'Зчитати абстрактий вузел - TeSe',
    sql: 'SELECT d.*, dr.doctype r_doctype, s.value value_22, su.value value_u_22, f.value value_24 \n\
    , ts.value value_25, srr.value rr_value_22 \n\
    , sr.value r_value_22, dr2.doctype r2_doctype \n\
    , sr2.value r2_value_22, o.sort \n\
    FROM doc d \n\
     LEFT JOIN string s ON s.string_id=d.doc_id \n\
     LEFT JOIN string_u su ON su.string_u_id=d.doc_id \n\
     LEFT JOIN double f ON f.double_id=d.doc_id \n\
     LEFT JOIN timestamp ts ON ts.timestamp_id=d.doc_id \n\
     LEFT JOIN doc dr ON dr.doc_id=d.reference \n\
     LEFT JOIN string sr ON sr.string_id=d.reference \n\
     LEFT JOIN string srr ON srr.string_id=dr.reference \n\
     LEFT JOIN doc dr2 ON dr2.doc_id=d.reference2 \n\
     LEFT JOIN string sr2 ON sr2.string_id=d.reference2 \n\
     LEFT JOIN sort o ON sort_id=d.doc_id \n\
     ',
    oderBy: 'sort',
    rowId: 'doc_id',
    whereDocAlias: 'd',
}
sql_app.keys = () => Object.keys(sql_app)
