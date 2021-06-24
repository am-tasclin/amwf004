conf.fr = {} //FHIR
conf.exe.delEmptyDocWithParent = () => {
    let id = singlePage.LastUrlId()
    console.log(id)
    let cmd = [
        { delete_doc: { parent: id } },
        { delete_doc: { doc_id: id } },
    ]
    return cmd
}
conf.exe.clickListItem = (r, d) => {
    let dates = conf.fr[singlePage.LastUrlTag()].dates
    dates.dec.clickedItem = r
    dates.dec.edString = r.value
    dates.dec.clickListItemId = r[d.clickIdName]
    angular.forEach(dates.dec.dataSqlRequest.list, li => {
        if (li[d.clickIdName] == dates.dec.clickListItemId)
            dates.dec.UpdateEl.li = li
    })
}

conf.fr.cp = {
    frn: 'CarePlan',
    children: ['mr', 'gl', 'on'],
    sql_app: 'tableOfFHIR_CarePlan',
    sql_app_children_frs: ['mr', 'gl'],
    sql_app_children: [
        { fr: 'mr', connect_param: 'parent_careplan', sql_app: 'tableOfFHIR_CarePlan_plannedActivityReference_mr' },
        { fr: 'gl', connect_param: 'parent_careplan', sql_app: 'tableOfFHIR_CarePlan_Goal' },
    ],
    amRsRowHtml: '<span>{{r.fhir_domainresource}}</span>',
    delEmptyDoc: conf.exe.delEmptyDocWithParent,
    del: {
        mr: { delete_doc: {} },
        gl: { delete_doc: {} },
    },
    NewEl: {
        amRsRowHtml: "Новий <b>план лікування</b>, прив'язка з списком активності.",
        newElName: true,
        initSqlCmdMap: () => {
            let sqlCmdMap = conf.fr.cp.NewEl.sqlCmdMap
            sqlCmdMap.insert_doc.insert_string.value = conf.exe.NewEl.newElName
        },
        sqlCmdMap: {
            insert_doc: {
                parent: 369926, //[369926]   дані:369358 {368788:CarePlan} [2]
                reference: 372080, //[372080]   title:85066 
                insert_string: {},
                insert_doc: {
                    reference: 368789, // ☰ [368789] o[]37 activity 
                },
            },
        },
    },
}

conf.fr.cp.add = {
    gl: {
        initSqlCmdMap: r => {
            let sqlCmdMap = conf.fr.cp.add.gl.sqlCmdMap = {}
            let insert_doc = () => { return { reference2: r.goal_id } }
            if (conf.fr.cp.currEl.goal_id) {
                sqlCmdMap.insert_doc = insert_doc()
                sqlCmdMap.insert_doc.parent = conf.fr.cp.currEl.goal_id
            } else {
                sqlCmdMap.insert_doc = { parent: conf.fr.cp.currEl.careplan_id, reference: 373017, }
                sqlCmdMap.insert_doc.insert_doc = insert_doc()
            }
            console.log(conf.fr.cp.currEl.goal_id, r.goal_id, JSON.stringify(conf.fr.cp.add.gl.sqlCmdMap, null, 2))
        },
    },
    mr: {
        newUrl: map => {
            let newUrl = '/cp_' + conf.fr.cp.currEl.careplan_id + '/mr_' + map.insert_doc.el.doc_id
            console.log(map, map.insert_doc.el, newUrl)
            return newUrl
        },
        initSqlCmdMap: r => {
            let lastUrlTag = singlePage.LastUrlTag(),
                addEl = conf.fr.cp.add[lastUrlTag],
                insert_doc = addEl.sqlCmdMap.insert_doc,
                activity_id = conf.fr.cp.currEl.activity_id
            insert_doc.parent = activity_id
            insert_doc.reference2 = r.medicationrequest_id
            console.log(1, insert_doc, r)
        },
        sqlCmdMap: {
            insert_doc: {
                reference: 368794, //[368794] plannedActivityReference   reference:371631 {368830:CarePlan.activity.reference} 
            },
        },
    },
}

conf.fr.mr = {
    frn: 'MedicationRequest',
    children: ['mn', 'de'],
    sql_app: 'tableOfFHIR_MedicationRequest_sc_doseQuantityTimingPeriod',
    add: {
        mn: {
            initSqlCmdMap: (r) => {
                let update_doc = conf.fr.mr.add.mn.sqlCmdMap.update_doc
                update_doc.doc_id = conf.fr.mr.currEl.medicationrequest_id //
                update_doc.reference2 = r.medication_id //
                console.log(r, conf.fr.mr)
                console.log(update_doc)
            },
            sqlCmdMap: { update_doc: {} },
        },
    },
    NewEl: {
        amRsRowHtml: "Нове <b>призначеня ліків</b>, прив'язка з медикаментом та інструкцією дозування.",
        sqlCmdMap: {
            next_doc_ids: 1,
            insert_doc: {
                calc_doc_id: 0,
                parent: 371312, // [371312] дані:369358 {368833:MedicationRequest} 
                reference: 371469, //[371469] medication {369993:Medication} 
                insert_doc: {
                    reference: 369984 //[369984] o[]37 dosageInstruction   Dosage:369967 | 
                },
            },
        }
    },
    amRsRowHtml: '<span>{{r.substance_code}} {{r.n_quantity_value}}</span> \n\
    <span>{{r.quantity_value}} {{r.quantity_code}}</span> \n\
    <span data-ng-if="r.timing_id">кожні {{r.period}} {{r.periodunit}}</span> \n\
    <span class="w3-tiny" data-ng-if="!r.medication_id">id={{r.medicationrequest_id}}</span> \n\
    {{r.duration_s}} {{r.unit}}',
}

conf.fr.de = {
    frn: 'Dosage',
    children: ['qy', 'tg', 'ro'],
    sql_app: 'tableOfFHIR_doseQuantity_timingPeriod',
    amRsRowHtml: '<span>{{r.quantity_value}} {{r.quantity_code}}</span> \n\
    <span data-ng-if="r.timing_id">кожні {{r.period}} {{r.periodunit}}</span>',
    NewEl: {
        amRsRowHtml: "<b>Дозування</b>, численик та термін використання.",
        sqlCmdMap: {
            insert_doc: {
                reference: 369975, // [369975] doseQuantity   Quantity:368636 
            },
        },
        initSqlCmdMap: () => {
            console.log(1, conf.fr.de.dates.dec.clickListItemId, conf.fr.de.dates.dec.UpdateEl.li)
            console.log(1, conf.fr.de.NewEl.sqlCmdMap)
            conf.fr.de.NewEl.sqlCmdMap.insert_doc.parent //o[]37   doseAndRate:369972 
                = conf.fr.de.dates.dec.UpdateEl.li.dosageandrate_id
        },
        afterExeSqlCmdMap: (map) => {
            console.log(1)
        },
    },
}
conf.fr.de.dates = {
    dec: {
        clickListItem: (r) => {
            conf.fr.de.dates.dec.edString = r.value
            conf.fr.de.dates.dec.clickListItemId = r.dosage_id
            angular.forEach(conf.fr.de.dates.dec.dataSqlRequest.list, (li) => {
                if (li.dosage_id == conf.fr.de.dates.dec.clickListItemId)
                    conf.fr.de.dates.dec.UpdateEl.li = li
            })
        },
        amRsRowHtmlHead: 'Ресурси <b>дозування</b>',
        sql_app: 'tableOfFHIR_dosageData',
        clickIdName: 'dosage_id',
        amRsRowHtml: '<span \n\
            data-ng-class="{\'w3-leftbar w3-border-blue\': \n\
            ctrl.conf.fr.de.currEl.dosageandrate_id==r.dosageandrate_id}">{{r.value}}</span>',
        UpdateEl: {
            btn: '<i class="fas fa-wrench"></i>',
            initOpenDialog: () => {
                console.log(1)
            },
            amRsRowHtml: 'Змінити назву збірки дозування',
            edTemplate: 'edString.html',
            sqlCmdMap: { update_string: {} },
            initSqlCmdMap: () => {
                conf.fr.de.dates.dec.UpdateEl.sqlCmdMap.update_string.value = conf.fr.de.dates.dec.edString
                conf.fr.de.dates.dec.UpdateEl.sqlCmdMap.update_string.string_id = conf.fr.de.dates.dec.UpdateEl.li.string_id
            },
            afterExeSqlCmdMap: (map) => {
                if (map.update_string.update == 1) {
                    conf.fr.de.dates.dec.UpdateEl.li.value = map.update_string.value
                }
            },
        },
        NewEl: {
            btn: '<i class="fas fa-plus"></i>',
            amRsRowHtml: 'Створити нову збірку дозування',
            edTemplate: 'edString.html',
            sqlCmdMap: {
                insert_doc: {
                    parent: 369981, // [369981]   дані:369358 {369967:Dosage} [2]
                    reference: 372065, //[372065] text 
                    insert_string: {},
                    insert_doc: {
                        reference: 369972, //[369972] o[]37 doseAndRate 
                    },
                    read_this_doc: {
                        sql_app: 'tableOfFHIR_dosageData',
                        doc_id_name: 'dosage_id'
                    },
                },
            },
            initSqlCmdMap: () => {
                conf.fr.de.dates.dec.NewEl.sqlCmdMap.insert_doc.insert_string.value = conf.fr.de.dates.dec.edString
                let sql = sql_app[conf.fr.de.dates.dec.NewEl.sqlCmdMap.insert_doc.read_this_doc.sql_app]()
                conf.fr.de.dates.dec.NewEl.sqlCmdMap.insert_doc.read_this_doc.sql = sql
                console.log(1, sql)
                console.log(1, conf.fr.de.dates.dec.NewEl.sqlCmdMap)
            },
            afterExeSqlCmdMap: map => {
                console.log(1, conf.fr.de.dates.dec.dataSqlRequest.list)
                console.log(1, map, map.insert_doc.read_this_doc.r)
                conf.fr.de.dates.dec.dataSqlRequest.list.unshift(map.insert_doc.read_this_doc.r)
                conf.fr.de.dates.dec.clickListItemId = map.insert_doc.read_this_doc.r.dosage_id
            },
        },
    },
}

conf.fr.de.add = {
    tg: {
        initSqlCmdMap: r => {
            let iu_doc, currEl = conf.fr.de.currEl,
                sqlCmdMap = conf.fr.de.add.tg.sqlCmdMap = {}
            if (currEl.dosage_timing_id)
                iu_doc = sqlCmdMap.update_doc = { doc_id: currEl.dosage_timing_id }
            else
                iu_doc = sqlCmdMap.insert_doc = { parent: currEl.doseandrate_p, reference: 369970 }
            iu_doc.reference2 = r.timing_id
        },
    },
    qy: {
        initSqlCmdMap: qy => conf.fr.de.add.qy.sqlCmdMap = {
            update_doc: { doc_id: conf.fr.de.currEl.dosage_id, reference2: qy.doc_id, }
        }
    }
}

conf.fr.tg = {
    frn: 'Timing',
    sql_app: 'tableOfFHIR_Timing_period',
    amRsRowHtml: '<span>кожні {{r.period}} {{r.periodunit}}</span>',
    NewEl: {
        amRsRowHtml: "<b>Терміни</b>, період - цифрове значення та одиниці виміру.",
        sqlCmdMap: {
            insert_doc: {
                parent: 369933, // [369933]   дані:369358 {368797:Timing} [8]
                reference: 368861, // [368861] i23 period 
                insert_doc: {
                    reference: 368863 // [368863] periodUnit   ValueSet/units-of-time:368838 
                },
            },
        }
    },
}

conf.fr.mn = {
    frn: 'Medication',
    children: ['se', 'ro', 'qy'],
    sql_app: 'tableOfFHIR_Medication_sc',
    amRsRowHtml: '<span title="mn:{{r.medication_id}}"> {{r.substance_code}}\n\
    <span title="ro:{{r.strength_id}}" data-ng-if="r.n_quantity_id">\n\
    <span title="n_qy:{{r.n_quantity_id}}"> {{r.n_quantity_value}} {{r.n_quantity_code}} </span> \n\
    <span  data-ng-if="r.dn_quantity_id" title="d_qy:{{r.dn_quantity_id}}"> \n\
    / {{r.dn_quantity_value}} {{r.dn_quantity_code}}\n\
    </span></span></span><span data-ng-if="!r.substance_id"><пусто></span>',
    NewEl: {
        amRsRowHtml: '<b>Медикамент</b> з посиланням на інгрідієнт/и',
        sqlCmdMap: {
            insert_doc: {
                parent: 370040, //[370040]   дані:369358 {369993:Medication} [7]
                reference: 369998, //[369998] o[]37 ingredient   BackboneElement:369784 
                reference2: 369993, //[372814] o[]37   ingredient:369998 {369993:Medication}  
                insert_doc: {
                    reference: 370001, //[370001] item   CodeableReference:372172 {370000:} 
                },
            },
        },
    },
}

conf.fr.se = {
    frn: 'Substance',
    sql_app: 'tableOfFHIR_Substance_code',
    amRsRowHtml: '<span>{{r.substance_code}}</span>',
    NewEl: {
        amRsRowHtml: '<b>Субстація</b> по коду з її визначення',
        sqlCmdMap: {
            insert_doc: {
                parent: 370028, // [370028]   дані:369358 {370000:Substance} [2]
                reference: 370024, //[370024] code   CodeableReference:372172 {372417:SubstanceDefinition} 
                insert_string: {
                    value: '',
                },
            },
        },
    },
}

conf.fr.ro = {
    frn: 'Ratio',
    children: ['nqy', 'dqy'],
    sql_app: 'tableOfFHIR_Ratio',
    amRsRowHtml: '{{r.n_quantity_value}} {{r.n_quantity_code}}\n\
    <span data-ng-if="r.denominator_id">/{{r.dn_quantity_value}} {{r.dn_quantity_code}}</span>\n\
    <span data-ng-if="!r.n_quantity_id"><пусто></span>\n\
    ',
    NewEl: {
        amRsRowHtml: "Створити нове <b>співвідношення</b>, величини кількість як чисельник в зв'язку величина кількість як знаменник.",
        sqlCmdMap: {
            insert_doc: {
                parent: 372804, // [372804] дані:369358 {368675:Ratio} [2]
                reference: 368676, //[368676] numerator   Quantity:368636 
            },
        }
    },
}

conf.fr.ro.add = {
    nqy: {
        initSqlCmdMap: qy => conf.fr.ro.add.nqy.sqlCmdMap = {
            update_doc: {
                doc_id: conf.fr.ro.currEl.ratio_id,
                reference2: qy.doc_id,
            }
        },
    },
    dqy: {
        initSqlCmdMap: qy => {
            let iu_doc, currEl = conf.fr.ro.currEl,
                sqlCmdMap = conf.fr.ro.add.dqy.sqlCmdMap = {}
            if (currEl.denominator_id)
                iu_doc = sqlCmdMap.update_doc = { doc_id: currEl.denominator_id, }
            else
                iu_doc = sqlCmdMap.insert_doc = { parent: currEl.ratio_id, reference: 368677 }
            iu_doc.reference2 = qy.quantity_id
        },
    },
}

conf.fr.on = {
    frn: 'Observation',
    sql_app: 'tableOfFHIR_Observation_valueQuantity002',
    amRsRowHtml: "{{r.display}} {{r.comparator}} {{r.valuequantity_f}}  {{r.vu}} {{r.referencerange_id?'--referenceRange--':''}}",
}

conf.fr.gl = {
    frn: 'Goal',
    sql_app: 'tableOfFHIR_Goal001',
    amRsRowHtml: "{{r.g_text}} {{r.code}} {{r.comparator}} {{r.valuequantity_f}}",
    sql_app_children001: {
        gl7tt: {
            connect_param: 'parent_goal',
            sql_app: 'tableOfFHIR_Goal_target_measure_dueDuration'
        },
    },
    children: ['on'],
}

conf.fr.dqy = {
    fr: 'qy',
    frn: 'quantity',
    r2: 'dn_quantity_id',
    sql_app: 'tableOfFHIR_Quantity',
}

conf.fr.nqy = {
    fr: 'qy',
    frn: 'quantity',
    r2: 'n_quantity_id',
    sql_app: 'tableOfFHIR_Quantity',
}

conf.fr.qy = {
    frn: 'Quantity',
    sql_app: 'tableOfFHIR_Quantity',
    edTemplate: 'addEl',
    amRsRowHtml: '<span> {{r.quantity_value}}{{r.quantity_valuef}}  {{r.quantity_code}}</span> <span data-ng-if="!r.quantity_value && !r.quantity_code"> <пусто> </span> ',
    save_wrench: {
        initSqlCmdMap: () => {
            let sqlCmdMap = conf.fr.qy.save_wrench.sqlCmdMap
            sqlCmdMap.update_int.integer_id = conf.fr.qy.currEl.doc_id
            sqlCmdMap.update_int.value = conf.fr.qy.qy_value
        },
        sqlCmdMap: { update_int: {} }
    },
    NewEl: {
        amRsRowHtml: "Новий <b>численик</b>, цифрове значення та одиниці виміру.",
        initSqlCmdMap: () => {
            let sqlCmdMap = conf.fr.qy.NewEl.sqlCmdMap
            sqlCmdMap.insert_doc.insert_int.value = 1 * conf.fr.qy.qy_value
            if (conf.fr.qy.dates.dec.clickedItem)
                sqlCmdMap.insert_doc.insert_doc.reference2 = conf.fr.qy.dates.dec.clickedItem.code_id
            else if (conf.fr.qy.currEl)
                if (conf.fr.qy.currEl.quantity_code_id)
                    sqlCmdMap.insert_doc.insert_doc.reference2 = conf.fr.qy.currEl.quantity_code_id
            console.log(sqlCmdMap)
        },
        sqlCmdMap: {
            insert_doc: {
                parent: 372039, // [372039] дані:
                reference: 368637, //[368637] f24 value 
                reference2: 368636, //[368636] Quantity 
                insert_int: {},
                insert_doc: {
                    reference: 368641 // [368641] code 
                },
            },
        },
    },
    delEmptyDoc: conf.exe.delEmptyDocWithParent,
}

conf.fr.qy.dates = {
    dec: {
        sql_app: 'tableOfFHIR_ValueSet_code001',
        amRsRowHtml: '<span data-ng-class="{\'w3-leftbar w3-border-blue\': \n\
            ctrl.conf.fr.qy.currEl.quantity_code_id==r.code_id}">{{r.code_s}}</span>',
        amRsRowHtmlHead: 'Ресурси <b>одиниці виміру</b>',
        clickIdName: 'code_id',
        UpdateEl: {},
    },
}

conf.vs = {}//ValueSet
conf.vs.edEl = {
    plus: 'Створити новий',
    minus: 'Вилучити',
    wrench: 'Редагувати',
}//EditElement

