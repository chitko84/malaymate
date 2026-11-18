import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const nodes=new Map();
const node=()=>({innerHTML:'',textContent:'',hidden:true,style:{},classList:{contains:()=>false},setAttribute(){},focus(){},querySelector(){return null;}});
const document={querySelector:s=>{if(!nodes.has(s))nodes.set(s,node());return nodes.get(s);},querySelectorAll:()=>[],addEventListener(){},activeElement:null,title:''};
const storage=new Map();
const context=vm.createContext({console,document,Date,URL,URLSearchParams,Blob,location:{search:'',origin:'http://localhost'},parent:{postMessage(){}},setTimeout:()=>0,clearTimeout(){},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},sessionStorage:{getItem:()=>null,setItem(){}},window:{scrollTo(){},speechSynthesis:{cancel(){}}}});
for(const file of ['learning.js','rewards.js','learners.js','data.js','views.js','experience.js','games.js','app.js']){
 let code=fs.readFileSync(new URL('public/classic/'+file,root),'utf8');
 if(file==='app.js')code=code.replace(/render\(\);\s*$/,'');
 vm.runInContext(code,context,{filename:file});
}
context.assert=assert;
vm.runInContext(`
render=()=>{};closeModal=()=>{};toast=()=>{};
function reset(){state=seed();state.extraQuestions={};state.removedQuestions=[];initializeFrontendState();quiz=null;activeGame=null;finishedGame=null;role='student';}
// Reward event identity, date-bound streaks and badge de-duplication.
reset();const base=xp();award('lesson:food-0',20,'Food');award('lesson:food-0',20,'Food');assert.equal(xp(),base+20);assert.equal(streak(),3);const count=state.days.length;award('another',1,'Another activity');assert.equal(state.days.length,count);assert.equal(state.earned.filter(id=>id==='streak-3').length,1);
// Mixed question types: correct scoring, progress, adaptive revision and celebration.
reset();state.lessonSteps['food-0']={tab:3,visited:[0,1,2]};startQuiz('food','Quiz','food-0');for(const q of quiz.questions)quiz.answers[q.id]=q.options?q.correct:q.type==='Sentence building'?q.words.map((_,i)=>i):q.correct.toUpperCase()+'  ';submitQuiz();assert.equal(result.score,100);assert.ok(state.completed.includes('food-0'));assert.equal(result.rewardXP,30);assert.ok(result.newBadges.includes('perfect'));assert.ok(result.levelUp);assert.equal(quiz,null);assert.equal(state.attempts.at(-1).responses.length,5);const post=xp();submitQuiz();assert.equal(xp(),post);
// Repeated attempt is scored, but cannot farm a second same-topic/day XP award.
startQuiz('food','Quiz','food-0');for(const q of quiz.questions)quiz.answers[q.id]=q.options?q.correct:q.type==='Sentence building'?q.words.map((_,i)=>i):q.correct;submitQuiz();assert.equal(result.score,100);assert.equal(result.rewardXP,0);assert.equal(xp(),post);
// Earned daily quests may be claimed once. Incomplete quests cannot be claimed.
claimQuest('lesson');const afterClaim=xp();claimQuest('lesson');assert.equal(xp(),afterClaim);assert.equal(dailyQuests().find(q=>q.id==='lesson').claimed,true);assert.equal(dailyQuests().find(q=>q.id==='answers').value,10);claimQuest('review');assert.equal(xp(),afterClaim);
// New learners start empty; returning to a learner restores only their own records.
captureLearner();const old=state.users[0],u={id:'u-test',name:'New Student',email:'new@example.test',level:'Foundation'};state.users.push(u);loadLearner(u);assert.equal(xp(),0);assert.equal(state.completed.length,0);assert.equal(state.attempts.length,0);award('new-student-event',25,'New student');save();loadLearner(old);assert.equal(xp(),afterClaim);assert.ok(!state.events.some(e=>e.key==='new-student-event'));assert.equal(learnerData('u-test').events.reduce((s,e)=>s+e.xp,0),25);
// Latest review resolves a pending recommendation; low scores leave it pending.
reset();assert.ok(recommendations().some(r=>r.module.id==='shopping'));startQuiz('shopping','Review');for(const q of quiz.questions)quiz.answers[q.id]=q.options?q.correct:q.type==='Sentence building'?q.words.map((_,i)=>i):q.correct;submitQuiz();assert.ok(!recommendations().some(r=>r.module.id==='shopping'));assert.equal(dailyQuests().find(q=>q.id==='review').value,1);
// Missing activity sections prevent completing a lesson even at 100%.
reset();startQuiz('campus','Quiz','campus-0');for(const q of quiz.questions)quiz.answers[q.id]=q.options?q.correct:q.type==='Sentence building'?q.words.map((_,i)=>i):q.correct;submitQuiz();assert.ok(!state.completed.includes('campus-0'));
// Publication and placement rules.
reset();state.modules.find(m=>m.id==='food').status='Unpublished';assert.ok(!visibleModules().some(m=>m.id==='food'));startQuiz('greetings','Placement');for(const q of quiz.questions)quiz.answers[q.id]=q.options?q.correct:q.type==='Sentence building'?q.words.map((_,i)=>i):q.correct;submitQuiz();assert.equal(state.placement.level,'Connections');assert.equal(state.profile.level,'Connections');startQuiz('greetings','Placement');assert.equal(quiz,null);
// Every student/admin page renders with seeded data, with no removed review route.
reset();for(const fn of [dashboard,modulesView,moduleView,lessonView,phrasebook,reviewsView,progressView,achievementsView,profileView,feedbackView,adminDashboard,usersView,contentView,assessmentView,analyticsView,mlView,adminFeedback,settingsView,authView,placementView]){const html=fn();assert.equal(typeof html,'string');assert.ok(html.length>100);assert.ok(!html.toLowerCase().includes('supervisor'));}for(let i=0;i<4;i++){lessonTab=i;assert.ok(lessonView().length>100);}
// Games: wrong pairs, hints, scoring, daily reward identity and student separation.
reset();gameTopic='greetings';gameDifficulty='relaxed';let gameBase=xp();startLearningGame('match');assert.equal(activeGame.phrases.length,3);assert.ok(gameView().includes('I’m ready'));handleGameAction('game-ready');let chosen=activeGame.phrases.map(p=>p.id);selectGamePair('ms',chosen[0]);selectGamePair('en',chosen[1]);assert.equal(activeGame.mistakes,1);for(const id of chosen){selectGamePair('ms',id);selectGamePair('en',id);}assert.equal(finishedGame.score,90);assert.equal(finishedGame.rewardXP,15);assert.equal(state.gameHistory.length,1);assert.ok(state.earned.includes('game-first'));assert.equal(dailyQuests().find(q=>q.id==='game').value,1);let gAfter=xp();finishLearningGame();assert.equal(xp(),gAfter);
startLearningGame('match');for(const id of activeGame.phrases.map(p=>p.id)){selectGamePair('ms',id);selectGamePair('en',id);}assert.equal(finishedGame.rewardXP,0);assert.equal(finishedGame.score,100);assert.equal(state.gameHistory.length,2);assert.equal(xp(),gAfter);
startLearningGame('shuffle');handleGameAction('game-ready');handleGameAction('game-hint');handleGameAction('game-hint');assert.equal(activeGame.hints,1);while(activeGame){let n=activeGame.phrases[activeGame.round].malay.trim().split(/\\s+/).length;activeGame.tokens=Array.from({length:n},(_,i)=>i);checkGameSentence();assert.ok(activeGame.roundDone);handleGameAction('game-next');}assert.equal(finishedGame.score,95);assert.equal(finishedGame.rewardXP,15);assert.equal(state.gameHistory.length,3);assert.ok(gameResultView().includes('95'));claimQuest('game');const gameClaimed=xp();claimQuest('game');assert.equal(xp(),gameClaimed);
let originalLearner=state.users[0];loadLearner({id:'g-new',name:'Game learner',email:'game@example.test',level:'Foundation'});assert.equal(state.gameHistory.length,0);loadLearner(originalLearner);assert.equal(state.gameHistory.length,3);
// Games only use published topic/level content and must not manufacture missing content.
reset();state.modules.find(m=>m.id==='greetings').status='Unpublished';assert.equal(gamePhrases('greetings').length,0);gameTopic='greetings';startLearningGame('match');assert.equal(activeGame,null);gameTopic='all';assert.ok(gamePhrases().every(p=>p.moduleId!=='greetings'));
for(const f of [welcomeView,onboardingView,gamesView]){const html=f();assert.ok(html.length>300);assert.ok(!html.includes('supervisor'));}
console.log('Passed: both games, mistakes, hints, scoring, duplicate XP prevention, game goal, game badges, learner isolation, published-content filters, welcome and onboarding.');
console.log('Passed: scoring, completion, reward identity, streaks, badges, daily quests, repeat XP limit, learner isolation, placement, publication, recommendation resolution and all frontend screen renders.');
`,context);
const app=fs.readFileSync(new URL('public/classic/app.js',root),'utf8');
assert.ok(!app.includes('reviewView'));
assert.ok(!app.includes('nav:review"'));
for(const file of ['index.html','style.css','app.js','data.js','views.js','learning.js','rewards.js','learners.js','pwa.js'])assert.ok(fs.existsSync(new URL('public/classic/'+file,root)));
console.log('Passed: removed review centre and required frontend assets.');
