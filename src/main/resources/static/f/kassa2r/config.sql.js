'use strict';

sql_app.SelectKassa = {
    name: 'Касса ',
    sql: ' SELECT idNom, DateProv, SumaProv, NameKassop, NameContr, NameVal, SNal  \n\
           FROM kassa.entry \n\
    WHERE DateProv >=:var.dateProv_start AND DateProv<=:var.dateProv_end AND Pr_rasx=:var.p ',


    order: ' ORDER BY  :var.or',
    sqlHtml: {
        dateprov: "{{v | date : 'shortDate'}} ",
    },

    dist: ' SELECT DISTINCT NameContr NameContr  FROM kassa.entry \n\
        WHERE DateProv >=:var.dateProv_start AND DateProv<=:var.dateProv_end AND Pr_rasx=:var.p ',


    sortColumnName: null,
    ascDesc: null,
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
    , DateProv, SumaProv, NameKassOp, NameContr, spvalut_id,  nameval, nal_beznal, snal) \n\
    VALUES (:pr, (SELECT max(idnom)+1 FROM kassa.entry), \n\
    :Ld1, :ssum, :KassOp, :NameContr, (SELECT idnomval FROM kassa.spvalut WHERE nameval=:sval), :svalz, :nal, :snal)' ,
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



sql_app.SpGrupKassOp = {
    name: 'Группи кассових операций',

    sql: ' SELECT IdNomGrupKassOp, NameGrupKassOp, Pr_Rasx \n\
    FROM kassa.SpGrupKassOp',
    order: '  ORDER BY NameGrupKassOP ',
}

sql_app.SpKassOp = {
    name: 'Кассовие операции',
    sql: 'SELECT IdNomKassOP, NameKassOp, spGrupKassOp_id,Pr_rasx \n\
    FROM kassa.SpKassOp ORDER BY  Pr_rasx,  NameKassOp, spGrupKassOp_id',
    order: '  '
}

sql_app.SpValut = {
    type: 1,
    name: 'Валюти',
    cols: {
        idnomval: '№№',
        nameval: 'Валюта',
    },
    select: ' SELECT IdNomVal, NameVal  \n\
    FROM kassa.SpValut ',
    where: " WHERE nameval LIKE ('%:var.m%') ",

    order: ' ORDER BY NameVal  ',
    group: '   ',
    insert: ' INSERT INTO kassa.SpValut (idnomval, NameVal) VALUES ((select max(idnomval)+1 from kassa.Spvalut), :var.m)',
    delete: ' DELETE kassa.SpValut WHERE idNomVal =:var.m ',
    selGroup: ' select max(idnomval) MaxPole  ', 

    sqlHtml: {
        dateprov: "{{v | date : 'shortDate'}} "
    }
}


sql_app.SpContragents = {
    type: 1,
    name: 'Контрагенти',
    cols: {
        IdNomContr: '№№',
        NameContr: 'Контрагенти',
    },

    select: ' SELECT * FROM   kassa.spcontragents ',
    where: " WHERE NameContr LIKE ('%:var.m%') ",
    order: ' ORDER BY NameContr',
    grop: ' GROUP BY IdNomContr',

    rowId: 'idnomcontr',

    insert: 'INSERT INTO kassa.SpContragents (namecontr, idnomcontr) \n\
        VALUES (:var.m , (SELECT max(IdNomContr)+1 FROM kassa.SpContragents))',

    delete: 'DELETE kassa.SpContragents WHERE idnomcontr =:var.idnomcontr ',

    sqlHtml: {
        dateprov: "{{v | date : 'shortDate'}} ",
    }


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
