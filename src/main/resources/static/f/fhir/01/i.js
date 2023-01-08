'use strict'
class InitPageController extends AbstractController {
    constructor(dataFactory, pageLogic) {
        super(dataFactory)
        this.pl = pageLogic
    }
}; app.controller('InitPageController', InitPageController)

conf.containNumer = str => /\d/.test(str)
const readSql = 'DomainResource01 BackboneElement01 BackboneElement02 \n\
Element01 Resource01 CanonicalResource01 MetadataResource01 \n\
Logical01 Definition01 Event01 Request01'.split(/\s+/)

session.reList = 'MetadataResource01 CanonicalResource01 Resource01 DomainResource01 BackboneElement02 BackboneElement01 Element01'.split(/\s+/)
session.patternList = 'Logical01 Definition01 Event01 Request01'.split(/\s+/)

session.sumListLength = (arrayListNames, sum) => {
    ar.forEach(arrayListNames, listName => sum += session[listName] ? session[listName].length : 0)
    return sum
}

const men = {}
men.u = 'Info'

class PageLogicFactory extends PageLogic0Factory {
    constructor(dataFactory) {
        super(dataFactory)
        this.men = men
        dataFactory.sqlRowLimit = 200

        ar.forEach([4], e => console
            .log(readSql[e], '\n', sql_app[readSql[e]].sql))

        ar.forEach(readSql, n => dataFactory.readSql(sql_app[n].sql
            , r => session[n] = r.list))

        this.show_am002l = () => {
            console.log(1123, sql_app2)
            men.Info = {}
            dataFactory.readSql(sql_app2.goal01.sql, r1 => {
                men.Info.list = r1.list
                let sql = sql_app2.goal01.ifs.sqll + ' AND parent = ' + r1.list[0].doc_id
                // console.log(sql_app2.goal01.name, r1.list[0].doc_id, sql)
                dataFactory.readSql(sql, r2 => ar.forEach(r1.list, r1Item => {
                    r1Item.ifs_list = r2.list
                    console.log(r1Item.doc_id, r2.list[0])
                }))
            })
        }
        this.show_am002l()
    }

}; app.factory('pageLogic', PageLogicFactory)

const sql_app2 = {}
sql_app2.goal01 = {
    name: 'if view',
    ifs: {
        sqll: 'SELECT s1.value  addresses_code , d1.* FROM doc d1 \n\
        LEFT JOIN string s1 ON s1.string_id=d1.reference2 \n\
        WHERE d1.reference=373031'
    },
    sql: 'SELECT s1.value goal_note_anotation_text, d1.* FROM doc d1 \n\
    LEFT JOIN string s1 ON s1.string_id=d1.doc_id \n\
      WHERE d1.reference =376418',
}

sql_app.BackboneElement02 = {
    name: 'BackboneElement в атрибутах, що повторюються',
    sql: 'SELECT pps.value pps, ps.value ps, n v, d.* FROM doc dp \n\
    left join string pps on pps.string_id=dp.parent \n\
    , doc d \n\
    left join string ps on ps.string_id=d.parent \n\
    , ( SELECT doc_id, value n FROM doc, string where string_id=doc_id AND parent = 375830 \n\
    ) aat \n\
    WHERE d.reference=aat.doc_id and dp.doc_id=d.parent \n\
    ORDER BY n, ps.value',
}

sql_app.BackboneElement01 = {
    name: 'BackboneElement в атрибутах унікальні',
    sql: 'SELECT ps.value ps, s.value v, d.* FROM doc d \n\
    LEFT JOIN string s ON s.string_id=d.doc_id \n\
    LEFT JOIN string ps ON ps.string_id=d.parent \n\
    WHERE d.reference= 369784 \n\
    AND d.parent != 375830 \n\
    ORDER BY ps.value, s.value',
}

sql_app.Element01 = {
    name: 'Element',
    sql: 'SELECT s.value v, sr.value srv, d.* FROM doc d \n\
    LEFT JOIN string s ON s.string_id=d.doc_id \n\
    LEFT JOIN string sr ON sr.string_id=d.reference \n\
    WHERE   369787 in (d.reference, d.reference2) \n\
    ORDER BY s.value',
}

sql_app.Logical01 = {
    name: 'Logical',
    sql: 'SELECT value v, d.* FROM doc d \n\
    LEFT JOIN string ON string_id=d.doc_id \n\
    WHERE d.reference = 369796 \n\
    ORDER BY value',
}
sql_app.MetadataResource01 = {
    name: 'MetadataResource',
    sql: 'SELECT value v, d.* FROM doc d \n\
    LEFT JOIN string ON string_id=d.doc_id \n\
    WHERE d.reference = 369795 \n\
    ORDER BY value',
}

sql_app.Request01 = {
    name: 'Request::Pattern в ресурсах і атрибутах',
    sql: 'SELECT s.value v, sr.value srv, d.* FROM doc d \n\
    LEFT JOIN string s ON s.string_id=d.doc_id \n\
    LEFT JOIN string sr ON sr.string_id=d.reference \n\
    WHERE d.reference2 = 369767 \n\
    ORDER BY s.value',
}

sql_app.Event01 = {
    name: 'Event::Pattern в ресурсах і атрибутах',
    sql: 'SELECT s.value v, sr.value srv, d.* FROM doc d \n\
    LEFT JOIN string s ON s.string_id=d.doc_id \n\
    LEFT JOIN string sr ON sr.string_id=d.reference \n\
    WHERE d.reference2 = 369766 \n\
    ORDER BY s.value',
}

sql_app.Definition01 = {
    name: 'Definition::Pattern в ресурсах і атрибутах',
    sql: 'SELECT s.value v, sr.value srv, d.* FROM doc d \n\
    LEFT JOIN string s ON s.string_id=d.doc_id \n\
    LEFT JOIN string sr ON sr.string_id=d.reference \n\
    WHERE d.reference2 = 369778 \n\
    ORDER BY s.value',
}

sql_app.Resource01 = {
    name: 'Resource',
    sql: 'SELECT s.value v, sr.value srv, d.* FROM doc d \n\
    LEFT JOIN string s ON s.string_id=d.doc_id \n\
    LEFT JOIN string sr ON sr.string_id=d.reference \n\
    WHERE   369788 in (d.reference, d.reference2) \n\
    ORDER BY s.value',
}

sql_app.CanonicalResource01 = {
    name: 'CanonicalResource',
    sql: 'SELECT s.value v, sr.value srv, d.* FROM doc d \n\
    LEFT JOIN string s ON s.string_id=d.doc_id \n\
    LEFT JOIN string sr ON sr.string_id=d.reference \n\
    WHERE   369791 in (d.reference, d.reference2) \n\
    ORDER BY s.value',
}

sql_app.DomainResource01 = {
    name: 'DomainResource',
    sql: 'SELECT * FROM doc \n\
    LEFT JOIN string ON string_id=doc_id \n\
    WHERE reference= 369789 \n\
    ORDER BY value',
}
