
app.factory("dataFactory", RWDataFactory)

class CustomCtrl {



    dictionaryNames = ['SpValut', 'SpContragents']

    constructor(dataFactory) {

        this.dataFactory = dataFactory
        this.Ok_button('SpValut')
        let SpData = {}
        SpData.LName = ' '


    }

    getSqlApp = sN => sql_app[sN]

    add_button = () => {

        let sql = sql_app[this.selectedDictionary].insert.replace(':var.m', "'" + this.SpData.LName + "'")

        console.log('7777777888888888')
        console.log(sql)


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

        sql = sql.replace(':var.m',  this.SpData.LName )

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

        })
    }
}

app.controller('CustomCtrl', CustomCtrl)