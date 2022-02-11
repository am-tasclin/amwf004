sql_app.group.gp_EmrAutoSql01 = {
    name: 'first autoSQL - EMR',
    add: () => {
        console.log(123)

        sql_app.PatientHumanName = {
            name: 'Паціент людське ім\'я',
            sql: 'SELECT dp.doc_id patient_name_id, hn.* hn \n\
            FROM doc dp, (:sql_app.TableA1Row2Adn_373406 ) hn \n\
            WHERE dp.reference=373423 AND hn.row_id=reference2',
        }

        sql_app.TableA1Row2Adn_373406 = {
            "columns": {
                "373407": {
                    "sqlName": "AdnSql"
                }
            },
            "sql": "SELECT * FROM (SELECT family_parent table_id, family_id row_id,  family_22,  family_id  FROM (SELECT value family_22, parent family_parent, doc_id family_id FROM doc family\n LEFT JOIN string ON string_id=doc_id WHERE reference = 372116 ) row\n ) row :fn_sql_app.autoSql.joinColumnsSql(TableA1Row2Adn_373406.columns) "
        }

        sql_app.AdnSql_373407 = {
            "sql": "SELECT value given_22, parent given_parent, doc_id given_id FROM doc given\n LEFT JOIN string ON string_id=doc_id WHERE reference = 372117 ",
            "rowId": "given_id",
            "parentId": "given_parent",
            "colName": "given",
            "columnNames": "given_id, given_22"
        }

        // END: buildSqlApp - sql_app.TableA1Row2Adn_373406 
    },
}