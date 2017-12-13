var request = require('request'),
    http = require('http'),
    cheerio = require('cheerio'),
    mongoose = require('mongoose'),
    player = require('./app/models/players'),
    schedule = require('./app/models/schedule'),
    async = require('async'),
    fs = require('fs'),
    urls=[],
    playerNames=[];
mongoose.connect('mongodb://webCrawler:crawlin@corbincombs.com:27017/mongoNBAdb');
//mongoose.connect('mongodb://localhost/mongoNBAdb');
var todayDate = new Date();
var minutes = "1:00".split(/[ :]+/);
      minutes = (60*Number(minutes[0]))+Number(minutes[1]);
      console.log(minutes);
var firstNBAGame = new Date("09-30-2016");
var today = new Date();
//console.log(today);
//jsonData=JSON.parse(jsonData);
//console.log(JSON.stringify(jsonData));
var obj = JSON.parse(fs.readFileSync('./nba2017SeasonSchedule.json', 'utf8'));
//console.log(obj.g.vls.pstsg);
var sum=0;
var requests = [];
var counter = 0;



//Find all game data of past games
player.find().sort({dateOfGame:-1}).exec(function(err, data){
    //Get the day after the last saved game
    //var lastSavedGame = new Date(data[0].dateOfGame);
    //lastSavedGame.setDate(lastSavedGame.getDate() + 1);
    var lastSavedGame = new Date("07-01-2017");
    console.log(lastSavedGame);
    //console.log(data[0].dateOfGame);
    //Get todays date with hours set to 0
    var today = new Date("12-11-2017");
    today.setHours(0,0,0,0);
    console.log(today);
    schedule.find({dateOfGame:{$gte : lastSavedGame, $lt: today}}, function (err, scheduleDocs) {
        console.log(scheduleDocs.length);
        for(var j = 0, len = scheduleDocs.length; j< len; j++){

               enterPlayersStats(scheduleDocs[j]);
            
        }


    });
});       
//21700186 unexpected end of input
function enterPlayersStats(scheduleDoc){
    request('http://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2017/scores/gamedetail/00'+scheduleDoc.gameID+'_gamedetail.json',
                function(err, res, body){
                    if(!err && res.statusCode == 200){
                        try{
                            var obj = JSON.parse(body);
                        }catch(err){
                            console.log(err +" "+scheduleDoc.gameID);
                            
                        }
                        
                        counter++;
                        if(counter==scheduleDoc.length-1){console.log("Finished")}
                        console.log(counter);
                        if(obj != undefined){
                            console.log(obj.g.gdte);
                            for(var i = 0, len1 = obj.g.vls.pstsg.length; i< len1; i++){
                                var newPlayer = new player();
                                newPlayer.playerFName=obj.g.vls.pstsg[i].fn;
                                newPlayer.playerLName=obj.g.vls.pstsg[i].ln;
                                newPlayer.dateOfGame=obj.g.gdte;
                                newPlayer.teamAbbreviation=obj.g.vls.ta;
                                newPlayer.teamID=obj.g.vls.tid;
                                newPlayer.opponentAbbreviation=obj.g.hls.ta;
                                newPlayer.opponentID=obj.g.hls.tid;
                                newPlayer.minutesPlayed=obj.g.vls.pstsg[i].min;
                                newPlayer.secondsPlayed=obj.g.vls.pstsg[i].sec;
                                newPlayer.fieldGoals=obj.g.vls.pstsg[i].fgm;
                                newPlayer.fieldGoalsAttempted=obj.g.vls.pstsg[i].fga;
                                newPlayer.threeFieldGoal=obj.g.vls.pstsg[i].tpm;
                                newPlayer.threeFieldGoalAttempted=obj.g.vls.pstsg[i].tpa;
                                newPlayer.freeThrow=obj.g.vls.pstsg[i].ftm;
                                newPlayer.freeThrowAttempted=obj.g.vls.pstsg[i].fta;
                                newPlayer.offensiveRebounds=obj.g.vls.pstsg[i].oreb;
                                newPlayer.defensiveRebounds=obj.g.vls.pstsg[i].dreb;
                                newPlayer.assists=obj.g.vls.pstsg[i].ast;
                                newPlayer.steals=obj.g.vls.pstsg[i].stl;
                                newPlayer.blocks=obj.g.vls.pstsg[i].blk;
                                newPlayer.turnovers=obj.g.vls.pstsg[i].tov;
                                newPlayer.fouls=obj.g.vls.pstsg[i].pf;
                                newPlayer.plusMinus=obj.g.vls.pstsg[i].pm;
                                newPlayer.playerID=obj.g.vls.pstsg[i].pid;
                                newPlayer.totalSeconds=obj.g.vls.pstsg[i].totsec;
                                newPlayer.fbpts=obj.g.vls.pstsg[i].fbpts;
                                newPlayer.fbptsa=obj.g.vls.pstsg[i].fbptsa;
                                newPlayer.fbptsm=obj.g.vls.pstsg[i].fbptsm;
                                newPlayer.pip=obj.g.vls.pstsg[i].pip;
                                newPlayer.pipm=obj.g.vls.pstsg[i].pipm;
                                newPlayer.num=obj.g.vls.pstsg[i].num;
                                newPlayer.pos=obj.g.vls.pstsg[i].pos;
                                newPlayer.tf=obj.g.vls.pstsg[i].tf;
                                newPlayer.blka=obj.g.vls.pstsg[i].blka;
                                newPlayer.status=obj.g.vls.pstsg[i].status;
                                newPlayer.memo=obj.g.vls.pstsg[i].memo;
                                newPlayer.save(function (err) {
                                    if(err){
                                        console.log(err);
                                    }
                                });
                            }
                            for(var i = 0, len1 = obj.g.hls.pstsg.length; i< len1; i++){
                                var newPlayer = new player();
                                newPlayer.playerFName=obj.g.hls.pstsg[i].fn;
                                newPlayer.playerLName=obj.g.hls.pstsg[i].ln;
                                newPlayer.dateOfGame=obj.g.gdte;
                                newPlayer.teamAbbreviation=obj.g.hls.ta;
                                newPlayer.teamID=obj.g.hls.tid;
                                newPlayer.opponentAbbreviation=obj.g.vls.ta;
                                newPlayer.opponentID=obj.g.vls.tid;
                                newPlayer.minutesPlayed=obj.g.hls.pstsg[i].min;
                                newPlayer.secondsPlayed=obj.g.hls.pstsg[i].sec;
                                newPlayer.fieldGoals=obj.g.hls.pstsg[i].fgm;
                                newPlayer.fieldGoalsAttempted=obj.g.hls.pstsg[i].fga;
                                newPlayer.threeFieldGoal=obj.g.hls.pstsg[i].tpm;
                                newPlayer.threeFieldGoalAttempted=obj.g.hls.pstsg[i].tpa;
                                newPlayer.freeThrow=obj.g.hls.pstsg[i].ftm;
                                newPlayer.freeThrowAttempted=obj.g.hls.pstsg[i].fta;
                                newPlayer.offensiveRebounds=obj.g.hls.pstsg[i].oreb;
                                newPlayer.defensiveRebounds=obj.g.hls.pstsg[i].dreb;
                                newPlayer.assists=obj.g.hls.pstsg[i].ast;
                                newPlayer.steals=obj.g.hls.pstsg[i].stl;
                                newPlayer.blocks=obj.g.hls.pstsg[i].blk;
                                newPlayer.turnovers=obj.g.hls.pstsg[i].tov;
                                newPlayer.fouls=obj.g.hls.pstsg[i].pf;
                                newPlayer.plusMinus=obj.g.hls.pstsg[i].pm;
                                newPlayer.playerID=obj.g.hls.pstsg[i].pid;
                                newPlayer.totalSeconds=obj.g.hls.pstsg[i].totsec;
                                newPlayer.fbpts=obj.g.hls.pstsg[i].fbpts;
                                newPlayer.fbptsa=obj.g.hls.pstsg[i].fbptsa;
                                newPlayer.fbptsm=obj.g.hls.pstsg[i].fbptsm;
                                newPlayer.pip=obj.g.hls.pstsg[i].pip;
                                newPlayer.pipm=obj.g.hls.pstsg[i].pipm;
                                newPlayer.num=obj.g.hls.pstsg[i].num;
                                newPlayer.pos=obj.g.hls.pstsg[i].pos;
                                newPlayer.tf=obj.g.hls.pstsg[i].tf;
                                newPlayer.blka=obj.g.hls.pstsg[i].blka;
                                newPlayer.status=obj.g.hls.pstsg[i].status;
                                newPlayer.memo=obj.g.hls.pstsg[i].memo;
                                newPlayer.save(function (err) {
                                    if(err){
                                        console.log(err);
                                    }
                                });
                            }
                        }
                    }

                }
            );
}
function enterPlayByPlay(scheduleDocs, j){}

//Get Schedule into mongoDb Database
/*
for (var i = 0, len = obj.lscd.length; i < len; i++) {
    for (var j = 0, len2 = obj.lscd[i].mscd.g.length; j < len2; j++) {
        var newSchedule = new schedule();
        newSchedule.gameID=obj.lscd[i].mscd.g[j].gid;
        newSchedule.teamID=obj.lscd[i].mscd.g[j].h.tid;
        newSchedule.teamAbbreviation=obj.lscd[i].mscd.g[j].h.ta;
        newSchedule.opponentID=obj.lscd[i].mscd.g[j].v.tid;
        newSchedule.opponentAbbreviation=obj.lscd[i].mscd.g[j].v.ta;
        newSchedule.dateOfGame=obj.lscd[i].mscd.g[j].gdte;
        newSchedule.save(function (err) {
            if(err){
                console.log(err);
            }
            
        });
        sum++;
   
    }
    
   
}
*/


/*var newPlayer = new player();
newPlayer.fieldGoals = 10;
newPlayer.playerName ="Corbin Combs";
newPlayer.plusMinus = -10;
newPlayer.dateOfGame = d;
newPlayer.save(function (err) {
  if(err){
        console.log(err);
    }
});*/

/*
//Get Season Data3
request('http://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2016/league/00_full_schedule.json', function(err, res, body){
    if(!err && res.statusCode == 200){
        fs.writeFile('nba2016SeasonSchedule.json', body, function (err) {
            if (err) return console.log(err);
        });
    }
});*/

/*request('http://www.basketball-reference.com/leagues/NBA_2017_advanced.html', function(err, res, body){
  if(!err && res.statusCode == 200){
      var $ = cheerio.load(body);
      $('[data-stat="player"] a','.full_table').each(function(){
          var dataText = $(this).text();
          playerNames.push(dataText);
          var dataURL = $(this).attr('href');
          urls.push(dataURL);
      });
      for(i=0;i<urls.length;i++){
          console.log(playerNames[i]);
          console.log(urls[i]);
      }
      
  }  
});*/
