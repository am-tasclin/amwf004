
app.factory("dataFactory", RWDataFactory)

class CustomCtrl {

    dictionaryNames = ['SpGrupKassOp']

    constructor(dataFactory) {

        this.dataFactory = dataFactory
        this.Ok_button('SpGrupKassOp')
        let SpData = {}
        SpData.LName = ' '
        SpData.LNameD = ' '
        SpData.z = 0

    }


    ok_button_dubl = () => {

        console.log('ok_button_dubl')

        this.selectedDictionary = selectedDictionary
        let sql = sql_app.SpKassOp.select + sql_app.SpKassOp.order
        sql = sql.replace(':var.m', 5)

        this.dataFactory.httpGetSql({ sql: sql }).then(rData => {
            this.listVald = rData
        })

    }


    Ok_button = (selectedDictionary) => {
        this.selectedDictionary = selectedDictionary
        let sql = sql_app[this.selectedDictionary].select + sql_app[this.selectedDictionary].order
        this.dataFactory.httpGetSql({ sql: sql }).then(rData => {
            this.listVal = rData
        })

    }




    add_button = () => {
        let sql = sql_app[this.selectedDictionary].insert.replace(':var.m', "'" + this.SpData.LName + "'")
        console.log(sql)
        this.dataFactory.httpPostSql({ sql: sql }).then(rData => {
            this.listVal = rData
            this.Ok_button(this.selectedDictionary)
        })
    }

    del_button = () => {

        let sql = sql_app[this.selectedDictionary].delete
            .replace(':var.m', sql_app[this.selectedDictionary].selectedRow[sql_app[this.selectedDictionary].rowIdName])
            .replace(':var.m', sql_app[this.selectedDictionary].selectedRow[sql_app[this.selectedDictionary].rowIdName])
       
       console.log(sql)
       
            this.dataFactory.httpPostSql({ sql: sql }).then(rData => {
            this.listVal = rData
            this.Ok_button(this.selectedDictionary)
        })
    }

    seek_button = () => {
        let sql = sql_app[this.selectedDictionary].select +
            sql_app[this.selectedDictionary].where +
            sql_app[this.selectedDictionary].order
        sql = sql.replace(':var.m', this.SpData.LName)
        this.dataFactory.httpGetSql({ sql: sql }).then(rData => {
            this.listVal = rData
        })
    }


    seek_button_dubl = () => {
        let sql = sql_app[sql_app[this.selectedDictionary].childTableName].select +
            sql_app[sql_app[this.selectedDictionary].childTableName].where +
            sql_app[sql_app[this.selectedDictionary].childTableName].order
        sql = sql.replace(':var.m', sql_app[this.selectedDictionary].selectedRow[sql_app[this.selectedDictionary].rowIdName])
            .replace(':var.w', this.SpData.LNameD)
        console.log('seek', sql)
        this.dataFactory.httpGetSql({ sql: sql }).then(rData => {
            this.listVald = rData
        })

    }

    add_button_dubl = () => {

        let sql = sql_app[sql_app[this.selectedDictionary].childTableName].insert.
            replace(':var.m', "'" + this.SpData.LNameD + "'")
            .replace(':var.g', sql_app[this.selectedDictionary].selectedRow[sql_app[this.selectedDictionary].rowIdName])
            console.log('add_b_d', sql)
            this.dataFactory.httpPostSql({ sql: sql }).then(rData => {
            this.listValD = rData


        })
    }


    del_button_dubl = () => {
        
        //console.log('Теущий номер группи', sql_app[this.selectedDictionary].selectedRow[sql_app[this.selectedDictionary].rowIdName])
        let subTable = sql_app[this.selectedDictionary].childTableName
        let sqlTableObj = sql_app[subTable]
        let selctedRowD = sqlTableObj.selectedRowD

        console.log(subTable, sqlTableObj.rowIdName)
        console.log(subTable, sqlTableObj.selectedRowD[sqlTableObj.rowIdName])



        let sql = sqlTableObj.delete.
                    replace(':var.m', sqlTableObj.selectedRowD[sqlTableObj.rowIdName])
            console.log('add_b_d', sql)
            
            this.dataFactory.httpPostSql({ sql: sql }).then(rData => {
                            this.listValD = rData
        })
    }





    getSql = sN => sql_app[sN]

    selectRow = row => {
        sql_app[this.selectedDictionary].selectedRow = row

        let sql = sql_app[sql_app[this.selectedDictionary].childTableName].select +
            sql_app[sql_app[this.selectedDictionary].childTableName].order
        sql = sql.replace(':var.m', sql_app[this.selectedDictionary].selectedRow[sql_app[this.selectedDictionary].rowIdName])
        this.dataFactory.httpGetSql({ sql: sql }).then(rData => {
            this.listVald = rData
        })

    }

    isSelectedRow = r => {
        //   console.log('Теущий номер группи', sql_app[this.selectedDictionary].selectedRow[sql_app[this.selectedDictionary].rowIdName])
        sql_app[this.selectedDictionary].selectedRow ?
            r[sql_app[this.selectedDictionary].rowIdName] ==
            sql_app[this.selectedDictionary].selectedRow[sql_app[this.selectedDictionary].rowIdName] : false
    }


    


    selectRowD = row => {
        let subTable = sql_app[this.selectedDictionary].childTableName
        sql_app[subTable].selectedRowD = row
    }

    isSelectedRowD = r => {
        console.log('Теущий номер группи', sql_app[this.selectedDictionary].selectedRow[sql_app[this.selectedDictionary].rowIdName])
        let subTable = sql_app[this.selectedDictionary].childTableName
        let tableObj = sql_app[subTable]
        let selectedRowD = tableObj.selectedRowD
        return selectedRowD ? r[tableObj.rowIdName] == selectedRowD[tableObj.rowIdName] : false
    }


}


app.controller('CustomCtrl', CustomCtrl)


