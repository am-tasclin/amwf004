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
        console.log(sqlAppKey,':', sql_app[sqlAppKey].sql)
        this.dataFactory.readSql(sql_app[sqlAppKey].sql, r => {
            console.log(r)
            conf.table01 = r.list
        })
    }
    stringifyJSON = jn => JSON.stringify(jn, null, ' ')

}; app.controller('InitPageController', InitPageController)

sql_app.keys = () => Object.keys(sql_app)
sql_app.p1q4 = {
    name: 'Task resource',
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
