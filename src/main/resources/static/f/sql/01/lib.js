'use strict';
// data collection
const conf = {}, sql_app = {}
const d = { elMap: {}, clList: {}, conf: {} }

let singlePage = {}
singlePage.Url = () => window.location.href.split('#!')[1]
singlePage.UrlList = () => singlePage.Url().split('/')
singlePage.LastUrl = () => singlePage.Url() ? singlePage.Url().split('/')[singlePage.Url().split('/').length - 1] : ''
console.log(1, singlePage.LastUrl())

class AmDocAbstractController {
    constructor($scope) {
        $scope.d = d
    }
    setDoc = (data) => {
        console.log(1, data.elMap, data.clList)
        d.elMap = data.elMap
        d.clList = data.clList
    }
    addDoc = (data) => {
        console.log(1, data.elMap, data.clList)
        Object.assign(d.elMap, data.elMap)
        Object.assign(d.clList, data.clList)
    }
}

// app.factory("treeFactory", TreeFactory)
class TreeFactory {
    constructor(dataFactory, $q) {
        let setEl = (el) => {
            d.elMap[el.doc_id] = el
            return el
        }
        let setChildrenEl = (data) => {
            let children = []
            angular.forEach(data.list, (el) => {
                setEl(el)
                if (!d.clList[el.parent]) d.clList[el.parent] = []
                d.clList[el.parent].push(el.doc_id)
                children.push(el.doc_id)
                if (conf.readExtra)
                    conf.readExtra(el)
            })
            return children
        }
        return {
            readDocument: function (doc_id) {
            },
            readElementRest: (el_id) => {
                console.log(el_id, !d.elMap[el_id])
                let deferred = $q.defer()
                if (d.elMap[el_id]) deferred.resolve(d.elMap[el_id])
                else {
                    dataFactory.httpGetRest('/r/adn/el/' + el_id)
                        .then((data) => {
                            let el = setEl(data.list[0])
                            deferred.resolve(d.elMap[el.doc_id])
                        })
                }
                return deferred.promise
            },
            readElement: (el_id) => {
                console.log(el_id, !d.elMap[el_id])
                let deferred = $q.defer()
                if (d.elMap[el_id]) deferred.resolve(d.elMap[el_id])
                else {
                    let sql1 = sql_app.SELECT_obj_with_i18n(el_id)
                    dataFactory.httpGet({ sql: sql1 })
                        .then((data) => {
                            let el = setEl(data.list[0])
                            deferred.resolve(d.elMap[el.doc_id])
                        })
                }
                return deferred.promise
            },
            readChildrenDeep: function (parent_ids, deep) {
                // console.log(deep, deep > 0, parent_ids, 1)
                if (--deep > 0)
                    this.readListChildren(parent_ids)
                        .then((new_parent_ids) => this.readChildrenDeep(new_parent_ids, deep))
            },
            getListChildrenRest: (parent_ids, deferred) => {
                dataFactory.httpGetRest('/r/adn/l/' + parent_ids)
                    .then((data) => {
                        let children = setChildrenEl(data)
                        // console.log(data, children)
                        deferred.resolve(children)
                    })
            },
            getListChildrenSql: (parent_ids, deferred) => {
                let sql1 = sql_app.SELECT_parentsList_with_i18n(parent_ids)
                // console.log(parent_ids, sql1)
                dataFactory.httpGet({ sql: sql1 })
                    .then((data) => {
                        let children = setChildrenEl(data)
                        // console.log(data, children)
                        deferred.resolve(children)
                    })
            },
            readListChildren: function (parent_ids) {
                let deferred = $q.defer()
                let toReadChildren = []
                angular.forEach(parent_ids, (id) => {
                    if (d.clList[id] == null && d.elMap[id].cnt_child != null) {
                        toReadChildren.push(id)
                    }
                })
                if (toReadChildren.length == 0) {
                    deferred.resolve(toReadChildren)
                } else {
                    console.log(conf.getListChildren)
                    this[conf.getListChildren](parent_ids, deferred)
                }
                return deferred.promise
            },
            readChildren: function (parent_id) {
                let deferred = $q.defer()
                if (d.clList[parent_id]) deferred.resolve(d.clList[parent_id])
                else {
                    let sql1 = sql_app.SELECT_children_with_i18n(parent_id)
                    // console.log(parent_id, d, sql1)
                    dataFactory.httpGet({ sql: sql1 })
                        .then((data) => {
                            setChildrenEl(data)
                            deferred.resolve(d.clList[parent_id])
                        })
                }
                return deferred.promise
            },

        }
    }
}

// app.factory("dataFactory", DataFactory)
class DataFactory {
    constructor($http, $q, $resource) {
        return {
            adn_d: $resource('/r/adn/d/:doc_id', { doc_id: '@doc_id', value: '@value' }),
            adn_insert: $resource('/r/adn/insert', { sqlCmdMap: '@sqlCmdMap' }),
            adn_delete: $resource('/r/adn/delete', { sqlCmdMap: '@sqlCmdMap' }),
            adn_deletes: $resource('/r/adn/deletes', { sqlCmdListMap: '@sqlCmdListMap' }),
            url_sql_read_db1: $resource('/r/url_sql_read_db1', { data: '@data' }),
            url: '/r/url_sql_read_db1',
            httpGet: function (params) {
                var deferred = $q.defer()
                $http.get(this.url, { params: params })
                    .then((response) => {
                        deferred.resolve(response.data)
                    }, (response) => {
                        console.log(response.status)
                        // deferred.reject(response.status)
                        // https://metanit.com/web/angular/3.3.php
                    })
                return deferred.promise
            },
            httpGetRest: function (url) {
                var deferred = $q.defer()
                // console.log(url, 1)
                $http.get(url)
                    .then((response) => {
                        deferred.resolve(response.data)
                    }, (response) => {
                        console.log(response.status)
                        // deferred.reject(response.status)
                        // https://metanit.com/web/angular/3.3.php
                    })
                return deferred.promise
            },
        }
    }
}

sql_app.replace_params = (sql, data) => {
    angular.forEach(sql.split(':'), function (v) {
        var v1 = v.split(' ')[0]
            .replace(',', '')
            .replace(')', '').trim()
        if (data[v1]) {
            sql = sql.replace(':' + v1, data[v1])
        }
    })
    return sql
}


sql_app.doc_insert_sort = () => {
    var sql = "INSERT INTO sort (sort, sort_id) VALUES (:sort, :sort_id)"
    return sql
}

sql_app.doc_update_sort = () => {
    var sql = "UPDATE sort SET sort=:sort WHERE sort_id=:sort_id"
    return sql
}

sql_app.FHIR_Medication_sq = () => {
    let sql = 'SELECT d.doc_id medication_id, substance.* FROM doc d \n\
    LEFT JOIN (SELECT * FROM doc,sort WHERE doc_id=sort_id AND sort=1) item \n\
    LEFT JOIN (:sql_app.FHIR_Substance ) substance ON substance.doc_id=item.reference2 \n\
    ON item.parent=d.doc_id \n\
    WHERE d.reference=369998 and d.reference2=369993'
    return sql
}


sql_app.FHIR_Substance = () => {
    let sql = 'SELECT value substance_code, d.*, dq.* FROM doc d \n\
    LEFT JOIN ( SELECT dq.parent dq_parent, quantity_value, quantity_code FROM doc dq, \n\
    (:sql_app.tableOfFHIR_Quantity ) dqd WHERE dqd.doc_id = dq.reference2 ) dq ON dq_parent=d.doc_id \n\
    , string WHERE reference = 370024 and string_id=reference2'
    return sql
}

sql_app.obj_with_i18n = () => {
    //	", s1.value value_1_22, s1.string_id id_1_22, i1.value value_1_23, i1.integer_id id_1_23, f1.value value_1_24, f1.double_id id_1_24 \n" +
    let sql = "SELECT d1.*, dr1.doctype doctype_r \n\
        , s1.value value_1_22, i1.value value_1_23, f1.value value_1_24 \n\
        , ts1.value value_1_25, dt1.value value_1_26 \n\
        , r1.value r1value, r2.value r2value \n\
        , sort, sort_id, uu.value uuid \n\
        , i18n, i18n_id, cnt_child FROM doc d1 \n\
        LEFT JOIN uuid uu ON d1.doc_id = uu.uuid_id \n\
        LEFT JOIN string s1 ON d1.doc_id = s1.string_id \n\
        LEFT JOIN integer i1 ON d1.doc_id = i1.integer_id \n\
        LEFT JOIN double f1 ON d1.doc_id = f1.double_id \n\
        LEFT JOIN timestamp ts1 ON d1.doc_id = ts1.timestamp_id \n\
        LEFT JOIN date dt1 ON d1.doc_id = dt1.date_id \n\
        LEFT JOIN doc dr1 ON d1.reference = dr1.doc_id \n\
        LEFT JOIN string r1 ON d1.reference = r1.string_id \n\
        LEFT JOIN string r2 ON d1.reference2 = r2.string_id \n\
        LEFT JOIN (" + sql_app.select_i18n_all() + " \n) i18n ON i18n_ref=d1.doc_id \n\
        LEFT JOIN sort o1 ON o1.sort_id = d1.doc_id \n\
        LEFT JOIN (SELECT COUNT(*) cnt_child, parent FROM doc GROUP BY parent) d2 ON d2.parent=d1.doc_id \n"
    return sql
}

sql_app.select_i18n_all = (left_join_ref, i18n_parent) => {
    var sql = "SELECT reference i18n_ref, doc_id i18n_id, value i18n \n\
	FROM (SELECT d2.* FROM doc d1, doc d2 where d2.parent=d1.doc_id and d1.reference=285596) d \n\
	LEFT JOIN string s1 ON s1.string_id=doc_id "
    return sql
}

sql_app.SELECT_obj_with_i18n = (doc_id) => {
    var sql = sql_app.obj_with_i18n() +
        "WHERE d1.doc_id = :doc_id "
    sql = sql.replace(':doc_id', doc_id)
    return sql
}

sql_app.SELECT_children_with_i18n = (parent_id) => {
    var sql = sql_app.obj_with_i18n() +
        "WHERE d1.parent = :parent \n\
        ORDER BY sort "
    sql = sql.replace(':parent', parent_id)
    //	console.log(sql)
    return sql
}

sql_app.SELECT_parentsList_with_i18n = (parentsList) => {
    var sql = sql_app.obj_with_i18n() +
        "WHERE d1.parent IN (:parentsList) \n\
        ORDER BY sort "
    sql = sql.replace(':parentsList', parentsList)
    //	console.log(sql)
    return sql
}

var markdownInLine = function (text) {
    if (!text) return
    var t2 = ('' + text)
    var bold = /\u002A\u002A([\wа-яА-Яі\-]+[\s+[\wа-яА-Яі\-]*]*)\u002A\u002A/gmi;
    //		var bold	= /\u002A\u002A([\wа-яА-Яі\-]+\s*[\wа-яА-Яі\-]*)\u002A\u002A/gmi;
    var t2 = t2.replace(bold, '<strong>$1</strong>');
    //		var bold = "\u002A\u002A([\wа-яА-Яі\-]+\s*[\wа-яА-Яі\-]*)\u002A\u002A";
    //		var t2 = (''+text).replace(new RegExp(bold, 'gi'), '<strong>$1</strong>');
    var link = /\[([^`]{1,40})\]\(([^`)]*)\)/gmi
    //			var link	= /\[([^`]*)\]\(([^`)]*)\)/gmi
    var t2 = t2.replace(link, '<a href="$2">$1</a>');
    return t2
}

function sqlSort(parentClList) {
    var so = { sql: '' }
    console.log(parentClList)
    let sort = 0
    angular.forEach(parentClList, function (k) {
        let v = d.elMap[k]
        if (v.sort_id)
            var sql = sql_app.doc_update_sort()
        else
            var sql = sql_app.doc_insert_sort()
        sql = sql_app.replace_params(sql, { sort: ++sort, sort_id: v.doc_id, })
        so.sql += sql + ';\n'
    })
    return so
}

var upDowntElement = function (id, direction) {
    let o = d.elMap[id]
    //	var oParent = this.eMap[o.parent]
    var oParent = d.elMap[o.parent]
    let parentClList = d.clList[o.parent]
    var position = parentClList.indexOf(o.doc_id)
    console.log(position, o.doc_id, direction)
    if ((position + 1 == parentClList.length) && direction == 1) {// зробити першим
        var x = parentClList.splice(position, 1)
        parentClList.splice(0, 0, x[0])
    } else if ((position == 0) && direction == -1) {// зробити останнім
        console.log('зробити останнім')
        var x = parentClList.splice(position, 1)
        parentClList.push(x[0])
    } else {
        var x = parentClList.splice(position, 1)
        parentClList.splice(position + direction, 0, x[0])
    }
    var so = sqlSort(parentClList)
    so.sql += sql_app.SELECT_children_with_i18n(oParent.doc_id)
    //		so.sql += sql_app.SELECT_with_parent(oParent)
    so.dataAfterSave = function (response) {
        angular.forEach(response.data, function (v, k) {
            if (k.includes('list')) {
                angular.forEach(v, function (v2) {
                    let v2_old = ctrl.eMap[v2.doc_id]
                    if (v2_old && v2_old.children)
                        v2.children = v2_old.children
                    v2_old = null
                    ctrl.eMap[v2.doc_id] = v2
                })
                d.clList[o.parent] = v
            }
        })
    }
    return so
}

