'use strict';
const singlePage = {}, conf = {}, sql_app = {}

singlePage.Url = () => window.location.href.split('#!')[1]
singlePage.UrlList = () => singlePage.Url().split('/')

singlePage.FirstUrl = () => singlePage.Url() ? singlePage.Url().split('/')[1] : ''
singlePage.FirstUrlTag = () => singlePage.FirstUrl().split('_')[0]
singlePage.FirstUrlId = () => singlePage.FirstUrl().split('_')[1]

singlePage.ForLastUrl = () => singlePage.Url() ? singlePage.Url().split('/')[singlePage.Url().split('/').length - 2] : ''
singlePage.ForLastUrlTag = () => singlePage.ForLastUrl().split('_')[0]
singlePage.ForLastUrlId = () => singlePage.ForLastUrl().split('_')[1]

singlePage.LastUrl = () => singlePage.Url() ? singlePage.Url().split('/')[singlePage.Url().split('/').length - 1] : ''
singlePage.LastUrlTag = () => singlePage.LastUrl().split('_')[0]
singlePage.LastUrlId = () => singlePage.LastUrl().split('_')[1]

singlePage.LastUrlIdName = () => singlePage.LastUrlTag() ? conf.fr[singlePage.LastUrlTag()].frn.toLowerCase() + '_id' : ''

singlePage.X_Url = (nr) => nr ? singlePage.UrlList()[nr] : ''
singlePage.X_UrlTag = (nr) => singlePage.UrlList()[nr].split('_')[0]
singlePage.X_UrlId = (nr) => nr && singlePage.UrlList().length > nr ? singlePage.UrlList()[nr].split('_')[1] : null//0

singlePage.TagPosition = (tag) => singlePage.Url().includes(tag) ? singlePage.Url().split('/' + tag)[0].split('/').length : null
singlePage.TagUrlId = (tag) => singlePage.X_UrlId(singlePage.TagPosition(tag))
singlePage.TagIdName = (tag) => conf.fr[tag].frn.toLowerCase() + '_id'

singlePage.ClickTagHref = (tag, id) => {
    let newUrl = '', tagId = tag + (id ? ('_' + id) : '')
    // console.log(tag, singlePage.Url().includes(tag), singlePage.UrlList(), tagId)
    if (singlePage.Url().includes(tag))
        for (let i = 1; i < singlePage.TagPosition(tag); i++) newUrl += '/' + singlePage.X_Url(i)
    else angular.forEach(singlePage.UrlList(), (t, i) => {
        if (t && !newUrl.includes(tag))
            if (conf.fr[singlePage.X_UrlTag(i)].children)
                newUrl += '/' + t + (conf.fr[singlePage.X_UrlTag(i)].children.includes(tag) ? '/' + tagId : '')
    })
    return newUrl
}
singlePage.LinkUp = (fromTag, toTag, r) => {
    let fromTagId = '', linkUp = ''
    if (!fromTag || !conf.fr[fromTag] || !conf.fr[fromTag].frn || !r)
        console.log('ERROR: ',fromTag, conf.fr[fromTag], r)
    else {
        fromTagId = '/' + fromTag + (r[conf.fr[fromTag].frn.toLowerCase() + '_id'] ? ('_' + r[conf.fr[fromTag].frn.toLowerCase() + '_id']) : '')
        linkUp = singlePage.Url().split(fromTagId)[0] + fromTagId
            + '/' + toTag + (r[conf.fr[toTag].frn.toLowerCase() + '_id'] ? ('_' + r[conf.fr[toTag].frn.toLowerCase() + '_id']) : '')
    }
    if (singlePage.Url().includes(linkUp)) linkUp = singlePage.Url().split(fromTagId)[0] + fromTagId
    return linkUp
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

//app.factory("editFRFactory", EditFHIResourceFactory)
class EditFHIResourceService {
    dataBeFactory
    constructor(dataBeFactory) {
        this.dataBeFactory = dataBeFactory
    }

    
    addEl_save = (r) => {
        let lastUrlTag = singlePage.LastUrlTag(),
            forLastUrlTag = singlePage.ForLastUrlTag(),
            forLastObj = conf.fr[forLastUrlTag],
            addEl = forLastObj.add[lastUrlTag]
        // console.log(1, r, lastUrlTag, forLastUrlTag, forLastObj, 2, addEl)
        addEl.initSqlCmdMap(r)
        console.log(addEl.sqlCmdMap)
        this.dataBeFactory.adn_insert.save(addEl.sqlCmdMap).$promise.then((map) => {
            console.log(map)
            // console.log(map, map.insert_doc.el, 1)
            // let newUrl = addEl.newUrl(map)
            // window.location = '#!' + newUrl
            // window.location.href = '#!' + newUrl
        })
    }

    newEl_save2 = (e) => {
        if (e.initSqlCmdMap) e.initSqlCmdMap()
        console.log(e.sqlCmdMap)
        // if (true) return
        this.dataBeFactory.adn_insert.save(e.sqlCmdMap).$promise.then((map) => {
            console.log(1, map)
            if (e.afterExeSqlCmdMap) e.afterExeSqlCmdMap(map)
        })
    }

    newEl_save = () => {
        let newEl = conf.fr[singlePage.LastUrlTag()].NewEl
        if (newEl.initSqlCmdMap) newEl.initSqlCmdMap()
        console.log(2, singlePage.LastUrlTag(), newEl.sqlCmdMap)
        this.dataBeFactory.adn_insert.save(newEl.sqlCmdMap).$promise.then((map) => {
            console.log(map, 1)
            if (newEl.afterExeSqlCmdMap) newEl.afterExeSqlCmdMap(map)
        })
    }
}

// app.factory("dataDBexchangeService", DataDBexchangeService)
class DataDBexchangeService {
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
