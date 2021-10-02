'use strict'
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
    name:'Діапазон всі нижчий-вищий в БД',
    sql:'SELECT l.doc_id l_id \n\
    , lq.quantity_value lq_quantity_value, lq.quantity_code lq_quantity_code \n\
    , h.doc_id h_id, hq.quantity_value hq_quantity_value, hq.quantity_code hq_quantity_code \n\
    FROM doc l \n\
    LEFT JOIN ( :sql_app.Quantity_all ) lq ON lq.quantity_id=l.reference2 \n\
    , doc h \n\
    LEFT JOIN ( :sql_app.Quantity_all ) hq ON hq.quantity_id=h.reference2 \n\
    WHERE l.reference=368668 AND l.doc_id=h.parent',
}

sql_app.MedicationRequest_003_covid = {
    name:'Призначення ліків 003 (тест COVID)',
    sql:'SELECT mr.doc_id mr_id, m.value medication_code, di.doc_id di_id \n\
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
