const request=require("request");
const cheerio=require("cheerio");
const scorecardobj=require("./scorecard");
function getallmatcheslink(url){
    request(url,cb);
    function cb(error,response,html){
        if(error){
            console.log(error);
        }
        else{
            extractlinkfromhtml(html);
        }
    }
}
function extractlinkfromhtml(html){
    let $=cheerio.load(html);
    let scorecardele=$("a[data-hover='Scorecard']");
    for(let i=0;i<scorecardele.length;i++){
        let link=$(scorecardele[i]).attr("href");
        let fulllink="https://www.espncricinfo.com"+link;
        console.log(fulllink);
        scorecardobj.ps(fulllink);
    }
}
module.exports={
    getallmatcheslink:getallmatcheslink
}