'use strict'
sql_app.tableOfFHIR_ValueSet_code001 = () => {
    let sql = 'SELECT x.*, y.valueset_s FROM (:sql_app.tableOfFHIR_codeInConcept ) x \n\
    LEFT JOIN (:sql_app.tableOfFHIR_ValueSetComposeInclude ) y ON y.include_id = x.concept_p \n\
    ORDER BY code_p DESC, code_s'
    return sql
}

sql_app.tableOfFHIR_ValueSetComposeInclude = () => {
    let sql ='SELECT vs_s.value valueset_s, valueset.doc_id valueset_id, compose.doc_id compose_id, includes.doc_id include_id \n\
    FROM doc includes, doc compose, doc valueset \n\
    left join string vs_s ON vs_s.string_id=valueset.doc_id \n\
    WHERE valueset.reference=372045 \n\
    AND valueset.doc_id=compose.parent \n\
    AND includes.parent=compose.doc_id'
    return sql
}

sql_app.tableOfFHIR_codeInConcept = () => {
    let sql = 'SELECT code_s.value code_s, code.doc_id code_id , code.parent code_p, concept.parent concept_p \n\
    FROM doc code \n\
    LEFT JOIN string code_s ON code_s.string_id=code.doc_id \n\
    LEFT JOIN doc concept ON  concept.doc_id=code.parent AND concept.reference=372049 \n\
    WHERE code.reference=372051'
    return sql
}
