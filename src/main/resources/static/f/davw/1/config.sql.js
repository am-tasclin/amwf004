sql_app.SelectADN = {
    name: 'Зчитати абстрактий вузел - TeSe',
    sql: 'SELECT d.*, s.value value_22, su.value value_u_22, o.sort \n\
    , srr.value rr_value_22 \n\
    , sr.value r_value_22, dr.doctype r_doctype \n\
    , sr2.value r2_value_22 \n\
    FROM doc d \n\
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
