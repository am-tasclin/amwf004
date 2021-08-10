'use strict'
sql_app.ValueSet_title = {
    name: 'Всі ValueSet в БД задані і зчитані по title полю',
    sql: 'SELECT value title,  d.* FROM doc d \n\
    LEFT JOIN string ON string_id=doc_id \n\
    WHERE reference=372045',
    sqlHtml: { doc_id: '<a href="#!/sql/ValueSet_values/valueset_id/=/{{r[k]}}">{{r[k]}}</a>', },
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
    sqlHtml: { valueset_id: '<a href="#!/sql/{{ctrl.conf.sqlKeyName}}/{{k}}/=/{{r[k]}}">{{r[k]}}</a>', },
}

sql_app.ValueSet_code001 = {
    sql: 'SELECT x.*, y.valueset_s FROM (:sql_app.codeInConcept ) x \n\
    LEFT JOIN (:sql_app.ValueSetComposeInclude ) y ON y.include_id = x.concept_p \n\
    ORDER BY code_p DESC, code_s',
}

sql_app.ValueSetComposeInclude = {
    sql: 'SELECT vs_s.value valueset_s, valueset.doc_id valueset_id, compose.doc_id compose_id, includes.doc_id include_id \n\
    FROM doc includes, doc compose, doc valueset \n\
    left join string vs_s ON vs_s.string_id=valueset.doc_id \n\
    WHERE valueset.reference=372045 \n\
    AND valueset.doc_id=compose.parent \n\
    AND includes.parent=compose.doc_id',
}

sql_app.codeInConcept = {
    sql: 'SELECT code_s.value code_s, code.doc_id code_id , code.parent code_p, concept.parent concept_p \n\
    FROM doc code \n\
    LEFT JOIN string code_s ON code_s.string_id=code.doc_id \n\
    LEFT JOIN doc concept ON  concept.doc_id=code.parent AND concept.reference=372049 \n\
    WHERE code.reference=372051',
}
