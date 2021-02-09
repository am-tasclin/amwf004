const conf = {}, sql_app = {}

singlePage = {}
singlePageUrl = () => window.location.href.split('#!')[1]
singlePageLastUrl = () => singlePageUrl() ? singlePageUrl().split('/')[singlePageUrl().split('/').length - 1] : ''
singlePage.LastUrlTag = () => singlePageLastUrl().split('_')[0]
singlePage.LastUrlId = () => singlePageLastUrl().split('_')[1]
singlePage.LastUrlIdName = () => conf.fr[singlePage.LastUrlTag()].frn.toLowerCase()+'_id'

class AbstractController {
    singlePage = singlePage
    singlePageUrl = singlePageUrl
    singlePageLastUrl = singlePageLastUrl
    conf = conf
}

// app.factory("dataFactory", DataFactory)
class DataFactory {
    constructor($http, $q, $resource) {
        return {
            adn_d: $resource('/r/adn/d/:doc_id', { doc_id: '@doc_id', value: '@value' }),
            adn_insert: $resource('/r/adn/insert', { sqlCmdMap: '@sqlCmdMap' }),
            adn_delete: $resource('/r/adn/delete', { sqlCmdMap: '@sqlCmdMap' }),
            url_sql_read_db1: $resource('/r/url_sql_read_db1', { data: '@data' }),
            url: '/r/url_sql_read_db1',
            httpGet: function (params) {
                var deferred = $q.defer()
                $http.get(this.url, { params: params })
                    .then((response) => {
                        deferred.resolve(response.data)
                    }, (response) => {
                        console.log(response.status)
                        // deferred.reject(response.status)
                        // https://metanit.com/web/angular/3.3.php
                    })
                return deferred.promise
            },
            httpGetRest: function (url) {
                var deferred = $q.defer()
                // console.log(url, 1)
                $http.get(url)
                    .then((response) => {
                        deferred.resolve(response.data)
                    }, (response) => {
                        console.log(response.status)
                        // deferred.reject(response.status)
                        // https://metanit.com/web/angular/3.3.php
                    })
                return deferred.promise
            },
        }
    }
}