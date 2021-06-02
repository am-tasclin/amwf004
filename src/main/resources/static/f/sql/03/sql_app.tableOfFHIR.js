'use strict';
sql_app.tableOfFHIR_CarePlan_plannedActivityReference_mr = () => {
    let sql = 'SELECT activity.parent activity_cp, activity.doc_id activity_id, par.doc_id par_id, par.reference2 par_r2 \n\
    FROM doc activity, doc par \n\
    WHERE par.parent=activity.doc_id AND activity.reference=368789'
    sql = 'SELECT * FROM (' + sql + ' ) x \n\
    LEFT JOIN (:sql_app.tableOfFHIR_MedicationRequest_sc_doseQuantityTimingPeriod ) y ON y.medicationrequest_id=par_r2'
    return sql
}
sql_app.tableOfFHIR_CarePlan = () => {
    let sql = 'SELECT d.doc_id careplan_id, value FHIR_DomainResource, d.parent, a.doc_id activity_id FROM doc d \n\
    LEFT JOIN doc a ON a.parent=d.doc_id AND a.reference=368789 \n\
    LEFT JOIN string ON string_id=d.doc_id \n\
    WHERE 372080 IN (d.reference)'
    return sql
}
sql_app.tableOfFHIR_dosageData = () => {
    let sql = 'SELECT d.doc_id dosage_id, s.*, dar.doc_id dosageandrate_id FROM  string s, doc d \n\
    LEFT JOIN doc dar ON dar.parent=d.doc_id AND dar.reference=369972 \n\
    WHERE d.doc_id=string_id AND d.parent = 369981'
    return sql
}
sql_app.tableOfFHIR_doseQuantity_timingPeriod = () => {
    let sql = 'SELECT doseQuantity_id dosage_id, dq.*, tp.* FROM (:sql_app.tableOfFHIR_doseQuantity \n\
        ) dq, (SELECT * FROM doc doseAndRate WHERE doseAndRate.reference=369972) doseAndRate \n\
        LEFT JOIN doc timing \n\
        LEFT JOIN (:sql_app.tableOfFHIR_Timing_period \n\
        ) tp ON tp.period_id=timing.reference2 \n\
        ON timing.reference=369970 AND timing.parent=doseAndRate.parent \n\
        WHERE doseAndRate.doc_id=dosageandrate_id'
    return sql
}
sql_app.tableOfFHIR_Goal001 = () => {
    let sql = 'SELECT goal.doc_id goal_id, s.value g_text, ou.* \n\
	FROM doc goal \n\
    LEFT JOIN string s ON s.string_id = goal.doc_id \n\
    LEFT JOIN (:sql_app.tableOfFHIR_observationUse ) ou ON observation_use_parent = goal.doc_id \n\
    WHERE goal.reference =372927'
    return sql
}
sql_app.tableOfFHIR_observationUse = () => {
    let sql = 'select d.parent observation_use_parent, observation.* \n\
    FROM doc d , (:sql_app.tableOfFHIR_Observation_valueQuantity002 ) observation \n\
    WHERE observation_id=d.reference2 '
    return sql
}
sql_app.tableOfFHIR_CarePlan_Goal = () => {
    let sql = 'SELECT * FROM (:sql_app.tableOfFHIR_CarePlan_Goal_id ) goalId \n\
    LEFT JOIN (:sql_app.tableOfFHIR_Goal001 ) goal ON goal.goal_id = goalId.goal_id'
    return sql
}
sql_app.tableOfFHIR_CarePlan_Goal_id = () => {
    let sql = 'SELECT cpgoal.parent careplan_id, goal.reference2 goal_id \n\
    FROM doc cpgoal, doc goal WHERE goal.parent=cpgoal.doc_id and cpgoal.reference=373017'
    return sql
}
sql_app.tableOfFHIR_ValueSet_observation_codes = () => {
    let sql = 'SELECT * FROM doc where reference=372051 and parent = 372971'
    return sql
}
sql_app.tableOfFHIR_doseQuantity = () => {
    let sql = 'SELECT quantity_value, quantity_code, quantity_id, doseQuantity.doc_id doseQuantity_id, doseQuantity.parent dosageandrate_id \n\
    FROM doc doseQuantity \n\
    LEFT JOIN (:sql_app.tableOfFHIR_Quantity ) q ON q.doc_id=doseQuantity.reference2 \n\
    WHERE doseQuantity.reference=369975'
    return sql
}
sql_app.tableOfFHIR_valueQuantity = () => {
    let sql = 'SELECT f1.value valueQuantity_f, s3.value vU, valueQuantity.doc_id valueQuantity_id, comparator, comparator_id, valueQuantity.parent valueQuantity_parent \n\
    FROM doc valueQuantity \n\
    LEFT JOIN double f1 ON f1.double_id=valueQuantity.doc_id \n\
    LEFT JOIN string s3 ON s3.string_id=valueQuantity.reference2 \n\
    LEFT JOIN (:sql_app.tableOfFHIR_comparator ) comparator ON comparator_parent=valueQuantity.doc_id \n\
    where valueQuantity.reference=368634'
    return sql
}
sql_app.tableOfFHIR_Observation_valueQuantity002 = () => {
    let sql = 'SELECT observation.doc_id observation_id, valuesetObName.*, valueQuantity.*, referenceRange.doc_id referenceRange_id FROM doc observation \n\
    LEFT JOIN (:sql_app.tableOfFHIR_ValueSet_cd ) valuesetObName ON valuesetObName.code_id=observation.reference2 \n\
    LEFT JOIN (:sql_app.tableOfFHIR_valueQuantity ) valueQuantity ON valuequantity_parent=observation.doc_id \n\
    LEFT JOIN doc referenceRange ON observation.doc_id=referenceRange.parent AND referenceRange.reference=372987 \n\
    WHERE observation.reference=368605 AND observation.reference2 \n\
    IN (SELECT doc_id FROM (:sql_app.tableOfFHIR_ValueSet_observation_codes )x)'
    return sql
}
sql_app.tableOfFHIR_Observation_valueQuantity = () => {
    let sql = 'SELECT observation.doc_id observation_id, valuesetObName.*, f1.value valueQuantity_f, s3.value vU, valueQuantity.doc_id valueQuantity_id, referenceRange.doc_id referenceRange_id \n\
    FROM doc observation \n\
    LEFT JOIN (:sql_app.tableOfFHIR_ValueSet_cd ) valuesetObName ON valuesetObName.code_id=observation.reference2 \n\
    LEFT JOIN doc valueQuantity ON valueQuantity.parent=observation.doc_id \n\
    LEFT JOIN double f1 ON f1.double_id=valueQuantity.doc_id \n\
    LEFT JOIN string s3 ON s3.string_id=valueQuantity.reference2 \n\
    LEFT JOIN doc referenceRange ON observation.doc_id=referenceRange.parent AND referenceRange.reference=372987 \n\
    WHERE observation.reference=368605 AND observation.reference2 \n\
    IN (SELECT doc_id FROM (:sql_app.tableOfFHIR_ValueSet_observation_codes )x)'
    return sql
}
sql_app.tableOfFHIR_ValueSet_cd = () => {
    let sql = 'SELECT s1.value code, code.doc_id code_id, s2.value display, display.doc_id display_id FROM doc code \n\
    LEFT JOIN string s1 ON s1.string_id=code.doc_id \n\
    LEFT JOIN doc display ON display.parent=code.doc_id \n\
    LEFT JOIN string s2 ON s2.string_id=display.doc_id \n\
    WHERE code.reference=372051'
    return sql
}
sql_app.tableOfFHIR_Observetion_referenceRange = () => {
    let sql = 'SELECT vscd.*, onrr.*, orr.* FROM ( \n\
        SELECT observation.doc_id observation_id, observation.reference2 observation_r2, referenceRange.doc_id referenceRange_id \n\
            FROM doc observation, doc referenceRange \n\
            WHERE observation.reference=368605 AND observation.reference2=372972 \n\
            AND observation.doc_id=referenceRange.parent AND referenceRange.reference=372987 \n\
            ) orr \n\
            LEFT JOIN (:sql_app.tableOfFHIR_on_referenceRange ) onrr ON onrr.referenceRange_id=orr.referenceRange_id \n\
            LEFT JOIN (:sql_app.tableOfFHIR_ValueSet_cd ) vscd ON vscd.code_id=orr.observation_r2'
    return sql
}
sql_app.tableOfFHIR_labor_constant = () => {
    let sql ='SELECT f.value val_f, s.value unit, val_id, unit_id \n\
    FROM ( SELECT val.doc_id val_id, unit.doc_id unit_id, unit.reference2 unit_r2 \n\
            FROM doc val, doc unit \n\
            WHERE val.reference=368637  AND unit.reference=368641 AND val.parent=372980 \n\
            AND val.doc_id=unit.parent \n\
            ) vu \n\
            LEFT JOIN double f ON f.double_id=val_id \n\
            LEFT JOIN string s ON s.string_id=unit_r2'
    return sql
}
sql_app.tableOfFHIR_on_referenceRange = () => {
    let sql ='SELECT low.val_f low_val_f, low.unit low_unit, higth.val_f higth_val_f, higth.unit higth_unit, rr.* \n\
    FROM ( SELECT type.doc_id type_id, type.reference2 type_r2, type.parent referenceRange_id \n\
        , low.doc_id low_id, low.reference2 low_r2, higth.doc_id higth_id, higth.reference2 higth_r2 \n\
        FROM doc type, doc low, doc higth \n\
        WHERE type.reference= 372990 AND low.parent=type.doc_id AND higth.parent=type.doc_id \n\
        AND low.reference= 372988 AND higth.reference= 372989  \n\
        ) rr \n\
        LEFT JOIN (:sql_app.tableOfFHIR_labor_constant ) low  ON low.val_id=low_r2 \n\
        LEFT JOIN (:sql_app.tableOfFHIR_labor_constant ) higth  ON higth.val_id=higth_r2'
    return sql
}
sql_app.tableOfFHIR_Timing_period = () => {
    let sql = 'SELECT period.doc_id timing_id,  period.doc_id period_id, pi.value period, pu.value periodUnit \n\
    FROM doc period \n\
    LEFT JOIN integer pi ON pi.integer_id=period.doc_id \n\
    LEFT JOIN doc periodUnit \n\
    LEFT JOIN string pu ON pu.string_id=periodUnit.reference2 \n\
    ON periodUnit.parent=period.doc_id AND periodUnit.reference=368863 \n\
    WHERE period.reference=368861'
    return sql
}
sql_app.tableOfFHIR_Task_inputSqlCmdMap = () => {
    let sql = 'SELECT * FROM (:sql_app.tableOfFHIR_Task_description ) td \n\
    LEFT JOIN ( \n\
        SELECT input.parent input_parent, val.doc_id value_SqlCmdMap_id, value value_SqlCmdMap FROM doc input, doc val \n\
        LEFT JOIN string ON string_id=val.doc_id \n\
        WHERE input.doc_id=val.parent \n\
        AND val.reference=372834 \n\
        ) inpscm ON input_parent=task_id'
    return sql
}
sql_app.tableOfFHIR_Task_description = () => {
    let sql = 'SELECT doc_id task_id, value description FROM doc \n\
    LEFT JOIN string ON string_id=doc_id \n\
    WHERE reference = 371941'
    return sql
}
sql_app.tableOfFHIR_Substance_code = () => {
    let sql = 'SELECT value substance_code, d.doc_id substance_id FROM doc d \n\
    , string WHERE reference = 370024 and string_id=reference2'
    return sql
}
sql_app.tableOfFHIR_comparator = () => {
    let sql = 'SELECT value comparator, doc_id comparator_id, parent comparator_parent FROM doc comparator \n\
    LEFT JOIN string s1 ON s1.string_id=comparator.reference2 \n\
    WHERE comparator.reference= 368638 '
    return sql
}
sql_app.tableOfFHIR_Quantity = () => {
    let sql = 'SELECT i.value quantity_value, f.value quantity_valuef, quantityCode.value quantity_code, quantityCode.reference2 quantity_code_id, quantityNum.doc_id quantity_id  \n\
    , quantityNum.* FROM doc quantityNum \n\
    LEFT JOIN integer i ON i.integer_id=quantityNum.doc_id \n\
    LEFT JOIN double f ON f.double_id=quantityNum.doc_id \n\
    LEFT JOIN ( SELECT d.*, value FROM doc d,string WHERE reference2=string_id \n\
    ) quantityCode ON quantityCode.parent=quantityNum.doc_id AND quantityCode.reference = 368641 \n\
    WHERE quantityNum.reference=368637 AND quantityNum.reference2=368636'
    return sql
}
sql_app.tableOfFHIR_MedicationRequest_sc_doseQuantityTimingPeriod = () => {
    let sql = 'SELECT * FROM (:sql_app.tableOfFHIR_MedicationRequest_sc ) x \n\
    LEFT JOIN (SELECT di_c.parent di_c_p, di.reference di_r, di.reference2 di_r2 \n\
    FROM doc di_c, doc di WHERE di_c.reference=369984 AND di.parent=di_c.doc_id \n\
    ) di ON di_c_p=x.medicationrequest_id \n\
    LEFT JOIN (:sql_app.tableOfFHIR_doseQuantity_timingPeriod ) dqtp ON dqtp.dosage_id=di_r2'
    return sql
}
sql_app.tableOfFHIR_MedicationRequest_sc = () => {
    let sql = 'SELECT d.doc_id medicationrequest_id, medication.* FROM doc d \n\
    LEFT JOIN (:sql_app.tableOfFHIR_Medication_sc ) medication \n\
    ON medication.medication_id=d.reference2 \n\
    WHERE d.reference=371469 '
    return sql
}
console.log(1)
sql_app.tableOfFHIR_Medication_sc = () => {
    let sql = 'SELECT d.doc_id medication_id, item.doc_id item_id, strength.doc_id strength_ratio_id, substance.*, ratio.* FROM doc d \n\
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
    let sql = 'SELECT n.quantity_value n_quantity_value, n.quantity_code n_quantity_code  \n\
    , numerator.doc_id  ratio_id, numerator.doc_id  numerator_id, numerator.reference2 n_quantity_id --, n.*  \n\
    , dn.quantity_value dn_quantity_value, dn.quantity_code dn_quantity_code --, dn.* \n\
    , denominator.doc_id denominator_id, denominator.reference2 dn_quantity_id --, denominator.* \n\
    FROM doc numerator  \n\
    LEFT JOIN ( :sql_app.tableOfFHIR_Quantity ) n ON n.doc_id= numerator.reference2 \n\
    LEFT JOIN doc denominator \n\
    LEFT JOIN ( :sql_app.tableOfFHIR_Quantity ) dn ON dn.doc_id= denominator.reference2 \n\
    ON denominator.parent = numerator.doc_id  \n\
    WHERE  numerator.reference = 368676'
    return sql
}

sql_app.concatSql = (sql) => {
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
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return sql
}
