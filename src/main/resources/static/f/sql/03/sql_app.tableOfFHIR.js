sql_app.tableOfFHIR_Substance_code = () => {
    let sql = 'SELECT value substance_code, d.doc_id substance_id FROM doc d \n\
    , string WHERE reference = 370024 and string_id=reference2'
    return sql
}

sql_app.tableOfFHIR_Quantity = () => {
    let sql = 'SELECT i.value quantity_value, dc.value quantity_code, d.*, dc.reference2 quantity_code_id FROM doc d \n\
    LEFT JOIN integer i ON i.integer_id=d.doc_id \n\
    LEFT JOIN ( SELECT d.*, value FROM doc d,string WHERE reference2=string_id \n\
    ) dc ON dc.parent=d.doc_id AND dc.reference = 368641 \n\
    WHERE d.reference=368637 AND d.reference2=368636'
    return sql
}

sql_app.tableOfFHIR_MedicationRequest_sc = () => {
    let sql = 'SELECT d.doc_id medicationrequest_id, medication.* FROM doc d ,(:sql_app.tableOfFHIR_Medication_sc ) medication \n\
    WHERE d.reference=371469 AND medication.medication_id=d.reference2'
    return sql
}

sql_app.tableOfFHIR_Medication_sc = () => {
    let sql = 'SELECT d.doc_id medication_id, substance.*, item.doc_id item_id, strength.doc_id strength_ratio_id, ratio.* FROM doc d \n\
    LEFT JOIN (SELECT * FROM doc,sort WHERE doc_id=sort_id AND sort=1) item \n\
    LEFT JOIN (:sql_app.tableOfFHIR_Substance_code ) substance ON substance_id=item.reference2 \n\
    LEFT JOIN doc strength \n\
    LEFT JOIN (:sql_app.tableOfFHIR_Ratio ) ratio ON ratio.numerator_id=strength.reference2 \n\
    ON strength.parent=item.doc_id \n\
    ON item.parent=d.doc_id \n\
    WHERE d.reference=369998 and d.reference2=369993'
    return sql
}

sql_app.tableOfFHIR_Ratio = () => {
    let sql = 'SELECT numerator.doc_id  ratio_id, numerator.doc_id  numerator_id, numerator.reference2 n_quantity_id \n\
    , n.quantity_value n_quantity_value, n.quantity_code n_quantity_code --, n.*  \n\
    , denominator.doc_id denominator_id, denominator.reference2 dn_quantity_id --, denominator.* \n\
    , dn.quantity_value dn_quantity_value, dn.quantity_code dn_quantity_code --, dn.* \n\
    FROM doc numerator  \n\
    LEFT JOIN ( :sql_app.tableOfFHIR_Quantity ) n ON n.doc_id= numerator.reference2 \n\
    LEFT JOIN doc denominator \n\
    LEFT JOIN ( :sql_app.tableOfFHIR_Quantity ) dn ON dn.doc_id= denominator.reference2 \n\
    ON denominator.parent = numerator.doc_id  \n\
    WHERE  numerator.reference = 368676'
    return sql
}

sql_app.concatSql = (sql)=>{
    if (sql.includes(':sql_app.')) {
        let sql_split = sql.split(':sql_app.')
        let sql_name = sql_split[1].split(' ')[0]
        sql = sql.replace(':sql_app.' + sql_name, sql_app[sql_name]())
        if (sql.includes(':sql_app.')) {
            let sql_split = sql.split(':sql_app.')
            let sql_name = sql_split[1].split(' ')[0]
            sql = sql.replace(':sql_app.' + sql_name, sql_app[sql_name]())
            if (sql.includes(':sql_app.')) {
                let sql_split = sql.split(':sql_app.')
                let sql_name = sql_split[1].split(' ')[0]
                sql = sql.replace(':sql_app.' + sql_name, sql_app[sql_name]())
                if (sql.includes(':sql_app.')) {
                    let sql_split = sql.split(':sql_app.')
                    let sql_name = sql_split[1].split(' ')[0]
                    sql = sql.replace(':sql_app.' + sql_name, sql_app[sql_name]())
                    if (sql.includes(':sql_app.')) {
                        let sql_split = sql.split(':sql_app.')
                        let sql_name = sql_split[1].split(' ')[0]
                        sql = sql.replace(':sql_app.' + sql_name, sql_app[sql_name]())
                    }
                }
            }
        }
    }
    return sql
}