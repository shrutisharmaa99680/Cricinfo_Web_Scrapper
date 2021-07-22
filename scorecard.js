const request = require("request");
const cheerio=require("cheerio");
const xlsx=require("xlsx");
const path=require("path");
const fs=require("fs");
// const url="https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
function processscorecard(url){
    request(url,cb);
}

function cb(error,response,html){
    if(error){
        console.log(error);
    }
    else{
        extractalldetails(html);
    }
}
function extractalldetails(html){
    let $=cheerio.load(html);
    let datevenue=$(".event .description");
    let result=$(".event .status-text");
    let stringarr=datevenue.text().split(",");
    let venue=stringarr[1].trim();
    let date=stringarr[2].trim();
     result=result.text();
    let innings=$(".card.content-block.match-scorecard-table>.Collapsible");
    let htmlstring="";
    for(let i=0;i<innings.length;i++){
        // htmlstring=$(innings[i]).html();
        // there will be only one inning
        let teamname=$(innings[i]).find("h5");
        let stringarr=teamname.text().split("INNINGS");
        teamname=stringarr[0].trim();
        let opponentidx=i==0?1:0;
        let opponent=$(innings[opponentidx]).find("h5");
        let array=opponent.text().split("INNINGS");
        opponent=array[0].trim();
        console.log(`${venue} | ${date} | ${teamname} | ${opponent}`);
        let allrows=$(innings[i]).find(".table.batsman tbody tr");
        for(let j=0;j<allrows.length;j++){
            let allcol=$(allrows[j]).find("td");
            let isworthy=$(allcol[0]).hasClass("batsman-cell");
            if(isworthy==true){
                // console.log(allcol.text());
                let playername=$(allcol[0]).text().trim();
                let runs=$(allcol[2]).text().trim();
                let balls=$(allcol[3]).text().trim();
                let fours=$(allcol[5]).text().trim();
                let sixes=$(allcol[6]).text().trim();
                let strikerate=$(allcol[7]).text().trim();
                console.log(`${playername} ${runs} ${balls} ${fours} ${sixes} ${strikerate}`);
                processplayer(teamname,playername,runs,balls,fours,sixes,strikerate,opponent,venue,date,result);
            }
        }
        // console.log(opponent);

    }
}
    // console.log(htmlstring);
    function processplayer(teamname,playername,runs,balls,fours,sixes,strikerate,opponent,venue,date,result){
        let teampath=path.join(__dirname,"ipl",teamname);
        dircreater(teampath);
        let filepath=path.join(teampath,playername+".xlsx");
        let content=excelreader(filepath,playername);
        let playerobj={
            teamname,
            playername,
            runs,
            balls,
            fours,
            sixes,
            strikerate,
            opponent,
            venue,
            date,
            result
        }
        content.push(playerobj);
        excelwriter(filepath,content,playername);
    }
    function dircreater(filepath){
        if(fs.existsSync(filepath)==false){
            fs.mkdirSync(filepath);
        }
    }
    function excelwriter(filepath,json,sheetname){
        let newwb=xlsx.utils.book_new();
        let newws=xlsx.utils.json_to_sheet(json);
        xlsx.utils.book_append_sheet(newwb,newws,sheetname);
        xlsx.writeFile(newwb,filepath);
    }
    function excelreader(filepath,sheetname){
        if(fs.existsSync(filepath)==false){
            return [];
        }
        let wb=xlsx.readFile(filepath);
        let exceldata=wb.Sheets[sheetname];
        let ans=xlsx.utils.sheet_to_json(exceldata);
        return ans;
    }

    module.exports={
        ps:processscorecard
    }