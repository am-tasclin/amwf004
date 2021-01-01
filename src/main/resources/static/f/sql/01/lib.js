const d = { elMap: {}, clList: {} }

// app.factory("treeFactory", TreeFactory)
function TreeFactory(dataFactory, $q) {
    return {
        readDocument: function (doc_id) {

        },
        readElement: (el_id) => {
            console.log(el_id, !d.elMap[el_id])
            let deferred = $q.defer()
            if (d.elMap[el_id]) deferred.resolve(d.elMap[el_id])
            else {
                let sql1 = sql_app.SELECT_obj_with_i18n(el_id)
                dataFactory.httpGet({ sql: sql1 })
                    .then((data) => {
                        let el = data.list[0]
                        d.elMap[el.doc_id] = el
                        deferred.resolve(d.elMap[el.doc_id])
                    })
            }
            return deferred.promise
        },
        readChildrenDeep: function (parent_ids, deep) {
            // console.log(deep, deep > 0, parent_ids)
            if (deep > 0)
                this.readListChildren(parent_ids)
                    .then((new_parent_ids) => this.readChildrenDeep(new_parent_ids, --deep))
        },
        readListChildren: function (parent_ids) {
            let deferred = $q.defer()
            let toReadChildren = []
            angular.forEach(parent_ids, (id) => {
                if(d.clList[id]==null && d.elMap[id].cnt_child!=null){
                    toReadChildren.push(id)
                }
            })
            if(toReadChildren.length==0){
                deferred.resolve(toReadChildren)
            }else{
                let sql1 = sql_app.SELECT_parentsList_with_i18n(parent_ids)
                // console.log(parent_ids, sql1)
                let setChildrenEl = this.setChildrenEl
                dataFactory.httpGet({ sql: sql1 })
                    .then((data) => {
                        let children = setChildrenEl(data)
                        // console.log(data, children)
                        deferred.resolve(children)
                    })
            }
            return deferred.promise
        },
        readChildren: function (parent_id) {
            let deferred = $q.defer()
            if (d.clList[parent_id]) deferred.resolve(d.clList[parent_id])
            else {
                let sql1 = sql_app.SELECT_children_with_i18n(parent_id)
                // console.log(parent_id, d, sql1)
                let setChildrenEl = this.setChildrenEl
                dataFactory.httpGet({ sql: sql1 })
                    .then((data) => {
                        setChildrenEl(data)
                        deferred.resolve(d.clList[parent_id])
                    })
            }
            return deferred.promise
        },
        setChildrenEl: (data) => {
            let children = []
            angular.forEach(data.list, (el) => {
                d.elMap[el.doc_id] = el
                if (!d.clList[el.parent]) d.clList[el.parent] = []
                d.clList[el.parent].push(el.doc_id)
                children.push(el.doc_id)
                if (conf.readExtra)
                    conf.readExtra(el)
            })
            return children
        },
    }
}

// app.factory("dataFactory", DataFactory)
function DataFactory($http, $q) {
    return {
        url: '/r/url_sql_read_db1',
        httpGet: function (params) {
            var deferred = $q.defer()
            $http.get(this.url, { params: params })
                .then(function success(response) {
                    deferred.resolve(response.data)
                }, function error(response) {
                    console.log(response.status)
                    // deferred.reject(response.status)
                    // https://metanit.com/web/angular/3.3.php
                })
            return deferred.promise
        }
    }
}

const sql_app = {}
sql_app.obj_with_i18n = () => {
    //	", s1.value value_1_22, s1.string_id id_1_22, i1.value value_1_23, i1.integer_id id_1_23, f1.value value_1_24, f1.double_id id_1_24 \n" +
    var sql = "SELECT d1.*, dr1.doctype doctype_r \n\
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
        "WHERE d1.parent = :parent " +
        "ORDER BY sort "
    sql = sql.replace(':parent', parent_id)
    //	console.log(sql)
    return sql
}

sql_app.SELECT_parentsList_with_i18n = (parentsList) => {
    var sql = sql_app.obj_with_i18n() +
        "WHERE d1.parent IN (:parentsList) " +
        "ORDER BY sort "
    sql = sql.replace(':parentsList', parentsList)
    //	console.log(sql)
    return sql
}
