const conf = {}
class AbstractController {
    singlePageUrl = () => window.location.href.split('#!')[1]
    singlePageLastUrl = () => this.singlePageUrl()?this.singlePageUrl().split('/')[this.singlePageUrl().split('/').length-1]:''
    conf = conf
}
