sql_app.group.gp_EmrAutoSql01 = {
    name: 'first autoSQL - EMR',
    add: () => {
        console.log(123)

        sql_app.PatientImmunizationDirect = {
            name: 'FHIR імунізація пацієнта без Encounter',
            sql: ':sql_app.TableRow2Adn_373791',
            patientIdName: 'r2_patient_patient_id',
        }

        sql_app.TableRow2Adn_373791 = {
            "sql": "SELECT row.* ,  vaccineCode_22, r2_vaccineCode_id,  vaccineCode_id ,  text_Narrative_22,  text_Narrative_id \n\
             FROM (SELECT patient_Patient_parent table_id, patient_Patient_id row_id, r2_patient_Patient_id,  patient_Patient_id \n\
             FROM (SELECT reference2 r2_patient_Patient_id, parent patient_Patient_parent, doc_id patient_Patient_id FROM doc patient_Patient \n\
             WHERE reference = 373792 ) row) row \n\
             LEFT JOIN (SELECT value vaccineCode_22, reference2 r2_vaccineCode_id, parent vaccineCode_parent, doc_id vaccineCode_id FROM doc vaccineCode\n LEFT JOIN string ON string_id=reference2 WHERE reference = 84808 ) vaccineCode ON vaccineCode_parent=row_id \n LEFT JOIN (SELECT value text_Narrative_22, parent text_Narrative_parent, doc_id text_Narrative_id FROM doc text_Narrative\n LEFT JOIN string ON string_id=doc_id WHERE reference = 372927 ) text_Narrative ON text_Narrative_parent=row_id ",
            "rowId": "row_id",
            "parentId": "table_id"
        }

        // SELECT row.* ,  vaccineCode_22, r2_vaccineCode_id,  vaccineCode_id  FROM (SELECT patient_Patient_parent table_id, patient_Patient_id row_id, r2_patient_Patient_id,  patient_Patient_id  FROM (SELECT reference2 r2_patient_Patient_id, parent patient_Patient_parent, doc_id patient_Patient_id FROM doc patient_Patient WHERE reference = 373792 ) row) row
        //    LEFT JOIN(SELECT value vaccineCode_22, reference2 r2_vaccineCode_id, parent vaccineCode_parent, doc_id vaccineCode_id FROM doc vaccineCode
        //    LEFT JOIN string ON string_id = reference2 WHERE reference = 84808) vaccineCode ON vaccineCode_parent = row_id

        // END: buildSqlApp - sql_app.TableRow2Adn_373791 

        sql_app.ImmunusationEncounterPatient = {
            name: 'Імунізація взаємодія пацієнт',
            sql: 'SELECT * FROM (:sql_app.TableRow2Adn_373794 ) im \n\
            , (:sql_app.TableA1Row2Adn_373784 ) ee \n\
            WHERE ee.subject_patient_id=im.r2_encounter_encounter_id ',
            patientIdName: 'r2_subject_patient_id',
        }

        sql_app.TableRow2Adn_373794 = {
            "sql": "SELECT row.* , vaccineCode_22, r2_vaccineCode_id,  vaccineCode_id ,  text_Narrative_22,  text_Narrative_id \n\
             FROM (SELECT encounter_Encounter_parent table_id, encounter_Encounter_id row_id, r2_encounter_Encounter_id,  encounter_Encounter_id \n\
             FROM (SELECT reference2 r2_encounter_Encounter_id, parent encounter_Encounter_parent, doc_id encounter_Encounter_id \n\
             FROM doc encounter_Encounter WHERE reference = 373793 ) row) row \n\
              LEFT JOIN (SELECT value vaccineCode_22, reference2 r2_vaccineCode_id, parent vaccineCode_parent, doc_id vaccineCode_id \n\
             FROM doc vaccineCode LEFT JOIN string ON string_id=reference2 WHERE reference = 84808 ) vaccineCode ON vaccineCode_parent=row_id \n\
             LEFT JOIN (SELECT value text_Narrative_22, parent text_Narrative_parent, doc_id text_Narrative_id FROM doc text_Narrative \n\
             LEFT JOIN string ON string_id=doc_id WHERE reference = 372927 ) text_Narrative ON text_Narrative_parent=row_id ",
            "rowId": "row_id",
            "parentId": "table_id"
        }
        // SELECT row.* ,  vaccineCode_22, r2_vaccineCode_id,  vaccineCode_id  FROM (SELECT encounter_Encounter_parent table_id, encounter_Encounter_id row_id, r2_encounter_Encounter_id,  encounter_Encounter_id  FROM (SELECT reference2 r2_encounter_Encounter_id, parent encounter_Encounter_parent, doc_id encounter_Encounter_id FROM doc encounter_Encounter WHERE reference = 373793 ) row) row
        //    LEFT JOIN (SELECT value vaccineCode_22, reference2 r2_vaccineCode_id, parent vaccineCode_parent, doc_id vaccineCode_id FROM doc vaccineCode
        //    LEFT JOIN string ON string_id=reference2 WHERE reference = 84808 ) vaccineCode ON vaccineCode_parent=row_id 


        // END: buildSqlApp - sql_app.TableRow2Adn_373794 

        sql_app.EncounterEpisodeOfCare = {
            name: 'Взаємодія Епізоди паціента',
            patientIdName: 'r2_subject_patient_id',
            sql: ':sql_app.TableA1Row2Adn_373784 ',
        }

        sql_app.TableA1Row2Adn_373784 = { // buildSqlApp - sql_app.TableA1Row2Adn_373784 
            "columns": {
                "373785": {
                    "sqlName": "AdnSql"
                },
                "373786": {
                    "sqlName": "R2ValueSql"
                }
            },
            "sql": "SELECT * FROM (SELECT subject_Patient_parent table_id, subject_Patient_id row_id, r2_subject_Patient_id,  subject_Patient_id  FROM (SELECT reference2 r2_subject_Patient_id, parent subject_Patient_parent, doc_id subject_Patient_id FROM doc subject_Patient WHERE reference = 373432 ) row\n ) row :fn_sql_app.autoSql.joinColumnsSql(TableA1Row2Adn_373784.columns) "
        }

        // SELECT * FROM (SELECT subject_Patient_parent table_id, subject_Patient_id row_id, r2_subject_Patient_id,  subject_Patient_id  FROM (SELECT reference2 r2_subject_Patient_id, parent subject_Patient_parent, doc_id subject_Patient_id FROM doc subject_Patient WHERE reference = 373432 ) row
        //   ) row :fn_sql_app.autoSql.joinColumnsSql(TableA1Row2Adn_373784.columns) 

        sql_app.AdnSql_373785 = {
            "sql": "SELECT reference2 r2_episodeOfCare_EpisodeOfCare_id, parent episodeOfCare_EpisodeOfCare_parent, doc_id episodeOfCare_EpisodeOfCare_id FROM doc episodeOfCare_EpisodeOfCare WHERE reference = 373446 ",
            "rowId": "episodeOfCare_EpisodeOfCare_id",
            "parentId": "episodeOfCare_EpisodeOfCare_parent",
            "colName": "episodeOfCare_EpisodeOfCare",
            "columnNames": "episodeOfCare_EpisodeOfCare_id, r2_episodeOfCare_EpisodeOfCare_id"
        }
        sql_app.R2ValueSql_373786 = {
            "rowId": "period_start_id",
            "parentId": "period_start_parent",
            "colName": "period_start",
            "sql": "SELECT v.value period_start_25, d.doc_id period_start_id, d.parent period_start_parent FROM doc r2, doc d \nLEFT JOIN timestamp v ON v.timestamp_id=d.doc_id \n WHERE d.reference2=368679 AND d.reference=373442 AND r2.doc_id=d.reference2"
        }

        // END: buildSqlApp - sql_app.TableA1Row2Adn_373784 


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