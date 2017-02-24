// app/routes.js
module.exports = function(app, passport) {
    //redirect http to https
    var User            = require('./models/user');
    var player = require('./models/players');
    
    
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/data', function(req, res){
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
    app.get('/', function(req, res) {
         if (req.isAuthenticated()){
            
        }else{
           res.render('index.ejs');
        }
    });
    
};

