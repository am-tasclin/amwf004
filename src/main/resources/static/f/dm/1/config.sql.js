
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

sql_app.SelectADN = {
    name: 'Зчитати абстрактий вузел - TeSe',
    sql: 'SELECT d.*, s.value value_22, su.value value_u_22, o.sort \n\
    , srr.value rr_value_22 \n\
    , sr.value r_value_22, dr.doctype r_doctype \n\
    , sr2.value r2_value_22 \n\
    FROM doc d \n\
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
