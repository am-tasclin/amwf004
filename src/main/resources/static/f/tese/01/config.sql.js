'use strict'
sql_app.FHIRs_Group = {
    name:'Категорії ЦД - пропозиція під ТЗ Облік категорії пацієнта',
    sql:'SELECT d.doc_id group_id, s.value group_name, sp.value datagroup , d.* FROM doc d \n\
    LEFT JOIN string s ON s.string_id=d.doc_id \n\
    LEFT JOIN string sp ON sp.string_id=d.parent \n\
    WHERE d.parent=373337',
    noShow:['reference2','doctype'],
}
sql_app.HumanName_family_name = {
    name:"Ім'я Призвище",
    sql:'SELECT n.value name_v, f.value family_v, d.doc_id family_id, dn.doc_id name_id FROM doc d \n\
    LEFT JOIN string f ON d.doc_id=f.string_id \n\
    LEFT JOIN doc dn ON d.doc_id=dn.parent AND dn.reference=372117 \n\
    LEFT JOIN string n ON dn.doc_id=n.string_id \n\
    WHERE d.reference = 372116',
}
sql_app.FHIRs_Resource_Structure = {
    name:'FHIR Resource Structure',
    sql:'SELECT * FROM ( \n\
        SELECT s1.value fr_name, s1r.value fr_type, s1r2.value fr_type2 \n\
        , d1.doc_id fr_id, d1.reference type_id, d1.reference2 type2_id , d1.parent p \n\
        FROM sort sd1, doc d1 \n\
            LEFT JOIN string s1 ON s1.string_id=d1.doc_id \n\
            LEFT JOIN string s1r ON s1r.string_id=d1.reference \n\
            LEFT JOIN string s1r2 ON s1r2.string_id=d1.reference2 \n\
        WHERE  d1.doc_id=sd1.sort_id \n\
        ORDER BY sort) x',
        noShow:['p'],
        sqlHtml: {
            fr_type:'<a href="#!/sql/FHIRs_Resource_Structure/p/=/{{r.type_id}}"> {{r[k]}} </a>',
            fr_type2:'<a href="#!/sql/FHIRs_Resource_Structure/p/=/{{r.type2_id}}"> {{r[k]}} </a>',
        },
}
sql_app.FHIRs_in_Folders = {
    name:'FHIR елементи в папках-модулях',
    sql: 'SELECT s.value fr_name, d.doc_id fr_id, d.parent folder_id, sf.value folder_name \n\
    FROM doc f, sort fs, sort ds, doc d \n\
    LEFT JOIN string s ON s.string_id=d.doc_id \n\
    LEFT JOIN string sf ON sf.string_id=d.parent \n\
    WHERE f.parent=369765 AND d.reference !=369358 \n\
    AND d.parent=f.doc_id AND f.doctype=14 \n\
    AND fs.sort_id=f.doc_id AND ds.sort_id=d.doc_id AND s.value is not null \n\
    ORDER BY fs.sort,ds.sort',
    sqlHtml: {
        folder_name:'<i class="far fa-folder w3-small"></i> {{r[k]}}',
        fr_id: '<a href="#!/sql/FHIRs_Resource_Structure/p/=/{{r[k]}}">{{r[k]}}</a>',
    }
}

sql_app.ValueSet_title = {
    name: 'Всі ValueSet в БД задані і зчитані по title полю',
    sql: 'SELECT value title,  d.* FROM doc d \n\
    LEFT JOIN string ON string_id=doc_id \n\
    WHERE reference=372045',
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
