import assert from 'node:assert/strict';
import {ALL_SCENES,CHAPTERS} from '../src/story-data';
import {BKT,chapterUnlocked,emptyStory,exportProgress,finishCampus,finishChapter,posterior,readStory,recommendation,recordAnswer,reviewQueue,saveStory,storyStorageKey,validateStory} from '../src/adaptive';
const data=new Map<string,string>();Object.assign(globalThis,{localStorage:{getItem:(k:string)=>data.get(k)||null,setItem:(k:string,v:string)=>data.set(k,v)},window:{dispatchEvent:()=>{}}});
assert.equal(CHAPTERS.length,8);assert.equal(ALL_SCENES.length,24);assert.equal(new Set(CHAPTERS.map(c=>c.id)).size,8);
for(const ch of CHAPTERS){assert.equal(ch.scenes.length,3);for(const scene of ch.scenes){assert.equal(scene.choices.length,3);assert.equal(new Set(scene.choices.map(c=>c.malay)).size,3);assert.ok(scene.correct>=0&&scene.correct<3);assert.ok(scene.positive&&scene.recover&&scene.tip);}}
assert.ok(posterior(BKT.prior,true)>BKT.prior);assert.ok(posterior(BKT.prior,false)<BKT.prior);assert.ok(posterior(.99,true)<=1);
let s=emptyStory();assert.equal(chapterUnlocked(s,0),true);assert.equal(chapterUnlocked(s,1),false);assert.equal(recommendation(s).chapter.id,'greetings');
recordAnswer(s,'greetings','g1',true);recordAnswer(s,'greetings','g2',false);assert.equal(s.skills.greetings?.attempts,2);assert.equal(s.skills.greetings?.correct,1);assert.deepEqual(s.skills.greetings?.errors,['g2']);assert.equal(s.history.length,2);
recordAnswer(s,'greetings','g2',true);assert.deepEqual(s.skills.greetings?.errors,[]);
finishChapter(s,'greetings',1);assert.equal(s.chapters.greetings?.completed,false);assert.equal(chapterUnlocked(s,1),false);
finishChapter(s,'greetings',2);assert.equal(s.chapters.greetings?.best,2);assert.equal(s.chapters.greetings?.attempts,2);assert.equal(chapterUnlocked(s,1),true);assert.equal(reviewQueue(s).length,5);assert.equal(new Set(reviewQueue(s).map(x=>x.id)).size,5);
finishChapter(s,'greetings',0);assert.equal(s.chapters.greetings?.completed,true);assert.equal(s.chapters.greetings?.best,2);
finishCampus(s,'library',false);assert.equal(s.campus.library.completed,false);finishCampus(s,'library',true);assert.equal(s.campus.library.completed,true);assert.equal(s.campus.library.attempts,2);
saveStory(s);assert.deepEqual(readStory(),s);const backup=JSON.parse(exportProgress(s));assert.equal(backup.app,'MalayMate');assert.deepEqual(validateStory(backup.story),s);
assert.equal(validateStory({version:1,skills:{greetings:{pKnown:1.5,attempts:3,correct:4}},chapters:{},campus:{},history:[]})?.skills.greetings,undefined);
assert.equal(validateStory({version:3,skills:{},chapters:{},campus:{},history:[]}),null);
const oldKey=storyStorageKey();data.set('malaymate-w3-v1',JSON.stringify({profile:{email:'another@student.aiu.edu.my'}}));assert.notEqual(storyStorageKey(),oldKey);assert.equal(readStory().history.length,0);
console.log('Passed: eight complete chapters, 24 unique three-choice conversations, BKT updates, replay progress, unlocking, campus completion, backup validation, and per-learner isolation.');
