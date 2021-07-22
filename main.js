const request=require("request");
const cheerio=require("cheerio");
const fs=require("fs");
const path=require("path");
const allmatchobj=require("./allmatch")
const iplpath=path.join(__dirname,"ipl");
dircreater(iplpath);
const url="https://www.espncricinfo.com/series/ipl-2020-21-1210595";
request(url,cb);
function cb(error,response,html){
    if(error){
        console.log(error);
    }
    else{
        extractlink(html);
    }
}
function extractlink(html){
    let $=cheerio.load(html);
    let anchorele=$("a[data-hover='View All Results']");
    let link=$(anchorele).attr("href");
    let fulllink="https://www.espncricinfo.com"+link;
    // console.log(fulllink);
    allmatchobj.getallmatcheslink(fulllink);
}
function dircreater(filepath){
    if(fs.existsSync(filepath)==false){
        fs.mkdirSync(filepath);
    }
}
