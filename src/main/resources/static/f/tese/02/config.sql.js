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

sql_app.group.gp_001 = {
    name: 'Перша група назва потім',
    add: () => {
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
    },
}

sql_app.group.gp_002 = {
    name: 'Друга група назва потім',
    add: () => {
        sql_app.group.gp_ADN01.add()
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
        sql_app.ValueSet_title = {
            name: 'Всі ValueSet в БД задані і зчитані по title полю',
            sql: 'SELECT value title,  d.* FROM doc d \n\
            LEFT JOIN string ON string_id=doc_id \n\
            WHERE reference=372045',
            ontology_link_param: '369765,372041',
            sqlHtml: {
                doc_id: '<a href="#!/sql/ValueSet_values/valueset_id/=/{{r[k]}}">{{r[k]}}</a>',
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
            ORDER BY p3.parent',
            sqlHtml: {
                valueset_id: '<a href="#!/sql/{{ctrl.conf.sqlKeyName}}/{{k}}/=/{{r[k]}}">{{r[k]}}</a>',
            },
        }

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

