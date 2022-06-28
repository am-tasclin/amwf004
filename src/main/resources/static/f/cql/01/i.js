'use strict'

class InitPageController extends AbstractController {
    constructor(dataFactory) {
        super(dataFactory)
        console.log(conf)

    }
    clickRow = row => {
        conf.clickRow = row
        console.log(row)
    }
    exeSql = sqlAppKey => {
        conf.sqlAppKey = sqlAppKey
        console.log(sqlAppKey)
        this.dataFactory.readSql(sql_app[sqlAppKey].sql, r => {
            console.log(r)
            conf.table01 = r.list
        })
    }
    stringifyJSON = jn => JSON.stringify(jn, null, ' ')

}; app.controller('InitPageController', InitPageController)

sql_app.keys = () => Object.keys(sql_app)
sql_app.p1q1 = {
    name: 'Взаємодії',
    sql: 'SELECT d2.doc_id, s3.value humanname, s1.value datatype FROM doc d3 \n\
    left join string s3 on s3.string_id=d3.reference2 \n\
    , doc d1 \n\
    left join string s1 on s1.string_id=d1.reference2 \n\
    , doc d2 \n\
    where d1.reference2 = 371212 \n\
    and d1.doc_id = d2.parent \n\
    and d3.doc_id = d2.reference2',
}
sql_app.p1q2 = {
    name: 'Епізоди лікування',
    sql: 'SELECT d2.doc_id, s3.value humanname, s1.value datatype FROM doc d3 \n\
    left join string s3 on s3.string_id=d3.reference2 \n\
    , doc d1 \n\
    left join string s1 on s1.string_id=d1.reference2 \n\
    , doc d2 \n\
    where d1.reference2 = 367553 \n\
    and d1.doc_id = d2.parent \n\
    and d3.doc_id = d2.reference2',
}