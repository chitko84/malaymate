import assert from 'node:assert/strict';
import {handleAPI,memoryStore} from '../server/api';
import {LEVELS,questionsFor,starsFor} from '../src/adventure-data';
const store=memoryStore();
async function call(action:string,body:unknown={},status=200){const response=await handleAPI(new Request('https://malaymate.test/api/rooms/'+action,{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://malaymate.test'},body:JSON.stringify(body)}),store);assert.equal(response?.status,status,await response?.clone().text());return response!.json();}
for(const l of LEVELS){const qs=questionsFor(l.id);assert.equal(qs.length,4);for(const q of qs){assert.equal(q.options.length,3);assert.equal(new Set(q.options).size,3);assert.equal(q.options[q.correct],q.malay);}}
assert.deepEqual([0,1,2,3,4].map(starsFor),[0,1,1,2,3]);
const a=await call('create',{name:'Test host',levelId:'greetings'}),sa=a.session;
assert.match(sa.code,/^[A-Z2-9]{6}$/);assert.ok(!JSON.stringify(a.room).includes('hash'));
await call('start',sa,409);await call('sync',{...sa,token:'wrong'},403);await call('join',{code:'NOPE00'},400);
const b=await call('join',{name:'Test friend',code:sa.code}),sb=b.session;
await call('join',{name:'Third player',code:sa.code},409);await call('start',sb,403);
await Promise.all([call('ready',{...sa,ready:true}),call('ready',{...sb,ready:true})]);
const started=await call('start',sa);assert.equal(started.room.started,true);assert.equal(started.room.players.filter((p:any)=>p.ready).length,2);assert.ok(!('malay' in started.room.question));
const q=questionsFor('greetings');
await Promise.all([call('answer',{...sa,index:0,choice:q[0].correct}),call('answer',{...sa,index:0,choice:q[0].correct})]);
let synced=await call('sync',sa);assert.equal(synced.room.players.find((p:any)=>p.id===sa.playerId).score,100);assert.equal(synced.room.players.find((p:any)=>p.id===sa.playerId).index,1);
await call('answer',{...sa,index:1,choice:9},400);
for(let i=1;i<4;i++)await call('answer',{...sa,index:i,choice:q[i].correct});
for(let i=0;i<4;i++)await call('answer',{...sb,index:i,choice:i===1?(q[i].correct+1)%3:q[i].correct});
synced=await call('sync',sa);assert.equal(synced.room.finished,true);assert.deepEqual(synced.room.players.map((p:any)=>p.score),[400,300]);
await call('sync',sa);await call('answer',{...sa,index:3,choice:q[3].correct});
const leaders=await (await handleAPI(new Request('https://malaymate.test/api/leaderboard'),store))!.json();assert.equal(leaders.leaders.length,2);assert.deepEqual(leaders.leaders.map((p:any)=>p.score),[400,300]);
const c=await call('create',{name:'Leaver'});await call('leave',c.session);const raw=await store.get(c.session.code);assert.equal(JSON.parse(raw!.payload).players[0].left,true);
const exp=await call('create',{name:'Expired'}),row=(await store.get(exp.session.code))!;row.expires_at=Date.now()-1;await store.update(row,row.version);await call('sync',exp.session,404);
const evil=await handleAPI(new Request('https://malaymate.test/api/rooms/create',{method:'POST',headers:{Origin:'https://other.test'},body:'{}'}),store);assert.equal(evil?.status,403);
const map=new Map<string,string>();Object.assign(globalThis,{localStorage:{getItem:(k:string)=>map.get(k)||null,setItem:(k:string,v:string)=>map.set(k,v)},window:{dispatchEvent(){}}});
const {readState,finishSolo,xpTotal}=await import('../src/store');const baseline=xpTotal(readState());finishSolo('greetings',2);assert.equal(readState().adventureProgress.greetings.completed,false);assert.equal(xpTotal(readState()),baseline);const result=finishSolo('greetings',4);assert.equal(result.xp,30);assert.equal(readState().adventureProgress.greetings.stars,3);assert.equal(finishSolo('greetings',3).xp,0);assert.equal(readState().adventureProgress.greetings.best,4);assert.equal(xpTotal(readState()),baseline+30);
console.log('Passed: nine levels, unique answers, stars, pass/unlock state, replay XP, real two-player start, token checks, capacity, concurrent ready, duplicate answers, scoring, leaderboard de-duplication, leaving, expiry and cross-origin rejection.');

const {MAP_STOPS,mapLevelState,nextMapStop}=await import('../src/map-stops');
assert.deepEqual(MAP_STOPS.map(s=>s.id),LEVELS.map(l=>l.id));
const fresh=structuredClone(readState());fresh.adventureProgress={};assert.equal(nextMapStop(fresh),0);assert.equal(mapLevelState(fresh,8).unlocked,false);
fresh.adventureProgress.greetings={best:3,stars:2,completed:true,attempts:1};assert.equal(nextMapStop(fresh),1);assert.equal(mapLevelState(fresh,1).unlocked,true);assert.equal(mapLevelState(fresh,2).unlocked,false);assert.equal(mapLevelState(fresh,0).progress.stars,2);
for(const l of LEVELS)fresh.adventureProgress[l.id]={best:4,stars:3,completed:true,attempts:1};assert.equal(nextMapStop(fresh),8);assert.ok(LEVELS.every((_,i)=>mapLevelState(fresh,i).unlocked));
console.log('Passed: map keeps all nine level IDs, selects the next available stop, preserves earned stars and follows existing unlock rules.');

const {advanceRunner,portalAt,travelPosition,checkpoint,shortMission}=await import('../src/game-motion');
const straight=advanceRunner({x:0,z:2},{x:1,z:0},.1,2),diagonal=advanceRunner({x:0,z:2},{x:1,z:1},.1,2);assert.ok(Math.abs(Math.hypot(diagonal.x,diagonal.z-2)-straight.x)<.000001);
assert.deepEqual(advanceRunner({x:5.7,z:5},{x:1,z:1},.1,2),{x:5.7,z:5});
assert.equal(portalAt({x:-4,z:-6},2),0);assert.equal(portalAt({x:0,z:1},2),null);assert.equal(portalAt({x:2,z:-8},2),null);
const arrived=travelPosition({x:0,z:2},2,2,1);assert.equal(arrived.x,4);assert.ok(Math.abs(arrived.z+7.8)<1e-9);assert.equal(checkpoint(3),-40);assert.equal(shortMission('Choose the Malay phrase for “Good morning”'),'Good morning');
console.log('Passed: equal-speed diagonal movement, safe movement bounds, portal collision, arrival position, checkpoints and mission text.');
