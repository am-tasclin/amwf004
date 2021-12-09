'use strict';

sql_app.SelectKassa = {
    name: 'Касса ',
    sql: 'SELECT idNom, DateProv, SumaProv, NameKassop, NameContr, NameVal, Nal_beznal  \n\
    FROM kassa.entry \n\
    WHERE DateProv >=:d1 AND DateProv<=:d2 AND Pr_rasx=:p ',
    sqlHtml: {
        dateprov: "{{v | date : 'medium'}}",
    },
}

sql_app.GroupKassa2 = {
    name: 'Общая сума и кол-во проводок 2',
    sql: 'SELECT COUNT(*) idNom, \'.     ∑∑\' DateProv, SUM(SumaProv) SumaProv  \n\
    FROM  (:sql_app.SelectKassa ) x ',
}

sql_app.GroupKassa = {
    name: 'Общая сума и кол-во проводок ',
    sql: 'SELECT COUNT(*) idNom, \'.     ∑∑\' DateProv, SUM(SumaProv) SumaProv  \n\
        FROM  kassa.entry \n\
        WHERE DateProv >=:d1 AND DateProv<=:d2 AND Pr_rasx=:p'  ,
}

sql_app.AddKassa_VB = {
    name: 'Добавление кассового ордера',
    sql: 'INSERT INTO kassa.entry \n\
    (pr_rasx, idNom \n\
    , DateProv, SumaProv, NameKassOp, NameContr, nameval, nal_beznal) \n\
    VALUES (:pr, (SELECT max(idnom)+1 FROM kassa.entry), \n\
    :Ld1, :ssum, :KassOp, :NameContr, :val, :nal)' ,
}


sql_app.UpdateKassa = {
    name: 'Изменение номера сопутствующего документа',
    sql: 'UPDATE kassa.entry SET idDoc=:LIdDoc WHERE idNom=:LidNom',
}

sql_app.DeleteKassa = {
    name: 'Удаление проводки',
    sql: 'DELETE FROM kassa.entry WHERE idNom=:LidNom',
}

sql_app.SpContragent = {
    name: 'Справочник контрагентов',
    sql: ' SELECT IdNomContr, NameContr FROM   kassa.SpContragents ORDER BY NameContr',
}

sql_app.SpGrupKassOp = {
    name: 'Справочник групп кассових операций',
    sql: ' SELECT IdNomGrupKassOp, NameGrupKassOp, Pr_Rasx FROM kassa.SpGrupKassOp ORDER BY NameGrupKassOP',
}

sql_app.SpKassOp = {
    name: 'Справочник кассових операций',
    sql: 'SELECT IdNomKassOP, NameKassOp, IdNomGrupKassOp,Pr_rasx FROM kassa.SpKassOp ORDER BY  Pr_rasx,  NameKassOp, IdNomGrupKassOp',
}

sql_app.SpValut = {
    name: 'Справочник валют',
    sql: 'SELECT IdNomVal, NameVal FROM kassa.SpVal ORDER BY NameVal',
}

sql_app.Seek_LName = {
    name: 'Пошук по контрагенту',
    sql: 'SELECT idNom, DateProv, SumaProv, NameKassop, NameContr, NameVal, Nal_beznal  \n\
          FROM kassa.entry \n\
          WHERE DateProv >=:d1 AND DateProv<=:d2 AND Pr_rasx=:p :seek ',
    sqlHtml: {
        dateprov: "{{v | date : 'medium'}}",
    },
}
