sql_app.group.gp_EmrAutoSql01 = {
    name: 'first autoSQL - EMR',
    add: () => {
        console.log(123)

        sql_app.PatientEpisodeOfCare = {
            name: 'Епізоди паціента',
            sql: 'SELECT x.r2_patient_patient_id patient_id, x.* hn \n\
            FROM (:sql_app.TableA1Row2Adn_373458 ) x ',
        }

        sql_app.TableA1Row2Adn_373458 = {// : buildSqlApp - sql_app.TableA1Row2Adn_373458 
            "columns": {
                "373459": {
                    "sqlName": "R2ValueSql"
                },
                "373462": {
                    "sqlName": "AdnSql"
                }
            },
            "sql": "SELECT * FROM (SELECT patient_Patient_parent table_id, patient_Patient_id row_id, r2_patient_Patient_id,  patient_Patient_id  FROM (SELECT reference2 r2_patient_Patient_id, parent patient_Patient_parent, doc_id patient_Patient_id FROM doc patient_Patient WHERE reference = 368896 ) row\n ) row :fn_sql_app.autoSql.joinColumnsSql(TableA1Row2Adn_373458.columns) "
        }
        // SELECT * FROM (SELECT patient_Patient_parent table_id, patient_Patient_id row_id, r2_patient_Patient_id,  patient_Patient_id  FROM (SELECT reference2 r2_patient_Patient_id, parent patient_Patient_parent, doc_id patient_Patient_id FROM doc patient_Patient WHERE reference = 368896 ) row
        //) row :fn_sql_app.autoSql.joinColumnsSql(TableA1Row2Adn_373458.columns) 

        sql_app.R2ValueSql_373459 = {
            "rowId": "period_start_id",
            "parentId": "period_start_parent",
            "colName": "period_start",
            "sql": "SELECT v.value period_start_25, d.doc_id period_start_id, d.parent period_start_parent FROM doc r2, doc d \nLEFT JOIN timestamp v ON v.timestamp_id=d.doc_id \n WHERE d.reference2=368679 AND d.reference=368894 AND r2.doc_id=d.reference2"
        }
        sql_app.AdnSql_373462 = {
            "sql": "SELECT value text_Narrative_22, parent text_Narrative_parent, doc_id text_Narrative_id FROM doc text_Narrative\n LEFT JOIN string ON string_id=doc_id WHERE reference = 372927 ",
            "rowId": "text_Narrative_id",
            "parentId": "text_Narrative_parent",
            "colName": "text_Narrative",
            "columnNames": "text_Narrative_id, text_Narrative_22"
        }

        // END: buildSqlApp - sql_app.TableA1Row2Adn_373458 

        sql_app.PatientHumanName = {
            name: 'Паціент людське ім\'я',
            sql: 'SELECT dp.doc_id patient_id, hn.* hn \n\
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