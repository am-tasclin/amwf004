'use strict'
sql_app.group = {}

sql_app.group.gp_ADN02 = {
    name: 'ADN SQL collection',
    add: () => {
        sql_app.group.gp_ADN01.add()
        sql_app.SelectADN.sql = sql_app.SelectADN.sql
            .replace('FROM tese.', 'FROM ')

        sql_app.autoSql = {
            name: 'зганарувати SQL через клік і зміст моделера даних',

            sql: 'SELECT :col.virtualTableName.* \n\
                FROM doc :doc.virtualTableName WHERE parent = :param.parent ',

            rowSql: 'SELECT d.doc_id row_id, d.parent table_id, d.* \n\
                FROM doc d LEFT JOIN string ON string_id=doc_id \n\
                WHERE reference=:rowPattern.reference ',

            createRowSql: (param) => {
                let rowPattern = conf.eMap[conf.parentChild[param.parent][0]]
                let createTable = conf.eMap[conf.eMap[param.parent].reference2]

                let rowFieldName = rowPattern.r_value_22 || rowPattern.rr_value_22
                rowFieldName = createTable.value_22 + '_' + rowFieldName

                // console.log(rowPattern)
                // console.log(rowFieldName + '\n', sql_app.autoSql.rowSql)
                let rowSql = sql_app.autoSql.rowSql
                    .replace(':rowPattern.reference', rowPattern.reference)
                // console.log(rowSql)
                let rowFields = 'value ' + rowFieldName
                    + ', d.doc_id ' + rowFieldName + '_id'
                // console.log(rowFields, 1)
                rowSql = rowSql
                    .replace('SELECT d.', 'SELECT ' + rowFields + ', d.')
                    .replace(', d.*', '')
                    + ' AND d.parent=' + param.parent
                // console.log(rowSql)
                return rowSql
            },

            create: (param) => {
                console.log(param)
                let createTable = conf.eMap[conf.eMap[param.parent].reference2]
                let virtualTableName = createTable.value_22
                console.log(virtualTableName)

                let rowSql = sql_app.autoSql.createRowSql(param)
                console.log(rowSql)

                sql = sql_app.autoSql.sql
                    .replace(':param.parent', param.parent)
                    .replace(':col.virtualTableName', virtualTableName)
                    .replace(':doc.virtualTableName', virtualTableName)

                console.log(sql)
                sql = sql.replace(' WHERE'
                    , '\n LEFT JOIN (' + rowSql
                    + ') row ON row.row_id=' + virtualTableName + '.doc_id \n WHERE')
                    .replace(virtualTableName + '.*', 'row.*')
                console.log(sql)
            },

        }
    }
}

sql_app.group.gp_ADN01 = {
    name: 'ADN SQL collection',
    add: () => {
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
        return true
    }
}

sql_app.group.gp_002 = {
    name: 'Друга група назва потім',
    add: () => {
        sql_app.group.gp_ADN01.add()

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
        sql_app.SelectADNx = {
            name: 'Зчитати абстрактий вузел - test',
            sql: 'SELECT d.*, s.value value_22 FROM doc d \n\
            LEFT JOIN string s ON s.string_id=doc_id',
            rowId: 'doc_id',
        }
        return true
    }
}

sql_app.group.gp_TeseCOVID19 = {
    name: 'Tese-COVID19 SQL collection',
    add: () => {
        conf.ontology_link = '/f/c/11/eh004.html?doc2doc='
        sql_app.group.gp_ValueSet.add()

        sql_app.Range_lhall = {
            name: 'Діапазон всі нижчий-вищий в БД',
            sql: 'SELECT l.doc_id l_id \n\
            , lq.quantity_value lq_quantity_value, lq.quantity_code lq_quantity_code \n\
            , h.doc_id h_id, hq.quantity_value hq_quantity_value, hq.quantity_code hq_quantity_code \n\
            FROM doc l \n\
            LEFT JOIN ( :sql_app.Quantity_all ) lq ON lq.quantity_id=l.reference2 \n\
            , doc h \n\
            LEFT JOIN ( :sql_app.Quantity_all ) hq ON hq.quantity_id=h.reference2 \n\
            WHERE l.reference=368668 AND l.doc_id=h.parent',
        }

        sql_app.MedicationRequest_003_covid = {
            name: 'Призначення ліків 003 (тест COVID)',
            sql: 'SELECT mr.doc_id mr_id, m.value medication_code, di.doc_id di_id \n\
            , dq.dosequantity_id, dq.quantity_valuef, dq.quantity_code, dq.value \n\
            FROM doc mr \n\
            LEFT JOIN ( :sql_app.Medication_code_all ) m ON m.doc_id=mr.reference2 \n\
            LEFT JOIN doc di ON di.parent=mr.doc_id AND di.reference=369984 \n\
            LEFT JOIN ( :sql_app.DoseQuantity_all ) dq ON dq.dosequantity_id=di.reference2 \n\
            WHERE mr.reference=371469',
        }

        sql_app.DoseQuantity_all = {
            name: 'Кількістні дози - всі які є в БД',
            sql: 'SELECT doseAndRate.parent doseAndRate_parent \n\
            , doseQuantity.doc_id doseQuantity_id \n\
            , quantity_value, quantity_valuef, quantity_code \n\
            , dda.* \n\
             FROM doc doseAndRate \n\
            LEFT JOIN ( :sql_app.DosageData_all \n\
            ) dda ON dda.dosage_id=doseAndRate.parent , doc doseQuantity \n\
            LEFT JOIN ( :sql_app.Quantity_all  \n\
            ) qd ON qd.doc_id=doseQuantity.reference2 \n\
            WHERE 	doseQuantity.reference=369975 \n\
            AND doseAndRate.doc_id=doseQuantity.parent',
        }

        sql_app.Quantity_all = {
            name: 'Кількості - всі які є в БД',
            sql: 'SELECT i.value quantity_value, f.value quantity_valuef, quantityCode.value quantity_code, quantityCode.reference2 quantity_code_id, quantityNum.doc_id quantity_id \n\
            , quantityNum.* FROM doc quantityNum \n\
            LEFT JOIN integer i ON i.integer_id=quantityNum.doc_id \n\
            LEFT JOIN double f ON f.double_id=quantityNum.doc_id \n\
            LEFT JOIN ( SELECT d.*, value FROM doc d,string WHERE reference2=string_id \n\
            ) quantityCode ON quantityCode.parent=quantityNum.doc_id AND quantityCode.reference = 368641 \n\
            WHERE quantityNum.reference=368637',
        }

        sql_app.DosageData_all = {
            name: 'Всі абстрактні дози в БД',
            sql: 'SELECT d.doc_id dosage_id, s.*, dar.doc_id dosageandrate_id  \n\
            FROM  string s, sort, doc d \n\
            LEFT JOIN doc dar ON dar.parent=d.doc_id AND dar.reference=369972 \n\
            WHERE d.doc_id=string_id AND d.parent = 369981 \n\
            AND d.doc_id=sort_id \n\
            ORDER BY sort',
            ontology_link_param: '369981,369981',
        }

        sql_app.DCC_vaccine_clinic001 = {
            name: 'DCC Вакцина клінічна частина 001',
            sql: 'SELECT d1.doc_id, s1.value name4warehouse \n\
            , s2.value quantity_per_dose, d2.doc_id name4warehouse_id \n\
            , s3.value unit_of_dose, d3.doc_id unit_of_dose_id \n\
            FROM doc d1 \n\
            LEFT JOIN string s1 ON d1.reference2=s1.string_id \n\
            LEFT JOIN doc d2 ON d1.doc_id=d2.parent AND d2.reference=373368 \n\
            LEFT JOIN string s2 ON s2.string_id=d2.doc_id \n\
            LEFT JOIN doc d3 ON d1.doc_id=d2.parent AND d3.reference=373366 \n\
            LEFT JOIN string s3 ON s3.string_id=d3.reference2 \n\
            where d1.reference = 373365',
        }

        sql_app.Medication_code_all = {
            name: 'Всі медикаменти по коду',
            sql: 'SELECT * FROM doc \n\
            LEFT JOIN string ON reference2=string_id \n\
            where reference = 371306',
        }

        return true
    }
}

sql_app.group.gp_MedicationRequest = {
    name: 'SQL collection - Призначення ліків',
    add: () => {

        sql_app.Quantity = {
            name: 'Кількість',
            sql: 'SELECT i.value quantity_value, f.value quantity_valuef, quantityCode.value quantity_code, quantityCode.reference2 quantity_code_id, quantityNum.doc_id quantity_id  \n\
            , quantityNum.* FROM doc quantityNum \n\
            LEFT JOIN integer i ON i.integer_id=quantityNum.doc_id \n\
            LEFT JOIN double f ON f.double_id=quantityNum.doc_id \n\
            LEFT JOIN ( SELECT d.*, value FROM doc d,string WHERE reference2=string_id \n\
            ) quantityCode ON quantityCode.parent=quantityNum.doc_id AND quantityCode.reference = 368641 \n\
            WHERE quantityNum.reference=368637 AND quantityNum.reference2=368636',
        }

        sql_app.Ratio = {
            name: 'Співвідношення',
            sql: 'SELECT n.quantity_value n_quantity_value, n.quantity_code n_quantity_code  \n\
            , numerator.doc_id  ratio_id, numerator.doc_id  numerator_id, numerator.reference2 n_quantity_id --, n.*  \n\
            , dn.quantity_value dn_quantity_value, dn.quantity_code dn_quantity_code --, dn.* \n\
            , denominator.doc_id denominator_id, denominator.reference2 dn_quantity_id --, denominator.* \n\
            FROM doc numerator \n\
            LEFT JOIN ( :sql_app.Quantity ) n ON n.doc_id= numerator.reference2 \n\
            LEFT JOIN doc denominator \n\
            LEFT JOIN ( :sql_app.Quantity ) dn ON dn.doc_id= denominator.reference2 \n\
            ON denominator.parent = numerator.doc_id \n\
            WHERE  numerator.reference = 368676',
        }

        sql_app.Substance_code = {
            name: 'Субстанція код',
            sql: 'SELECT value substance_code, d.doc_id substance_id \n\
            FROM doc d, string \n\
            WHERE reference = 370024 AND string_id=reference2',
        }

        sql_app.Medication_sc = {
            name: 'Медикамент субстанція',
            sql: 'SELECT d.doc_id medication_id, item.doc_id item_id, strength.doc_id strength_ratio_id, substance.*, ratio.* FROM doc d \n\
            LEFT JOIN (SELECT * FROM doc,sort WHERE doc_id=sort_id AND sort=1) item \n\
            LEFT JOIN (:sql_app.Substance_code ) substance ON substance_id=item.reference2 \n\
            LEFT JOIN doc strength \n\
            LEFT JOIN (:sql_app.Ratio ) ratio ON ratio.numerator_id=strength.reference2 \n\
            ON strength.parent=item.doc_id \n\
            ON item.parent=d.doc_id \n\
            WHERE d.reference=369998 and d.reference2=369993',
        }

        return true
    }

}
sql_app.group.gp_PWS01 = {
    name: 'SQL collection 01 - Physician work station',
    add: () => {
        sql_app.group.gp_MedicationRequest.add()
        sql_app.group.gp_ValueSet.add()

        sql_app.encounter_MedicationRequest_sc_doseQuantityTimingPeriod = {
            name: 'ЕМЗ Взаємодія призначення ліків доза кількість хронометраж період',
            sql: 'SELECT mrbn.doc_id mrEncounter_id, mrbn.parent mr_emr_id, mrbn.reference2 basedOn, mrer.reference2 mrEncounter_r2 \n\
            , 368833 el_def_id, 373464 el_att_def_id \n\
            , er.reference2 patient_id, mr.* FROM doc mrer \n\
            LEFT JOIN doc mrbn ON mrbn.parent=mrer.doc_id AND mrbn.reference=369777 \n\
            LEFT JOIN doc er ON er.doc_id=mrer.reference2 \n\
            , (:sql_app.MedicationRequest_sc_doseQuantityTimingPeriod ) mr \n\
            WHERE mrer.reference = 373464 AND mrbn.reference2 = mr.medicationrequest_id',
        }

        sql_app.MedicationRequest_sc_doseQuantityTimingPeriod = {
            name: 'Призначення ліків доза кількість хронометраж період',
            rowId: 'medicationrequest_id',
            sql: 'SELECT x.*, dqtp.*, esd.*, di.* FROM (:sql_app.MedicationRequest_sc ) x \n\
            LEFT JOIN (SELECT di_c.parent di_c_p, di.reference di_r, di.reference2 di_r2 \n\
            FROM doc di_c, doc di WHERE di_c.reference=369984 AND di.parent=di_c.doc_id \n\
            ) di ON di_c_p=x.medicationrequest_id \n\
            LEFT JOIN (:sql_app.DoseQuantity_timingPeriod ) dqtp ON dqtp.dosage_id=di_r2 \n\
            LEFT JOIN (:sql_app.MedicationRequest_expectedSupplyDuration ) esd ON esd.parent_medicationrequest=medicationrequest_id',
        }

        sql_app.MedicationRequest_sc = {
            name: 'Призначення ліків субстанція',
            sql: 'SELECT d.doc_id medicationrequest_id, d.reference medicationrequest_r, medication.* FROM doc d \n\
            LEFT JOIN (:sql_app.Medication_sc ) medication \n\
            ON medication.medication_id=d.reference2 \n\
            WHERE d.reference=371469 ',
        }

        sql_app.DoseQuantity_timingPeriod = {
            name: 'Доза кількість, хронометраж період',
            rowId: 'dosage_id',
            sql: 'SELECT doseAndRate.parent doseAndRate_p, doseQuantity_id dosage_id, timing.doc_id dosage_timing_id, dq.*, tp.* \n\
            FROM (:sql_app.DoseQuantity ) dq \n\
                , (SELECT * FROM doc doseAndRate WHERE doseAndRate.reference=369972) doseAndRate \n\
                LEFT JOIN doc timing \n\
                LEFT JOIN (:sql_app.Timing_period \n\
                ) tp ON tp.period_id=timing.reference2 \n\
                ON timing.reference=369970 AND timing.parent=doseAndRate.parent \n\
                WHERE doseAndRate.doc_id=dq.dosageandrate_id',
        }
        sql_app.DoseQuantity = {
            name: 'Доза кількість',
            sql: 'SELECT quantity_value, quantity_code, quantity_id, doseQuantity.doc_id doseQuantity_id, doseQuantity.parent dosageandrate_id \n\
            FROM doc doseQuantity \n\
            LEFT JOIN (:sql_app.Quantity ) q ON q.doc_id=doseQuantity.reference2 \n\
            WHERE doseQuantity.reference=369975',
        }

        sql_app.MedicationRequest_expectedSupplyDuration = {
            name: 'Призначення ліків з тривалістью',
            sql: 'SELECT expectedsupplyduration.doc_id expectedsupplyduration_id \n\
            , duration.* \n\
            , expectedsupplyduration.parent  parent_medicationRequest \n\
            , expectedsupplyduration.doc_id duration_id \n\
            FROM  doc  expectedSupplyDuration \n\
            LEFT JOIN (:sql_app.Duration ) duration ON duration_id = expectedsupplyduration.reference2 \n\
            WHERE expectedsupplyduration.reference = 373051',
        }
        sql_app.Duration = {
            name: 'Тривалість',
            sql: 'SELECT s.value duration_s, s2.value unit, duration.doc_id duration_id, durationunit.reference2 unit_id, durationunit.doc_id durationunit_id \n\
            FROM doc durationunit \n\
            LEFT JOIN string s2 ON s2.string_id =durationunit.reference2 \n\
            , doc duration \n\
            LEFT JOIN string s ON s.string_id =duration.doc_id \n\
            WHERE duration.reference = 373042 AND durationunit.parent = duration.doc_id ',
        }

        sql_app.Timing_period = {
            name: 'Хронометраж період',
            sql: 'SELECT period.doc_id timing_id,  period.doc_id period_id, pi.value period, pu.value periodUnit \n\
            FROM doc period \n\
            LEFT JOIN integer pi ON pi.integer_id=period.doc_id \n\
            LEFT JOIN doc periodUnit \n\
            LEFT JOIN string pu ON pu.string_id=periodUnit.reference2 \n\
            ON periodUnit.parent=period.doc_id AND periodUnit.reference=368863 \n\
            WHERE period.reference=368861',
        }

        sql_app.ICPC2_ua = {
            name: 'ICPC2 українською',
            limit: 1000,
            sql: 'SELECT d.doc_id code_id, su.value code, sua.value i18n, dua.doc_id ua_id \n\
            FROM doc dp, doc d \n\
            LEFT JOIN string s ON s.string_id=d.doc_id \n\
            LEFT JOIN string_u su ON su.string_u_id=d.doc_id \n\
            LEFT JOIN doc dua \n\
                LEFT JOIN string sua ON sua.string_id=dua.doc_id \n\
            ON dua.reference=d.doc_id \n\
            WHERE dp.doc_id=d.parent AND dp.parent=285598 AND dua.parent=285597',
        }

        sql_app.Encounter_Patient = {
            name: 'Взаємодія',
            sql: 'SELECT d.doc_id encounter_id, d.reference2 patient_id \n\
            , p.doc_id period_id, tsps.value tsps_v \n\
            , r.doc_id reason_id, c.code_id reason_code_id, c.code reason_code, c.i18n reason_i18n \n\
            , dgCondition.doc_id dgCondition_id, cd.code_id dgcondition_code_id, c.code dgcondition_code, c.i18n dgcondition_i18n \n\
            , episodeOfCare.doc_id episodeOfCare_id \n\
            , episodeOfCare.reference2 episodeOfCare_r2 \n\
            FROM doc d \n\
            LEFT JOIN doc dgCondition \n\
                LEFT JOIN (:sql_app.ICPC2_ua ) cd ON cd.code_id = dgCondition.reference2 \n\
            ON dgCondition.parent=d.doc_id AND dgCondition.reference=373444 \n\
            LEFT JOIN doc episodeOfCare \n\
            ON episodeOfCare.parent=d.doc_id AND episodeOfCare.reference=373446 \n\
            LEFT JOIN doc p \n\
                LEFT JOIN timestamp tsps ON tsps.timestamp_id=p.doc_id \n\
            ON p.parent=d.doc_id AND p.reference=373442 \n\
            LEFT JOIN doc r \n\
                LEFT JOIN (:sql_app.ICPC2_ua ) c ON c.code_id=r.reference2 \n\
            ON r.parent=d.doc_id AND r.reference=373436 \n\
            WHERE d.reference=373432',
            sqlHtml: {
                tsps_v: "{{r.tsps_v | date : 'medium'}}",
            }
        }

        sql_app.EpisodeOfCare_Patient = {
            name: 'Епізод',
            sql: 'SELECT ee.doc_id episode_id, ee.reference2 patient_id, \n\
            tsps.value tsps_v, ps.doc_id tsps_id, \n\
            dmTitle.doc_id dmTitle_id, tst.value dmTitle \n\
            FROM doc ee \n\
            LEFT JOIN doc ps \n\
                LEFT JOIN timestamp tsps ON tsps.timestamp_id=ps.doc_id \n\
            ON ps.parent=ee.doc_id AND ps.reference2=368679 \n\
            LEFT JOIN doc dmTitle \n\
                LEFT JOIN string tst ON tst.string_id=dmTitle.doc_id \n\
            ON dmTitle.parent=ee.doc_id AND dmTitle.reference=372927 \n\
            WHERE ee.reference=368896',
        }

        sql_app.Patient_family_name = {
            name: 'Пацієнти',
            sql: 'SELECT p.doc_id patient_id, hn.* FROM doc p \n\
            LEFT JOIN (:sql_app.HumanName_family_name ) hn ON hn.family_id = p.reference2  \n\
            WHERE p.reference=373423',
        }
        sql_app.HumanName_family_name = {
            name: "Ім'я Призвище",
            sql: 'SELECT n.value name_v, f.value family_v, d.doc_id family_id, dn.doc_id name_id FROM doc d \n\
            LEFT JOIN string f ON d.doc_id=f.string_id \n\
            LEFT JOIN doc dn ON d.doc_id=dn.parent AND dn.reference=372117 \n\
            LEFT JOIN string n ON dn.doc_id=n.string_id \n\
            WHERE d.reference = 372116',
        }
        return true
    }
}

sql_app.group.gp_ValueSet = {
    name: 'SQL collection - Зчитування набори значень',
    add: () => {

        sql_app.ValueSet_title01 = {
            name: 'Всі ValueSet в БД задані і зчитані по title полю',
            sql: 'SELECT value title,  d.* FROM doc d \n\
            LEFT JOIN string ON string_id=doc_id \n\
            WHERE reference=372045',
            sqlHtml: {
                doc_id: '<a href="#!/sql_ValueSet_values/valueset_id/=/{{r[k]}}">{{r[k]}}</a>',
            },
        }

        sql_app.ValueSet_title02 = {
            name: 'Всі ValueSet в БД задані і зчитані по title полю',
            sql: 'SELECT value title,  d.* FROM doc d \n\
            LEFT JOIN string ON string_id=doc_id \n\
            WHERE reference=372045',
            ontology_link_param: '369765,372041',
            sqlHtml: {
                doc_id: '<a href="#!/sql_ValueSet_values/valueset_id/=/{{r[k]}}">{{r[k]}}</a>',
            },
        }

        sql_app.ValueSet_title = {
            name: 'Тітель набору значень',
            sql: 'SELECT value vs_title, d.doc_id vs_title_id FROM doc d \n\
            LEFT JOIN string ON string_id=doc_id \n\
            where reference=372045',
            sqlHtml: {
                vs_title_id: '<a href="#!/sql_ValueSet_values/p/=/{{r[k]}}">{{r[k]}}</a>',
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
            ',
            /**
             ORDER BY p3.parent',
             */
            order: ' ORDER BY p3.parent ',
            sqlHtml: {
                valueset_id: '<a href="#!/sql/{{ctrl.conf.sqlKeyName}}/{{k}}/=/{{r[k]}}">{{r[k]}}</a>',
            },
        }

        sql_app.ValueSet_values02 = {
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

        sql_app.FHIR_Organization_name_alias = {
            name: "Організація ім'я і аліас",
            sql: 'SELECT s.value name_, sd.value alias, d.doc_id name_id, dd.doc_id alias_id, d.parent FROM doc d \n\
        LEFT JOIN sort ON sort_id=d.doc_id \n\
        LEFT JOIN string s ON s.string_id=d.doc_id \n\
        LEFT JOIN (SELECT * FROM doc WHERE reference = 373650) dd \n\
        LEFT JOIN string sd ON sd.string_id=dd.doc_id \n\
        ON dd.parent=d.doc_id \n\
        WHERE d.reference=371291 \n\
        ORDER BY sort'
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

        sql_app.FHIR_ValueSet_concept_code_display_uk = {
            name: '',
            sql: 'SELECT x.*, sl.value value_uk, dl.doc_id value_uk_id \n\
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

        return true
    }
}

sql_app.group.gp_PWS = {
    name: 'SQL collection - Physician work station',
    add: () => {
        sql_app.group.gp_ValueSet.add()
        sql_app.group.gp_PWS01.add()
        sql_app.FHIRs_Group = {
            name: 'Категорії ЦД - пропозиція під ТЗ Облік категорії пацієнта',
            sql: 'SELECT d.doc_id group_id, s.value group_name, sp.value datagroup , d.* FROM doc d \n\
            LEFT JOIN string s ON s.string_id=d.doc_id \n\
            LEFT JOIN string sp ON sp.string_id=d.parent \n\
            WHERE d.parent=373337',
            noShow: ['reference2', 'doctype'],
        }
        sql_app.FHIR_PlanDefinition = {
            name: 'Означення плана',
            sql: 'SELECT value, d.doc_id plandefinition_id \n\
            , d.doc_id pd_id, d.* FROM doc d \n\
            LEFT JOIN string ON string_id=doc_id \n\
            WHERE reference=371998', //☰ [371998]   name:371997 -  [368815] PlanDefinition
        }
        sql_app.PlanDefinition_action_title = {
            name: 'Означення плана активності заголовки',
            sql: 'SELECT value action_title, an7te.doc_id pd_action_id, an7te.doc_id title_id, an.parent pd_id \n\
            FROM doc an, sort s, doc an7te \n\
            LEFT JOIN string st ON st.string_id=an7te.doc_id \n\
            WHERE an7te.parent=an.doc_id AND an7te.reference=373452 \n\
            AND an.reference=369782 AND s.sort_id=an7te.doc_id ORDER BY s.sort',
        }
        sql_app.PD_Trigger_DataRequirement_type_path = {
            name: 'Сценарії-плани > tригери > необхідні дані тип шлях',
            sql: 'SELECT pdtr.doc_id pd_id, n.value pd_name, tdr.* FROM doc tr \n\
            LEFT JOIN doc trim \n\
            LEFT JOIN (:sql_app.Trigger_DataRequirement_type_path ) tdr ON tdr.triger_id=trim.reference2 \n\
            ON trim.parent=tr.doc_id \n\
            , doc pdtr \n\
            LEFT JOIN string n ON n.string_id=pdtr.doc_id \n\
            WHERE pdtr.reference=371998 AND tr.parent=pdtr.doc_id AND tr.reference=373479',
        }
        sql_app.Trigger_DataRequirement_type_path = {
            name: 'Тригери > необхідні дані тип шлях',
            sql: 'SELECT n.value tr_name, tdr.doc_id triger_id, dr.* FROM doc tdr \n\
            LEFT JOIN string n ON n.string_id=tdr.doc_id \n\
            LEFT JOIN doc td \n\
            LEFT JOIN (:sql_app.DataRequirement_type_path ) dr ON dr.dr_type_id=td.reference2 \n\
            ON td.parent=tdr.doc_id AND td.reference=369811 \n\
            WHERE tdr.reference=369820',
        }
        sql_app.DataRequirement_type_path = {
            name: 'Необхідні дані тип шлях',
            sql: 'SELECT dr.doc_id dr_type_id, dr.reference2 dr_type_def_id \n\
            , dp.doc_id dr_codeFilter_path_id, dp.reference2 codeFilter_path_def_id \n\
            FROM doc dr \n\
            LEFT JOIN doc dp ON dp.parent=dr.doc_id \n\
            WHERE dr.reference = 84929',
        }
        sql_app.action_task_1 = {
            name: 'активність і завдання перша реалізація',

            sql: 'SELECT * FROM (:sql_app.action_definitionCanonical ) a, \n\
            (:sql_app.task_instantiatesCanonical_InputValue ) t \n\
        WHERE t.definitionCanonical_id=a.definitionCanonical_id ',
            sqlHtml: {
                taskinputvalue: '<pre class="w3-small">{{r[k]}}</pre>',
            },

            readActionTask: (dataFactory, action_id) => {
                let sql = readSql2R('action_task_1')
                sql += ' AND action_id = ' + action_id
                // console.log(sql)
                // console.log(sql_app.action_task_1)
                dataFactory.httpGetSql({ sql: sql }
                ).then(dataSqlRequest => {
                    if (dataSqlRequest.list[0]) {
                        console.log(dataSqlRequest.list[0])
                        if (!sql_app.action_task_1.sqlCmdMap)
                            sql_app.action_task_1.sqlCmdMap = {}
                        sql_app.action_task_1.sqlCmdMap[dataSqlRequest.list[0].action_id]
                            = dataSqlRequest.list[0]
                        sql_app.action_task_1.sqlCmdMap[dataSqlRequest.list[0].action_id].js
                            = metal.init(dataSqlRequest.list[0].taskinputvalue)
                        console.log(sql_app.action_task_1.sqlCmdMap)
                    }
                })
            },

        }
        sql_app.task_instantiatesCanonical_InputValue = {
            name: 'завдання в сценарії -> дані команди вводу',
            sql: 'SELECT task.doc_id task_id, s1.value taskInputValue, taskInputValue.doc_id taskInputValue_id, task.reference2 definitionCanonical_id \n\
            FROM doc task LEFT JOIN doc taskInputValue \n\
              LEFT JOIN string s1 ON s1.string_id=taskInputValue.doc_id \n\
            ON taskInputValue.parent=task.doc_id AND taskInputValue.reference=371933 \n\
            WHERE task.reference=371927',
            sqlHtml: {
                taskinputvalue: '<pre class="w3-small">{{r[k]}}</pre>',
            },
        }
        sql_app.action_definitionCanonical = {
            name: 'акривність та визначенна команда',
            sql: 'SELECT action.doc_id action_id, definitionCanonical.doc_id definitionCanonical_id, s1.* \n\
            FROM doc action, doc definitionCanonical \n\
            LEFT JOIN string s1 ON s1.string_id=definitionCanonical.reference2 \n\
            WHERE definitionCanonical.reference=369920 \n\
            AND action.doc_id=definitionCanonical.parent',
        }
        sql_app.pd_action_ActivityDefinition_title_name = {
            name: 'Команда MeTaL комп\'ютерне і людське ім\'я -> в плані',
            sql: 'SELECT d1.doc_id pd_ad_id, d1.doc_id pd_action_ad_id, d1.parent, d3.parent pd_id, x.* \n\
            FROM doc d3, doc d2, doc d1 , (:sql_app.ActivityDefinition_title_name ) x \n\
            WHERE d1.reference=369920 \n\
            AND d2.doc_id=d1.parent AND d3.doc_id=d2.parent \n\
            AND x.am_title_id=d1.reference2 ',
        }
        sql_app.ActivityDefinition_title_name = {
            name: 'Команда MeTaL комп\'ютерне і людське ім\'я',
            sql: 'SELECT d1.doc_id am_title_id, s1.value ad_title \n\
            , d2.doc_id ad_name_id, s2.value ad_name --, * \n\
            FROM doc d1 LEFT JOIN string s1 ON s1.string_id=d1.doc_id \n\
            ,doc d2 LEFT JOIN string s2 ON s2.string_id=d2.doc_id \n\
            WHERE d1.doc_id=d2.parent \n\
            AND d1.reference=371999 AND d2.reference=373500 ',
        }
        sql_app.eReceptOfEMR = {
            name: 'еРецепти від лікарських призначень',
            sql: 'SELECT rx.*, emr.mrencounter_id, emr.mr_emr_id, emr.patient_id \n\
            FROM (:sql_app.encounter_MedicationRequest_sc_doseQuantityTimingPeriod ) emr \n\
            , (:sql_app.eRecept ) rx \n\
            WHERE rx.recept_basedon_id=emr.mr_emr_id',
        }
        sql_app.eRecept = {
            name: 'еРецепти',
            sql: 'SELECT d1.doc_id recept_id, d2.reference2 recept_basedon_id  \n\
            FROM doc d1,doc d2 \n\
            WHERE d1.doc_id=d2.parent \n\
            AND d2.reference=369777',
        }

        sql_app.EpisodeOfCare_AndPatient = {
            name: 'Епізод',
            sql: 'SELECT ee.doc_id episode_id, p.*, tsps.value tsps_v, ps.doc_id tsps_id FROM doc ee \n\
            LEFT JOIN (:sql_app.Patient_family_name ) p ON ee.reference2 = p.patient_id  \n\
            LEFT JOIN doc ps \n\
            LEFT JOIN timestamp tsps ON tsps.timestamp_id=ps.doc_id \n\
            ON ps.parent=ee.doc_id AND ps.reference2=368679 \n\
            WHERE ee.reference=368896',
        }

        sql_app.FHIRs_Resource_Structure = {
            name: 'FHIR Resource Structure',
            sql: 'SELECT * FROM ( \n\
                SELECT s1.value fr_name, s1r.value fr_type, s1r2.value fr_type2 \n\
                , d1.doc_id fr_id, d1.reference type_id, d1.reference2 type2_id , d1.parent p \n\
                FROM sort sd1, doc d1 \n\
                    LEFT JOIN string s1 ON s1.string_id=d1.doc_id \n\
                    LEFT JOIN string s1r ON s1r.string_id=d1.reference \n\
                    LEFT JOIN string s1r2 ON s1r2.string_id=d1.reference2 \n\
                WHERE  d1.doc_id=sd1.sort_id \n\
                ORDER BY sort) x',
            noShow: ['p'],
            sqlHtml: {
                fr_type: '<a href="#!/sql/FHIRs_Resource_Structure/p/=/{{r.type_id}}"> {{r[k]}} </a>',
                fr_type2: '<a href="#!/sql/FHIRs_Resource_Structure/p/=/{{r.type2_id}}"> {{r[k]}} </a>',
            },
        }
        sql_app.FHIRs_in_Folders = {
            name: 'FHIR елементи в папках-модулях',
            sql: 'SELECT s.value fr_name, d.doc_id fr_id, d.parent folder_id, sf.value folder_name \n\
            FROM doc f, sort fs, sort ds, doc d \n\
            LEFT JOIN string s ON s.string_id=d.doc_id \n\
            LEFT JOIN string sf ON sf.string_id=d.parent \n\
            WHERE f.parent=369765 AND d.reference !=369358 \n\
            AND d.parent=f.doc_id AND f.doctype=14 \n\
            AND fs.sort_id=f.doc_id AND ds.sort_id=d.doc_id AND s.value is not null \n\
            ORDER BY fs.sort,ds.sort',
            sqlHtml: {
                folder_name: '<i class="far fa-folder w3-small"></i> {{r[k]}}',
                fr_id: '<a href="#!/sql/FHIRs_Resource_Structure/p/=/{{r[k]}}">{{r[k]}}</a>',
            }
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

        return true
    }
}