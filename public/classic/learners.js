'use strict';
// Browser-only data adapter. Replace with authenticated API calls for production.
const learnerFields=['profile','completed','lessonSteps','access','attempts','events','days','longest','earned','placement','dailyGoal','badgeDates','gameHistory','onboardingDone','adventureProgress'];
function initializeFrontendState(){
 delete state.notes;delete state.checks;
 state.activeStudentId??=state.users.find(u=>u.email===state.profile.email)?.id||'u1';
 state.learnerStore??={};state.adventureProgress??={};state.gameHistory??=[];state.onboardingDone??=false;state.dailyGoal??=30;state.badgeDates??={};
 state.badgeDefs.forEach(b=>{b.target??=b.condition==='streak'?3:b.condition==='lesson'?1:b.xp||1});
 const extra=[
 {id:'lesson-5',title:'Finding your voice',description:'Complete 5 lessons',condition:'lesson',target:5,emoji:'🗣️'},
 {id:'perfect',title:'Perfectly said',description:'Score 100% on an assessment',condition:'perfect',target:1,emoji:'🎯'},
 {id:'review-3',title:'Comeback learner',description:'Complete 3 personalised reviews',condition:'review',target:3,emoji:'🔄'},
 {id:'module-1',title:'A world of words',description:'Finish every lesson in one module',condition:'module',target:1,emoji:'🌍'},
 {id:'streak-7',title:'Seven days of confidence',description:'Practise for 7 consecutive days',condition:'streak',target:7,emoji:'🔥'},
 {id:'xp-500',title:'Malay trailblazer',description:'Earn 500 XP',condition:'xp',target:500,xp:500,emoji:'🏆'}];
 if(!state.rewardsV2){for(const b of extra)state.badgeDefs.push({...b,xp:b.xp||0,active:true});state.rewardsV2=true;}
 if(!state.gamesV3){state.badgeDefs.push({id:'game-first',title:'Game on!',description:'Finish your first learning game',condition:'game',target:1,xp:0,active:true,emoji:'🎮'},{id:'game-five',title:'Play and learn',description:'Finish 5 learning games',condition:'game',target:5,xp:0,active:true,emoji:'🧩'});state.gamesV3=true;}
 captureLearner();
}
function captureLearner(){if(!state?.learnerStore)return;state.learnerStore[state.activeStudentId]=Object.fromEntries(learnerFields.map(k=>[k,JSON.parse(JSON.stringify(state[k]??null))]));}
function freshLearner(u){return {profile:{name:u.name,email:u.email,studentId:u.studentId||'',nationality:u.nationality||'',goal:'Speak confidently in everyday situations',level:u.level||'Foundation'},completed:[],lessonSteps:{},access:{},attempts:[],events:[],days:[],longest:0,earned:[],placement:null,dailyGoal:30,badgeDates:{},gameHistory:[],onboardingDone:false,adventureProgress:{}};}
function learnerData(id){if(id===state.activeStudentId)return Object.fromEntries(learnerFields.map(k=>[k,state[k]]));return state.learnerStore[id]||freshLearner(state.users.find(u=>u.id===id)||{});}
function loadLearner(u){captureLearner();let data=JSON.parse(JSON.stringify(state.learnerStore[u.id]||freshLearner(u)));state.activeStudentId=u.id;for(const k of learnerFields)state[k]=data[k];Object.assign(state.profile,{name:u.name,email:u.email,studentId:u.studentId||'',nationality:u.nationality||''});state.adventureProgress??={};state.gameHistory??=[];state.onboardingDone??=false;state.dailyGoal??=30;state.badgeDates??={};}
function showStudentDetails(id){let u=state.users.find(u=>u.id===id),d=learnerData(id);openModal(esc(u.name)+' · Learning record',`<div class="detail-grid"><div><small>Total XP</small><strong>${d.events.reduce((s,e)=>s+e.xp,0)}</strong></div><div><small>Completed lessons</small><strong>${d.completed.length}</strong></div><div><small>Assessments</small><strong>${d.attempts.length}</strong></div></div><p class="tiny muted space">${esc(u.email)} · ${esc(d.profile.level)} · ${d.earned.length} badges earned</p>${d.attempts.length?attemptTable(d.attempts):'<div class="empty">No learning activity yet.</div>'}`);}

function cohortAttempts(){captureLearner();return Object.values(state.learnerStore).flatMap(d=>d.attempts).sort((a,b)=>String(a.end).localeCompare(String(b.end)));}
