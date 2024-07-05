import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname , join } from "path";
import { render } from "ejs";

function setTitle(n1,n2){
    
}

const app=express();
const port=3000;
var batting,sbatting,tn;
var totalball;
var message="";
var currentOvers=0,correctBall=0,score=0,wicket=0;
var firstInningsDone=0;
var totalfacedball=0;
var firstbatting;
var target=0;
var secondInningsDone=0;
const __dirname=dirname(fileURLToPath(import.meta.url));
var noOfplayers,toss,opted,overs,team1,team2,team1player,team2player,team1score=0,team2score=0;
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
var secondInnings;
var currentscore=0,extrasScore=0;
app.post("/secgame",(req,res)=>{
    var secondInningsStarted=0;
    if(secondInnings===1){
        secondInningsStarted=1;
        secondInnings=0;
        console.log("inside if smt this is second innnings");
        score=0;
        currentscore=0;
        currentOvers=0;
        correctBall=0;
        totalfacedball=0;
        wicket=0;
        secondInningsDone=0;
        extrasScore=0;
    }
    
    if(!isNaN(parseInt(req.body["extrasBtn"]))){
        extrasScore=parseInt(req.body["extrasBtn"]);
        score+=extrasScore;
    }
    if(!isNaN(parseInt(req.body["scoreBtn"]))){
        currentscore=parseInt(req.body["scoreBtn"]);
        score+=currentscore;
        correctBall++;
        totalfacedball++;
    }
    
    if(req.body["out"]=="out"){
        correctBall++;
        totalfacedball++;
        wicket++;
        if(wicket===noOfplayers ){
            secondInningsDone=1;
            console.log("second innings over");
        }
    }
    if(correctBall===6){
        currentOvers++;
        correctBall=0;
        if(currentOvers===overs){
            secondInningsDone=1;
            console.log("second innings over");
        }
    }
    
    var targetMessage="";
    if(score<target){
        if(firstbatting=="host"){
            let te=target-score;
            let tb=totalball-totalfacedball;
            targetMessage=team2 + " needs "+te+ " from "+tb;
        }else if(firstbatting=="visitor"){
            let te=target-score;
            let tb=totalball-totalfacedball;
            targetMessage=team1 + " needs "+te+ " from "+tb;
        }
    }
    else{
        secondInningsDone=1;
    }
    message="";
    
    if(secondInningsDone===1){
            if(score>=target){
                if(firstbatting=="host"){
                    let temp=noOfplayers-wicket;
                    message=team2 + " won by "+temp+ " wickets.";
                }else if(firstbatting=="visitor"){
                    let temp=noOfplayers-wicket;
                    message=team1 + " won by "+temp+ " wickets.";
                }
            }else{
                if(firstbatting=="host"){
                    let temp=target-score;
                    message=team1 + " won by "+temp+" runs.";
                }else if(firstbatting=="visitor"){
                    let temp=target-score;
                    message=team1 + " won by "+temp+ " runs.";
                }
            }
    }
    console.log("correct ball "+correctBall);
    console.log("ball faced   "+totalfacedball);
    console.log("curr over    "+currentOvers);
    console.log("total over   "+overs);
    if(batting=="host"){
        sbatting=team2;
    }
    else{
        sbatting=team1;
    }
    if(secondInningsDone===1){
        // console.log("inside if smt this is second innnings");
        res.render("end.ejs",{mess:message});
    }else{
        res.render("see.ejs", {batting:sbatting,balls:correctBall,currentOvers:currentOvers,overs:overs,targetm:targetMessage,team1:team1,team2:team2,score:score,wicket:wicket,cur:currentscore,alert:message,secondInningsDone:secondInningsDone,secondInningsStarted:secondInningsStarted});
    }
});
app.post("/start",async (req,res)=>{
    currentscore=0,extrasScore=0;
    
    if(!isNaN(parseInt(req.body["extrasBtn"]))){
        extrasScore=parseInt(req.body["extrasBtn"]);
        score+=extrasScore;
    }
    if(!isNaN(parseInt(req.body["scoreBtn"]))){
        currentscore=parseInt(req.body["scoreBtn"]);
        score+=currentscore;
        correctBall++;
    }
    
    if(req.body["out"]=="out"){
        correctBall++;
        wicket++;
        if(wicket===noOfplayers ){
            firstInningsDone=1;
            console.log("first innings over");
        }
    }
    if(correctBall===6){
        currentOvers++;
        correctBall=0;
        if(currentOvers===overs){
            firstInningsDone=1;
            console.log("first innings over");
        }
    }
    if(firstInningsDone===1){
        target=score+1;
    }

 
    message="";
    secondInnings=0;

    if(toss==="host" && opted==="bat" || toss==="visitor" && opted==="bowl"){   
        batting="host";
        tn=team1;
    }
    else if(toss==="host" && opted==="bowl" || toss==="visitor" && opted==="bat"){ 
        batting="visitor";
        tn=team2;
    }

    if(firstInningsDone===1){
            secondInnings=1;
            if(toss==="host" && opted==="bat" || toss==="visitor" && opted==="bowl"){
            totalball=overs*6;
            message=team2+" needs "+target+" from "+totalball+" to win.";
            firstbatting="host";
        }
        else if(toss==="host" && opted==="bowl" || toss==="visitor" && opted==="bat"){
            totalball=overs*6;
            message=team1+" needs "+target+" from "+totalball+" to win.";
            firstbatting="visitor";

        }
        console.log("toss  "+toss);
        console.log("opted "+opted);
        console.log("bating "+firstbatting);
        console.log("mess from start  : "+message)
        console.log("");
        firstInningsDone=0;
    }
    console.log("correct ball "+ correctBall);
    console.log("curr over "+currentOvers);

    console.log("total over "+overs);
    res.render("started.ejs",{batting:tn,balls:correctBall,target:target,currentOvers:currentOvers,overs:overs,team1:team1,team2:team2,score:score,wicket:wicket,cur:currentscore,alert:message,secondInnings:secondInnings})

});
app.post("/game",(req,res)=>{
    console.log(req.body);
    team1=req.body["team1"];
    team2=req.body["team2"];
    toss=req.body["forToss"];
    opted=req.body["opted"];
    overs=parseInt(req.body["overs"]);
    noOfplayers=parseInt(req.body["players"]);
    currentscore=0,extrasScore=0;
    score=0;
    wicket=0;
    target=0;
    currentOvers=0;
    correctBall=0;
    
    console.log(toss+" " +opted+" " +overs+" " +team1+" " +team2);
    res.render("game.ejs");
});
app.get("/last",(req,res)=>{
    res.render("end.ejs");
});
app.get("/Guest_login",(req,res)=>{
    res.render("login.ejs");
});
app.get("",(req,res)=>{
    res.render("home.ejs");
});
app.listen(port,()=>{
    console.log(`my project server @ ${port}`);
});