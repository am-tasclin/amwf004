sql_app.tableOfFHIR_Substance_code = () => {
    let sql = 'SELECT value substance_code, d.doc_id substance_id FROM doc d \n\
    , string WHERE reference = 370024 and string_id=reference2'
    return sql
}