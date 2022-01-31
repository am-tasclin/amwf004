
app.factory("dataFactory", RWDataFactory)

console.log(123)
let v1 = { x: 1, y: 2, z: 'df' }
console.log(v1)
let l1 = [1, 2, 3]
l1.push(v1)
console.log(l1)



class CustomCtrl {



    dictionaryNames = ['SpValut', 'SpContragents', 'SpOdVim']

    constructor(dataFactory) {

        this.dataFactory = dataFactory
        this.Ok_button('SpValut')
        let SpData = {}
        SpData.LName = ' '


    }

    getSql = sN => sql_app[sN]
    selectRow = row => this.selectedRow = row

    isSelectedRow = r => this.selectedRow ? r[this.getSql(this.selectedDictionary).rowIdName] ==
        this.selectedRow[this.getSql(this.selectedDictionary).rowIdName] : false


    del_button = () => {

        let sql = sql_app[this.selectedDictionary].delete.replace(':var.m', this.selectedRow[this.getSql(this.selectedDictionary).rowIdName])
        console.log(sql)

        this.dataFactory.httpPostSql({ sql: sql }).then(rData => {
            this.listVal = rData
            console.log(this.listVal)
            this.Ok_button(this.selectedDictionary)

        })
    }


    add_button = () => {

        let sql = sql_app[this.selectedDictionary].insert.replace(':var.m', "'" + this.SpData.LName + "'")

        this.dataFactory.httpPostSql({ sql: sql }).then(rData => {
            this.listVal = rData

            this.Ok_button(this.selectedDictionary)

        })
    }



    seek_button = () => {

        console.log('7777777')
        console.log(sql_app[this.selectedDictionary].where)

        let sql = sql_app[this.selectedDictionary].select +
            sql_app[this.selectedDictionary].where +
            sql_app[this.selectedDictionary].order

        sql = sql.replace(':var.m', this.SpData.LName)

        console.log(sql)

        this.dataFactory.httpGetSql({ sql: sql }).then(rData => {
            this.listVal = rData

        })
    }


    Ok_button = (selectedDictionary) => {
        this.selectedDictionary = selectedDictionary
        console.log(selectedDictionary)

        let sql = sql_app[selectedDictionary].select + sql_app[selectedDictionary].order

        this.dataFactory.httpGetSql({ sql: sql }).then(rData => {
            this.listVal = rData
            console.log(this.listVal)
        })
    }
}

app.controller('CustomCtrl', CustomCtrl)