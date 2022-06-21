'use strict'

class InitPageController extends AbstractController {
    constructor(dataFactory) {
        super(dataFactory)
        console.log(conf)
        this.dataFactory.readSql(sql_app.tableColumn.sql, r => {
            conf.tableGrid = { tableColumn: r.list }
            if (r.list.length) {
                this.conf.tableGrid.eMap = {}
                ar.forEach(conf.tableGrid.tableColumn
                    , row => sql_app.init_eMap(row, 'tableColumn', conf.tableGrid))
            }
            this.dataFactory.readSql(sql_app.tableGroup2.sql, r => initGroup2Column(r))
        })
    }
}; app.controller('InitPageController', InitPageController)

const initGroup2Column = r => {
    if (r.list.length) {
        conf.tableGrid.thead = [[], []]
        console.log(r, r.list.length, '--thead->', conf.tableGrid.thead)
        conf.tableGrid.groupColumn = { eMap: {}, list: r.list }
        ar.forEach(r.list, row => sql_app.init_eMap(row, 'tableGroup2', conf.tableGrid.groupColumn))
        ar.forEach(conf.tableGrid.tableColumn, (row, k) => {
            console.log(row.column_id, k, !!sql_app.is_eMap(conf.tableGrid.groupColumn, row.column_id)
                , conf.tableGrid.thead[0].length)

            if (sql_app.is_eMap(conf.tableGrid.groupColumn, row.column_id)) {
                conf.tableGrid.thead[1].push({
                    text: row.rcolumnname ? row.rcolumnname : row.columnname
                })
            }
            if (sql_app.is_eMap(conf.tableGrid.groupColumn, row.column_id) && conf.tableGrid.thead[0].length) {
                conf.tableGrid.thead[0][conf.tableGrid.thead[0].length - 1].text
                    = sql_app.is_eMap(conf.tableGrid.groupColumn, row.column_id).groupcolumn_i18n
                conf.tableGrid.thead[0][conf.tableGrid.thead[0].length - 1].colspan += 1
                conf.tableGrid.thead[0][conf.tableGrid.thead[0].length - 1].rowspan = 1
            } else {
                conf.tableGrid.thead[0].push({
                    text: row.rcolumnname ? row.rcolumnname : row.columnname
                    , colspan: 1
                    , rowspan: 2
                })
            }
        })
    }
}

sql_app.init_eMap = (row, sqlAppName, eMapContainer) => eMapContainer.eMap[row[sql_app[sqlAppName].eMapColumnName]] = row
sql_app.is_eMap = (eMapContainer, id) => eMapContainer.eMap[id]
sql_app.tableGroup2 = {
    name: 'Грид таблиці - група колонок, шапка двохрівнева',
    eMapColumnName: 'gcolumn_id',
    sql: 'SELECT groupColumn_referenceToColumn.reference gColumn_id, gcI18n.value groupColumn_i18n \n\
    , tableGrid.reference2 table_id --, *  \n\
    FROM doc groupColumn_referenceToColumn, doc tableGrid, doc groupColumn, doc groupColumn_i18n \n\
    LEFT JOIN string gcI18n ON gcI18n.string_id=groupColumn_i18n.doc_id \n\
    WHERE groupColumn_i18n.reference=374536 \n\
    AND groupColumn_i18n.doc_id=groupColumn_referenceToColumn.parent \n\
    AND groupColumn_i18n.parent=groupColumn.doc_id \n\
    AND tableGrid.doc_id=groupColumn.parent ',
}
sql_app.tableColumn = {
    name: 'Колонки таблиці аналог SQL: CREATE TABLE',
    eMapColumnName: 'column_id',
    sql: 'SELECT tn.value tableName, cn.value columnName, rcn.value rColumnName \n\
    , createTableColumn.doc_id column_id \n\
    -- ,  *  \n\
    FROM doc createTableColumn \n\
    LEFT JOIN string tn ON tn.string_id=createTableColumn.parent \n\
    LEFT JOIN string cn ON cn.string_id=createTableColumn.doc_id \n\
    LEFT JOIN string rcn ON rcn.string_id=createTableColumn.reference \n\
    LEFT JOIN sort ctcSort ON ctcSort.sort_id=createTableColumn.doc_id \n\
    WHERE createTableColumn.parent=373738 \n\
    ORDER BY ctcSort.sort ',
}
sql_app.tableGrid = {
    name: 'Грид таблиці',
    sql: 'SELECT doc_id tableGrid_id FROM doc tableGrid \n\
    WHERE tableGrid.reference=373815 \n\
    AND tableGrid.reference2=373738 ',
}
