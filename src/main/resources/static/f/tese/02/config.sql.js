sql_app.FHIR_Organization_name_alias = {
    name:"Організація ім'я і аліас",
    sql:'SELECT s.value name_, sd.value alias, d.doc_id name_id, dd.doc_id alias_id, d.parent FROM doc d \n\
    LEFT JOIN sort ON sort_id=d.doc_id \n\
    LEFT JOIN string s ON s.string_id=d.doc_id \n\
    LEFT JOIN (SELECT * FROM doc WHERE reference = 373650) dd \n\
    LEFT JOIN string sd ON sd.string_id=dd.doc_id \n\
    ON dd.parent=d.doc_id \n\
    WHERE d.reference=371291 \n\
    ORDER BY sort'
}

sql_app.FHIR_ValueSet_concept_code_display_uk = {
    name:'',
    sql:'SELECT x.*, sl.value value_uk, dl.doc_id value_uk_id \n\
    FROM (:sql_app.FHIR_ValueSet_concept_code_display ) x \n\
        LEFT JOIN doc dl \n\
    LEFT JOIN string sl ON sl.string_id=dl.doc_id \n\
ON dl.parent=x.code_id AND dl.reference=373676 \n\
, doc ds, doc dsl, doc dct \n\
WHERE x.parent=dct.doc_id AND dct.parent=ds.parent AND ds.reference=373674 \n\
AND dsl.parent=ds.doc_id AND dsl.reference2=373581',
}

sql_app.FHIR_ValueSet_concept_code_display_en = {
    name: 'Значення код-прояв (en)',
    sql: 'SELECT s.value code, sd.value display, sv_en.value value_en \n\
    , d.doc_id code_id, dd.doc_id display_id, dv.doc_id value_en_id, d.parent FROM doc d \n\
    LEFT JOIN sort ON sort_id=d.doc_id \n\
    LEFT JOIN string s ON s.string_id=d.doc_id \n\
    LEFT JOIN (SELECT * FROM doc WHERE reference2 = 373680) dv \n\
    LEFT JOIN string sv_en ON sv_en.string_id=dv.doc_id \n\
    ON dv.parent=d.doc_id  \n\
    LEFT JOIN (SELECT * FROM doc WHERE reference = 372053) dd \n\
    LEFT JOIN string sd ON sd.string_id=dd.doc_id \n\
    ON dd.parent=d.doc_id \n\
    WHERE d.reference=372051 \n\
    ORDER BY sort',
}

sql_app.FHIR_ValueSet_concept_code_display = {
    name: 'Значення код-прояв',
    sql: 'SELECT s.value code, sd.value display, d.doc_id code_id, dd.doc_id display_id, d.parent FROM doc d \n\
    LEFT JOIN sort ON sort_id=d.doc_id \n\
    LEFT JOIN string s ON s.string_id=d.doc_id \n\
    LEFT JOIN (SELECT * FROM doc WHERE reference = 372053) dd \n\
    LEFT JOIN string sd ON sd.string_id=dd.doc_id \n\
    ON dd.parent=d.doc_id \n\
    WHERE d.reference=372051 \n\
    ORDER BY sort',
}

sql_app.FHIR_CodeSystem_parent = {
    name: 'Зчитування child-of',
    sql: 'SELECT su.value code, d.*, sort FROM string_u su, doc d \n\
    LEFT JOIN sort ON sort_id=d.doc_id \n\
    WHERE su.string_u_id=d.doc_id',
    oderBy: 'sort',
}

sql_app.FHIR_CodeSystem_concept_code_parent = {
    name: 'системи кодування задані рекурсивно',
    sql: 'SELECT d.*, dp.reference2 concept_code_parent, s.value concept_code_parent_value \n\
    FROM doc d, doc dp \n\
    LEFT JOIN string s ON s.string_id=reference2 \n\
    WHERE d.reference= 373541 AND dp.parent=d.doc_id AND dp.reference=371969',
}

sql_app.FHIRs_Group = {
    name: 'Категорії ЦД - пропозиція під ТЗ Облік категорії пацієнта',
    sql: 'SELECT d.doc_id group_id, s.value group_name, sp.value datagroup , d.* FROM doc d \n\
    LEFT JOIN string s ON s.string_id=d.doc_id \n\
    LEFT JOIN string sp ON sp.string_id=d.parent \n\
    WHERE d.parent=373337',
    noShow: ['reference2', 'doctype'],
}

sql_app.SelectADN = {
    name: 'Зчитати абстрактий вузел - TeSe',
    sql: 'SELECT d.*, s.value value_22, su.value value_u_22, o.sort \n\
    , srr.value rr_value_22 \n\
    , sr.value r_value_22, dr.doctype r_doctype \n\
    , sr2.value r2_value_22 \n\
    FROM tese.doc d \n\
     LEFT JOIN sort o ON sort_id=d.doc_id \n\
     LEFT JOIN string_u su ON su.string_u_id=d.doc_id \n\
     LEFT JOIN string sr ON sr.string_id=d.reference \n\
     LEFT JOIN string sr2 ON sr2.string_id=d.reference2 \n\
     LEFT JOIN doc dr ON dr.doc_id=d.reference \n\
     LEFT JOIN string srr ON srr.string_id=dr.reference \n\
     LEFT JOIN string s ON s.string_id=d.doc_id',
    oderBy: 'sort',
    rowId: 'doc_id',
    whereDocAlias: 'd',
}

sql_app.SelectADNi18n = {
    name: 'TeSe абстрактий вузел з перекладом',
    sql: 'SELECT d.*, i18n FROM (:sql_app.SelectADN ) d \n\
    LEFT JOIN (SELECT reference r1, value i18n FROM (SELECT d.* FROM doc d, doc p \n\
        WHERE d.parent=p.doc_id AND p.reference=285596 ) x \n\
    LEFT JOIN string ON string_id=doc_id) dv ON d.doc_id=dv.r1',
    oderBy: 'sort',
}

sql_app.SelectADNx = {
    name: 'Зчитати абстрактий вузел - test',
    sql: 'SELECT d.*, s.value value_22 FROM doc d \n\
    LEFT JOIN string s ON s.string_id=doc_id',
    rowId: 'doc_id',
}
