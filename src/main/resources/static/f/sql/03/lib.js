'use strict';
const singlePage = {}, conf = {}, sql_app = {}
conf.exe = {}//execute library

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
                newUrl += '/' + t +
                    (conf.fr[singlePage.X_UrlTag(i)].children.includes(tag) ? '/' + tagId : '')
    })
    return newUrl
}

singlePage.LinkFromTo = (fromTagName, toTagName) => {
    let
        fromCurrEl = conf.fr[fromTagName].currEl,
        toTagColId = conf.fr[toTagName].r2,
        toTagId = fromCurrEl[toTagColId] ? ('_' + fromCurrEl[toTagColId]) : '',
        fromTagId = singlePage.Url().split(fromTagName + '_')[1].split('/')[0],
        beforeTo = singlePage.Url().split(fromTagName + '_')[0]
            + fromTagName + '_' + fromTagId,
        newUrl = beforeTo

    if (!singlePage.Url().includes(toTagName)) //toTag not exist
        newUrl += '/' + toTagName + toTagId

    return newUrl
}

singlePage.LinkUp = (fromTag, toTag, r) => {
    let fromTagId = '', linkUp = ''
    if (!fromTag || !conf.fr[fromTag] || !conf.fr[fromTag].frn || !r) {
        // console.log('ERROR: ', fromTag, conf.fr[fromTag], r)
    } else {
        fromTagId = '/' + fromTag + (r[conf.fr[fromTag].frn.toLowerCase() + '_id'] ? ('_' + r[conf.fr[fromTag].frn.toLowerCase() + '_id']) : '')
        linkUp = singlePage.Url().split(fromTagId)[0] + fromTagId
            + '/' + toTag + (r[conf.fr[toTag].frn.toLowerCase() + '_id'] ? ('_' + r[conf.fr[toTag].frn.toLowerCase() + '_id']) : '')
    }
    if (singlePage.Url().includes(linkUp)) linkUp = singlePage.Url().split(fromTagId)[0] + fromTagId
    return linkUp
}

class AbstractController { singlePage = singlePage; conf = conf }

conf.exe.NewEl = {}
conf.exe.getEl = fr => conf.fr[fr]

conf.exe.openDialogCUD = type => {
    let openDialog = singlePage.LastUrlTag() + '_' + type
    conf.openDialogCUD = conf.openDialogCUD == openDialog ? '' : openDialog
    if ('wrench' == conf.openDialogCUD.split('_')[1]) {
        if (!conf.fr.qy.qy_value) {
            let currEl = conf.fr[singlePage.LastUrlTag()].currEl
            if (!currEl && conf.fr[singlePage.LastUrlTag()].fr)
                currEl = conf.fr[conf.fr[singlePage.LastUrlTag()].fr].currEl
            if (currEl)
                conf.fr.qy.qy_value =
                    conf.fr[singlePage.LastUrlTag()].currEl.quantity_value
        }
    }
}
conf.exe.NewEl.openDialog = (openedDialogNewEl) => {
    if (conf.exe.NewEl.openedDialog == openedDialogNewEl)
        delete conf.exe.NewEl.openedDialog
    else
        conf.exe.NewEl.openedDialog = openedDialogNewEl
}

//app.factory("editFRFactory", EditFHIResourceFactory)
class EditFHIResourceService {
    dataBeFactory
    constructor(dataBeFactory) {
        this.dataBeFactory = dataBeFactory
    }
    deleteEl = () => {
        let confDocEl = conf.fr[singlePage.FirstUrlTag()],
            docEl = confDocEl.currEl
        console.log(docEl.children)
        console.log(Object.values(docEl.children).filter(x => x).length)
        console.log(Object.values(docEl.children).filter(x => x).map(x => x.length))
        let delEmptyRoot = () => {
            let delEmptyDocCmd = confDocEl.delEmptyDoc()
            console.log(confDocEl, delEmptyDocCmd)
            console.log('delete root for doc is empty', singlePage.FirstUrlId(), delEmptyDocCmd)
            this.dataBeFactory['adn_delete' + (Array.isArray(delEmptyDocCmd) ? 's' : '')]
                .save({ sqlCmdListMap: delEmptyDocCmd }).$promise.then(map => {
                    console.log(1, map)
                })
        }

        if (0 == Object.values(docEl.children).filter(x => x).length) delEmptyRoot()
        else if (0 == Object.values(docEl.children).filter(x => x).map(x => x.length).reduce((s, v) => s + v)) delEmptyRoot()
        else if (2 == singlePage.UrlList().length) {
            console.info('root is not empty and not selected element to delete')
        } else {
            console.log(singlePage.LastUrlTag(), docEl.children)
            let nMr = docEl.children[singlePage.LastUrlTag()].filter(mr =>
                mr[conf.fr[singlePage.LastUrlTag()].frn.toLowerCase() + '_id'] == singlePage.LastUrlId())[0]
            let delParams = conf.fr[singlePage.ForLastUrlTag()].del[singlePage.LastUrlTag()]
            let deleteDocSqlMap = delParams.delete_doc
            deleteDocSqlMap.doc_id = nMr.adn_id
            this.dataBeFactory.adn_delete.save({ delete_doc: deleteDocSqlMap }).$promise.then(map => {
                console.log(1, map)
            })
        }
    }
    saveDocBody = () => {
        let dbJson = conf.showDocJson()
        let so = {
            doc_id: 1 * singlePage.FirstUrlId(), dbJson: dbJson
            , sql: 'UPDATE docbody SET docbody=:dbJson WHERE docbody_id=:doc_id ',
        }
        this.dataBeFactory.url_sql_read_db1.save(so).$promise.then(map => {
            if (0 == map.update_0) {
                so.sql = 'INSERT INTO docbody (docbody_id,docbody) VALUES (:doc_id, :dbJson) '
                console.log(so)
                this.dataBeFactory.url_sql_read_db1.save(so).$promise.then(map => {
                    console.log(map)
                })
            }
        })
    }

    addEl_save = (r) => {
        let lastUrlTag = singlePage.LastUrlTag(),
            forLastUrlTag = singlePage.ForLastUrlTag(),
            forLastObj = conf.fr[forLastUrlTag],
            confAddEl = forLastObj.add[lastUrlTag]
        console.log(1, r, lastUrlTag, forLastUrlTag, forLastObj, 2, confAddEl)
        confAddEl.initSqlCmdMap(r)
        console.log(confAddEl.sqlCmdMap, 1)
        this.dataBeFactory.adn_insert.save(confAddEl.sqlCmdMap).$promise.then((map) => {
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

    save_plus = () => {
        console.log(1)
        this.newEl_save()
    }

    save_wrench = () => {//edit
        let confEl = conf.fr[singlePage.LastUrlTag()].save_wrench
        console.log(confEl, 1)
        if (confEl.initSqlCmdMap) confEl.initSqlCmdMap()
        this.dataBeFactory.adn_insert.save(confEl.sqlCmdMap)
            .$promise.then(map => {
                console.log(map, 1)
            })
    }

    newEl_save = () => {
        let newEl = conf.fr[singlePage.LastUrlTag()].NewEl
        if (!newEl)
            newEl = conf.fr[conf.fr[singlePage.LastUrlTag()].fr].NewEl
        console.log(newEl)
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
            adn_deletes: $resource('/r/adn/deletes', { sqlCmdListMap: '@sqlCmdListMap' }),
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
