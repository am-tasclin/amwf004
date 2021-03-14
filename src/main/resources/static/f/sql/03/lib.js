'use strict';
const singlePage = {}, conf = {}, sql_app = {}

singlePage.Url = () => window.location.href.split('#!')[1]
singlePage.UrlList = () => singlePage.Url().split('/')

singlePage.FirstUrl = () => singlePage.Url() ? singlePage.Url().split('/')[1] : ''
singlePage.FirstUrlTag = () => singlePage.FirstUrl().split('_')[0]
singlePage.FirstUrlId = () => singlePage.FirstUrl().split('_')[1]

singlePage.X_Url = (nr) => nr ? singlePage.UrlList()[nr] : ''
singlePage.X_UrlTag = (nr) => singlePage.UrlList()[nr].split('_')[0]
singlePage.X_UrlId = (nr) => !nr ? 0 : singlePage.UrlList()[nr].split('_')[1]

singlePage.ForLastUrl = () => singlePage.Url() ? singlePage.Url().split('/')[singlePage.Url().split('/').length - 2] : ''
singlePage.ForLastUrlTag = () => singlePage.ForLastUrl().split('_')[0]
singlePage.ForLastUrlId = () => singlePage.ForLastUrl().split('_')[1]

singlePage.LastUrl = () => singlePage.Url() ? singlePage.Url().split('/')[singlePage.Url().split('/').length - 1] : ''
singlePage.LastUrlTag = () => singlePage.LastUrl().split('_')[0]
singlePage.LastUrlId = () => singlePage.LastUrl().split('_')[1]

singlePage.LastUrlIdName = () => singlePage.LastUrlTag() ? conf.fr[singlePage.LastUrlTag()].frn.toLowerCase() + '_id' : ''

singlePage.TagIdName = (tag) => conf.fr[tag].frn.toLowerCase() + '_id'
singlePage.ClickTagHref = (tag, id) => {
    let newUrl = '', tagId = tag + (id ? ('_' + id) : '')
    // console.log(tag, singlePage.Url().includes(tag), singlePage.UrlList(), tagId)
    if (singlePage.Url().includes(tag))
        for (let i = 1; i < singlePage.TagPosition(tag); i++) newUrl += '/' + singlePage.X_Url(i)
    else angular.forEach(singlePage.UrlList(), (t, i) => {
        if (t && !newUrl.includes(tag))
            newUrl += '/' + t + (conf.fr[singlePage.X_UrlTag(i)].children.includes(tag) ? '/' + tagId : '')
    })
    return newUrl
}
singlePage.TagPosition = (tag) => {
    let position
    angular.forEach(singlePage.UrlList(), (urlPart, p) => {
        if (tag == urlPart.split('_')[0]) position = p
    })
    return position
}

class AbstractController {
    singlePage = singlePage
    conf = conf
}

conf.NewEl = {}
conf.NewEl.openDialog = (openedDialogNewEl) => {
    if (conf.NewEl.openedDialog == openedDialogNewEl)
        delete conf.NewEl.openedDialog
    else
        conf.NewEl.openedDialog = openedDialogNewEl
}

//app.factory("editFRF", EditFHIResourceFactory)
class EditFHIResourceFactory {
    dataFactory
    constructor(dataFactory) {
        this.dataFactory = dataFactory
    }

    addEl_save = (r) => {
        let lastUrlTag = singlePage.LastUrlTag(),
            forLastUrlTag = singlePage.ForLastUrlTag(),
            forLastObj = conf.fr[forLastUrlTag],
            addEl = forLastObj.add[lastUrlTag]
        // console.log(1, r, lastUrlTag, forLastUrlTag, forLastObj, 2, addEl)
        addEl.initSqlCmdMap(r)
        this.dataFactory.adn_insert.save(addEl.sqlCmdMap).$promise.then((map) => {
            // console.log(map, map.insert_doc.el, 1)
            let newUrl = addEl.newUrl(map)
            window.location = '#!' + newUrl
            // window.location.href = '#!' + newUrl
        })
    }

    newEl_save = () => {
        let newEl = conf.fr[singlePage.LastUrlTag()].NewEl
        let sqlCmdMap = newEl.sqlCmdMap
        if (newEl.initSqlCmdMap) newEl.initSqlCmdMap()
        console.log(2, singlePage.LastUrlTag(), sqlCmdMap)
        this.dataFactory.adn_insert.save(sqlCmdMap).$promise.then((map) => {
            console.log(map)
        })
    }
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
