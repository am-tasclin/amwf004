'use strict'

let pageLogic = {}
pageLogic.isTaskWithAD = () => conf.clickRow.ad_name && conf.clickRow.basedon
pageLogic.taskWithAD = () => {
    console.log(conf.clickRow)
}

conf.buildSqlInsert = () => {
    // if (!conf.sqlInsert) {
    if (conf.sqlAppKey == 'patternForSQL') {
        let sqlInsert = 'INSERT INTO doc (:vr ) VALUES (:vl ); \n\ ', i = 1
        conf.sqlInsert = ''
        ar.forEach(conf.table01, row => {
            let vr = 'doc_id', vl = ':nextDbId' + i
            if (i > 1) {
                vr += ', parent'; vl += ', :nextDbId1'
            }
            if (row.reference) {
                vr += ', reference'; vl += ', ' + row.reference
            }
            conf.sqlInsert += sqlInsert.replace(':vr ', vr).replace(':vl ', vl)
            i++
        })
    }
    return conf.sqlInsert
}


class InitPageController extends AbstractController {
    constructor(dataFactory) {
        super(dataFactory)
        console.log(conf)
    }
    clickRow = row => {
        console.log(row)
        conf.clickRow = row
        pageLogic.isTaskWithAD() && pageLogic.taskWithAD()
    }
    exeSql = sqlAppKey => {
        conf.sqlAppKey = sqlAppKey
        delete conf.sqlInsert
        console.log(sqlAppKey, ':', sql_app[sqlAppKey].sql)
        this.dataFactory.readSql(sql_app[sqlAppKey].sql, r => {
            console.log(r)
            conf.table01 = r.list
        })
    }
    stringifyJSON = jn => JSON.stringify(jn, null, ' ')

}; app.controller('InitPageController', InitPageController)

sql_app.keys = () => Object.keys(sql_app)
sql_app.patternForSQL = {
    name: 'Pattern for SQL transformation',
    sql: 'SELECT x.* FROM ( \n\
        SELECT CASE WHEN doc_id=374523 THEN 0 ELSE 1 END s, d.* FROM doc d WHERE 374523 in (doc_id,parent) \n\
        ) x ORDER BY x.s',
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
