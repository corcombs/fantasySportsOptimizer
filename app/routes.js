// app/routes.js
module.exports = function(app, passport) {
    //redirect http to https
    var User            = require('./models/user');
    var player = require('./models/players');
    var schedule = require('./models/schedule');
    var request =require('request');
    
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/fantasyBasketball', function(req, res){
    var htmlData = '';
    
    player.find().lean().exec(function(err,data){
        if(err){
            res.send(err);
        }else{
            //jsonData=JSON.parse(data);
            
            for(var i=0;i<data.length;i++){
                htmlData=data[i].playerFName+','+data[i].playerLName+','+data[i].dateOfGame+','+data[i].teamAbbreviation+','+data[i].opponentAbbreviation+','+data[i].minutesPlayed+','+data[i].secondsPlayed+','+data[i].fieldGoals+','+data[i].fieldGoalsAttempted+','+data[i].threeFieldGoal+','+data[i].threeFieldGoalAttempted+','+data[i].freeThrow+','+data[i].freeThrowAttempted+','+data[i].offensiveRebounds+','+data[i].defensiveRebounds+','+data[i].assists+','+data[i].steals+','+data[i].blocks+','+data[i].turnovers+','+data[i].fouls+','+data[i].plusMinus+'<br/>'+htmlData;
            }
            htmlData='FirstName,LastName,GameDate,Team,Opponent,Minutes,Seconds,FieldGoals,FieldGoalsAttempted,ThreeFieldGoals,ThreeFieldGoalsAttempted,FreeThrows,FreeThrowsAttempted,OffensiveRebounds,DefensiveRebounds,Assists,Steals,Blocks,Turnovers,Fouls,PlusMinus<br/>'+htmlData;
            res.send(htmlData);
        }
    });
});

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });
    app.get('/runCrawler', function(req, res){
        if(req.isAuthenticated()){
            player.find().sort({dateOfGame:-1}).exec(function(err, data){
            //Get the day after the last saved game
            /*var lastSavedGame = new Date(data[0].dateOfGame);
            lastSavedGame.setDate(lastSavedGame.getDate() + 1);
            console.log(data[0].dateOfGame);*/
                lastSavedGame= new Date("09-30-2016");
            //Get todays date with hours set to 0
            var today = new Date();
            today.setHours(0,0,0,0);
            schedule.find({dateOfGame:{$gte : lastSavedGame, $lt: today}}, function (err, scheduleDocs) {
                console.log(scheduleDocs.length);
                for(var j = 0, len = scheduleDocs.length; j< len; j++){
       var counter=0; request('http://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2016/scores/gamedetail/00'+scheduleDocs[j].gameID+'_gamedetail.json',
                        function(err, res, body){
                            if(!err && res.statusCode == 200){
                                try{
                                    var obj = JSON.parse(body);    
                                }catch(err){
                                    console.log(err);
                                }
                                
                                counter++;
                                if(counter==scheduleDocs.length-1){console.log("Finished")}
                                console.log(counter);
                                if(obj){
                                    
                                }
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
                                    newPlayer.save(function (err) {
                                        if(err){
                                            console.log(err);
                                        }

                                    });
                                }
                            }

                        }
                    );
                }


            });
        });

        } 
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });


    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    //SIGNUP
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    app.get('/usersList', function(req, res) {
        if (req.isAuthenticated()){
            User.find({}, function(err, users) {
                var userMap = {};
                var i=0;
                users.forEach(function(user) {
                    userMap[i] = user;
                    i++;
                });
                res.render('usersList.ejs', {user: userMap});
            });
        
        }else{
           res.redirect('/');
        }
    });

    
};

