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
    type:1,
    SelectDubl: 'SpKassOp',
    childTableName: 'SpKassOp',
    cols: {
        idnomgrupkassop: '№№',
        namegrupkassop: 'Группи кассових операций'
    },   
 
    rowIdName: 'idnomgrupkassop',
     
    name: 'Кассовие операции',
    sql: 'SELECT IdNomgrupKassOP, NameKassgrupOp \n\
    FROM kkassa.Spgrupkassop  ORDER BY  spGrupKassOp',

    select: ' SELECT IdNomgrupKassOP, NamegrupKassOp  FROM kassa.Spgrupkassop   ',

    where: " WHERE NamegrupKassOp  LIKE ('%:var.m%') ",

    order: '  ORDER BY NamegrupKassOp  ',
    group: '   ',
    insert: ' INSERT INTO kassa.Spgrupkassop (idnomgrupkassop, Namegrupkassop) VALUES ((select max(idnomgrupkassop)+1 from kassa.Spgrupkassop), :var.m)',
    
    delete: ' DELETE FROM kassa.Spgrupkassop WHERE idnomgrupkassop =:var.m ; \n\
              DELETE FROM kassa.Spkassop     WHERE  spgrupkassop_id =:var.m  ',
}

sql_app.SpKassOp = {
    type:1,
    cols: {
        idnomkassop: '№№',
        namekassop: 'Кассоая операция',
        spgrupkassop_id: 'Группа кассових операций',
        pr_rasx: 'Приход-расход'
    },   
    rowIdName: 'idnomkassop',

    name: 'Кассовие операции',
    sql: 'SELECT IdNomKassOP, NameKassOp, spGrupKassOp_id,Pr_rasx \n\
    FROM kassa.SpKassOp ORDER BY  Pr_rasx,  NameKassOp, spGrupKassOp_id',


    select: ' SELECT IdNomKassOP, NameKassOp \n\
    FROM kassa.SpKassOp  WHERE  spGrupKassOp_id=:var.m',

    where: " and NameKassOp LIKE ('%:var.w%') ",

    order: '  ORDER BY Pr_rasx,  NameKassOp, spGrupKassOp_id  ',
    group: '   ',
    insert: ' INSERT INTO kassa.Spkassop (idnomkassop, Namekassop,spgrupkassop_id) VALUES ((select max(idnomkassop)+1 from kassa.Spkassop), :var.m,:var.g)',
    
    delete: ' DELETE FROM kassa.Spkassop WHERE idnomkassop =:var.m ',
}

sql_app.SpValut = {
    type: 1,
    name: 'Валюти',
    cols: {
        idnomval: '№№',
        nameval: 'Валюта',
    },
    rowIdName: 'idnomval',
    sql: ' SELECT IdNomVal, NameVal  \n\
    FROM kassa.SpValut ',

    select: ' SELECT IdNomVal, NameVal  \n\
    FROM kassa.SpValut ',



    where: " WHERE nameval LIKE ('%:var.m%') ",

    order: ' ORDER BY NameVal  ',
    group: '   ',
    insert: ' INSERT INTO kassa.SpValut (idnomval, NameVal) VALUES ((select max(idnomval)+1 from kassa.Spvalut), :var.m)',
    delete: ' DELETE FROM kassa.SpValut WHERE idNomVal =:var.m ',
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
    rowIdName: 'idnomcontr',
    sql: ' SELECT * FROM   kassa.spcontragents ',

    select: ' SELECT * FROM   kassa.spcontragents ',
    where: " WHERE NameContr LIKE ('%:var.m%') ",
    order: ' ORDER BY NameContr',
    grop: ' GROUP BY IdNomContr',

    rowId: 'idnomcontr',

    insert: 'INSERT INTO kassa.SpContragents (namecontr, idnomcontr) \n\
        VALUES (:var.m , (SELECT max(IdNomContr)+1 FROM kassa.SpContragents))',

    delete: 'DELETE FROM kassa.SpContragents WHERE idnomcontr =:var.m ',

    sqlHtml: {
        dateprov: "{{v | date : 'shortDate'}} ",
    }
}
sql_app.SpContragents.sql = sql_app.SpContragents.select

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

sql_app.SpOdVim = {
    type:1,
    cols: {
        idodvim: '№№',
        nameodvim: 'Одиниця виміру'
        
    },   
    rowIdName: 'idodvim',

    name: 'Одиниці виміру',
    sql: 'SELECT Idodvim, NameOdvim \n\
    FROM kassa.SpOdVim ORDER BY  Nameodvim',


    select: ' SELECT idodvim, nameodvim \n\
    FROM kassa.Spodvim  ',

    where: " WHERE Nameodvim LIKE ('%:var.m%') ",

    order: '  ORDER BY NameOdVim  ',
    group: '   ',
    insert: ' INSERT INTO kassa.spodvim (nameodvim) VALUES (:var.m)',
    
    delete: ' DELETE FROM kassa.SpOdVim WHERE idodvim =:var.m ',
}

sql_app.SpTovar = {
    type:1,
    cols: {
        idtovar: '№№',
        nametovar: 'Товар',
        idgruptovar_id: 'Товарнай группа ',
        idodvim_id: 'Одиниця виміру'
    },   
    rowIdName: 'idtovar',

    name: 'Товар',
    sql: 'SELECT idtovar, nametovar\n\
    FROM kassa.SpTovar  WHERE  idgruptovar_id=:var.m',


    select: ' SELECT idtovar, nametovar \n\
    FROM kassa.SpTovar  WHERE  idgruptovar_id=:var.m',

    where: " and nametovar LIKE ('%:var.w%') ",

    order: '  ORDER BY nametovar ',
    group: '   ',
    insert: ' INSERT INTO kassa.SpTovar (idtovar,nametovar,idgruptovar_id) VALUES ((select max(idtovar)+1 from kassa.Sptovar), :var.m,:var.g)',
    
    delete: ' DELETE FROM kassa.SpTovar WHERE idtovar =:var.m ',
}
