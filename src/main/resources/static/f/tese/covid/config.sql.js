'use strict'
conf.ontology_link='/f/c/11/eh004.html?doc2doc='
sql_app.ValueSet_title = {
    name: 'Всі ValueSet в БД задані і зчитані по title полю',
    sql: 'SELECT value title,  d.* FROM doc d \n\
    LEFT JOIN string ON string_id=doc_id \n\
    WHERE reference=372045',
    ontology_link_param:'369765,372041',
    sqlHtml: {
        doc_id: '<a href="#!/sql/ValueSet_values/valueset_id/=/{{r[k]}}">{{r[k]}}</a>',
    },
}

sql_app.ValueSet_values = {
    name: 'Всі ValueSet і їх значення',
    sql: 'SELECT d.doc_id value_id, s.value, p.parent p, p3.parent valueset_id, s2.value valueset \n\
    FROM doc p, doc pp \n\
    , doc d left join string s on s.string_id=doc_id \n\
    , doc p3 left join string s2 on s2.string_id=p3.parent \n\
    WHERE p.doc_id=d.parent AND pp.doc_id=p.parent AND p3.doc_id=pp.parent \n\
    AND p.reference=372049 \n\
    ORDER BY p3.parent',
    sqlHtml: {
        valueset_id: '<a href="#!/sql/{{ctrl.conf.sqlKeyName}}/{{k}}/=/{{r[k]}}">{{r[k]}}</a>',
    },
}

sql_app.Medication_code_all = {
    name:'Всі медикаменти по коду',
    sql:'SELECT * FROM doc \n\
    LEFT JOIN string ON reference2=string_id \n\
    where reference = 371306',
}
