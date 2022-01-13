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
