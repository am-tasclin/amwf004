'use strict';

sql_app.SelectKassa = {
    name: 'Касса ',
    sql: 'SELECT idNom, DateProv, SumaProv, NameKassop, NameContr, NameVal, Nal_beznal  \n\
    FROM kassa.entry \n\
    WHERE DateProv >=:var.dateProv_start AND DateProv<=:var.dateProv_end AND Pr_rasx=:var.p ',
    order: ' ORDER BY  :var.or',
    sqlHtml: {
        dateprov: "{{v | date : 'shortDate'}} ",
    },
    sortColumnName: null,
    ascDesc:null,
    cols: {
        idNom: '№№',
        DateProv: 'Дата',
        SumaProv: 'Сума',
        NameKassop: 'Касова оп. ',
        NameContr: 'Контрагент',
        NameVal: 'Валюта',
        Nal_beznal: 'Нал/Безн',
    },
}

sql_app.GroupKassa2 = {
    name: 'Общая сума и кол-во проводок 2',
    sql: 'SELECT COUNT(*) idNom, \'.     ∑∑\' DateProv, SUM(SumaProv) SumaProv, MAX(nameval) nameval  \n\
    FROM  (:sql_app.SelectKassa ) x  ',
    order: '  ',
}

sql_app.GroupKassa = {
    name: 'Общая сума и кол-во проводок ',
    sql: 'SELECT COUNT(*) idNom, \'.     ∑∑\' DateProv, SUM(SumaProv) SumaProv  \n\
        FROM  kassa.entry \n\
        WHERE DateProv >=:var.dateProv_start AND DateProv<=:var.dateProv_end AND Pr_rasx=:var.p'  ,
    order: '  ',
}

sql_app.AddKassa_VB = {
    name: 'Добавление кассового ордера',
    sql: 'INSERT INTO kassa.entry \n\
    (pr_rasx, idNom \n\
    , DateProv, SumaProv, NameKassOp, NameContr, nameval, nal_beznal) \n\
    VALUES (:pr, (SELECT max(idnom)+1 FROM kassa.entry), \n\
    :Ld1, :ssum, :KassOp, :NameContr, :val, :nal)' ,
    order: '  ',
}

sql_app.UpdateKassa = {
    name: 'Изменение номера сопутствующего документа',
    sql: 'UPDATE kassa.entry SET idDoc=:LIdDoc WHERE idNom=:LidNom',
    order: '  ',
}

sql_app.DeleteKassa = {
    name: 'Удаление проводки',
    sql: 'DELETE FROM kassa.entry WHERE idNom=:LidNom',
    order: '  ',
}

sql_app.SpContragents = {
    name: 'Справочник контрагентов',
    i18n: {
        ua: {
            namecontr: 'Контрагент',
        }
    },
    sql: ' SELECT IdNomContr, NameContr FROM   kassa.spcontragents ',

    sel: ' SELECT IdNomContr, NameContr ',
    selG: ' SELECT DICTINCT IdNomContr ',
    from: ' FROM FROM   kassa.spcontragents ',
    order: ' ORDER BY NameContr',
    grop: ' GROUP BY IdNomContr',

    rowId: 'idnomcontr',
    upd: {
        sql: '',
    },
    ins: {
        sql: 'INSERT INTO kassa.SpContragents (namecontr, idnomcontr) \n\
        VALUES (:var.namecontr , (SELECT max(IdNomContr)+1 FROM kassa.SpContragents))',
    },
    del: {
        sql: 'DELETE kassa.SpContragents WHERE idnomcontr =:var.idnomcontr ',

    }
}

sql_app.SpGrupKassOp = {
    name: 'Справочник групп кассових операций',
    sql: ' SELECT IdNomGrupKassOp, NameGrupKassOp, Pr_Rasx \n\
    FROM kassa.SpGrupKassOp',
    order: '  ORDER BY NameGrupKassOP ',
}

sql_app.SpKassOp = {
    name: 'Справочник кассових операций',
    sql: 'SELECT IdNomKassOP, NameKassOp, IdNomGrupKassOp,Pr_rasx \n\
    FROM kassa.SpKassOp ORDER BY  Pr_rasx,  NameKassOp, IdNomGrupKassOp',
    order: '  '
}

sql_app.SpValut = {
    name: 'Справочник валют',
    sql: 'SELECT IdNomVal, NameVal FROM kassa.SpValut ',
    order: ' ORDER BY NameVal  ',
}

sql_app.Seek_LName = {
    name: 'Пошук по контрагенту',
    sql: 'SELECT idNom, DateProv, SumaProv, NameKassop, NameContr, NameVal, Nal_beznal  \n\
          FROM kassa.entry \n\
          WHERE DateProv >=:var.dateProv_start AND DateProv<=:var.dateProv_end AND Pr_rasx=:var.p :seek ',
    order: '  ',
    sqlHtml: {
        dateprov: "{{v | date : 'shortDate'}}",
    },
}
