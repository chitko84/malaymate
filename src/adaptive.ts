import {CHAPTERS,ALL_SCENES,type Skill} from './story-data';
/** Bayesian Knowledge Tracing with configurable, declared priors. This is an online probabilistic learner model, not an externally trained classifier. */
export const BKT={prior:.22,learn:.14,guess:.25,slip:.10} as const;
export interface SkillRecord {pKnown:number;attempts:number;correct:number;lastSeen:string;errors:string[]}
export interface ChapterRecord {completed:boolean;best:number;attempts:number;lastPlayed:string}
export interface CampusRecord {completed:boolean;attempts:number;best:number;bestScore?:number}
export type ArcadeMode = 'memory'|'builder'|'listening';
export interface ArcadeRecord {plays:number;best:number;lastPlayed:string}
export interface ArcadeRun {mode:ArcadeMode;score:number;day:string}
export interface StoryProgress {version:1;skills:Partial<Record<Skill,SkillRecord>>;chapters:Partial<Record<Skill,ChapterRecord>>;campus:Record<string,CampusRecord>;arcade:Partial<Record<ArcadeMode,ArcadeRecord>>;arcadeRuns:ArcadeRun[];history:{at:string;skill:Skill;sceneId:string;correct:boolean}[]}
const STORAGE='malaymate-story-v1';
/** Separate preview learners by the classic app's active profile, without copying their credentials. */
export function storyStorageKey(){
 let email='local-preview';
 try{const data=JSON.parse(localStorage.getItem('malaymate-w3-v1')||'null');if(typeof data?.profile?.email==='string'&&data.profile.email.trim())email=data.profile.email.trim().toLowerCase();}catch{/* use preview namespace */}
 let hash=2166136261;for(let i=0;i<email.length;i++){hash^=email.charCodeAt(i);hash=Math.imul(hash,16777619);}
 return STORAGE+':'+(hash>>>0).toString(36);
}
export const emptyStory=():StoryProgress=>({version:1,skills:{},chapters:{},campus:{},arcade:{},arcadeRuns:[],history:[]});
const safeSkill=(s:unknown):s is Skill=>CHAPTERS.some(c=>c.id===s);
export function validateStory(input:unknown):StoryProgress|null{
 if(!input||typeof input!=='object')return null;
 const raw=input as Record<string,unknown>;if(raw.version!==1||!raw.skills||!raw.chapters||!raw.campus||!Array.isArray(raw.history))return null;
 const result=emptyStory();
 for(const [k,v] of Object.entries(raw.skills as Record<string,unknown>)){if(!safeSkill(k)||!v||typeof v!=='object')continue;const r=v as Partial<SkillRecord>;if(typeof r.pKnown!=='number'||!Number.isFinite(r.pKnown)||r.pKnown<0||r.pKnown>1||!Number.isInteger(r.attempts)||r.attempts!<0||!Number.isInteger(r.correct)||r.correct!<0||r.correct!>r.attempts!)continue;result.skills[k]={pKnown:r.pKnown,attempts:r.attempts!,correct:r.correct!,lastSeen:typeof r.lastSeen==='string'?r.lastSeen:'',errors:Array.isArray(r.errors)?r.errors.filter(x=>typeof x==='string').slice(-30):[]};}
 for(const [k,v] of Object.entries(raw.chapters as Record<string,unknown>)){if(!safeSkill(k)||!v||typeof v!=='object')continue;const r=v as Partial<ChapterRecord>;if(!Number.isInteger(r.best)||r.best!<0||r.best!>3||!Number.isInteger(r.attempts)||r.attempts!<0)continue;result.chapters[k]={best:r.best!,attempts:r.attempts!,completed:r.completed===true,lastPlayed:typeof r.lastPlayed==='string'?r.lastPlayed:''};}
 for(const [k,v] of Object.entries(raw.campus as Record<string,unknown>)){if(!['library','cafe','student'].includes(k)||!v||typeof v!=='object')continue;const r=v as Partial<CampusRecord>;if(!Number.isInteger(r.attempts)||r.attempts!<0||!Number.isInteger(r.best)||r.best!<0||r.best!>1)continue;result.campus[k]={completed:r.completed===true,attempts:r.attempts!,best:r.best!,...(Number.isInteger(r.bestScore)&&r.bestScore!>=0&&r.bestScore!<=3?{bestScore:r.bestScore}: {})};}
 const modes:ArcadeMode[]=['memory','builder','listening'];
 if(raw.arcade&&typeof raw.arcade==='object'){for(const [k,v] of Object.entries(raw.arcade as Record<string,unknown>)){if(!modes.includes(k as ArcadeMode)||!v||typeof v!=='object')continue;const r=v as Partial<ArcadeRecord>;if(!Number.isInteger(r.plays)||r.plays!<0||!Number.isInteger(r.best)||r.best!<0||r.best!>100)continue;result.arcade[k as ArcadeMode]={plays:r.plays!,best:r.best!,lastPlayed:typeof r.lastPlayed==='string'?r.lastPlayed:''};}}
 if(Array.isArray(raw.arcadeRuns))result.arcadeRuns=raw.arcadeRuns.filter((x):x is ArcadeRun=>{if(!x||typeof x!=='object')return false;const r=x as Record<string,unknown>;return modes.includes(r.mode as ArcadeMode)&&Number.isInteger(r.score)&&Number(r.score)>=0&&Number(r.score)<=100&&typeof r.day==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(r.day);}).slice(-120);
 result.history=(raw.history as unknown[]).filter((x):x is StoryProgress['history'][number]=>{if(!x||typeof x!=='object')return false;const e=x as Record<string,unknown>;return typeof e.at==='string'&&safeSkill(e.skill)&&typeof e.sceneId==='string'&&typeof e.correct==='boolean';}).slice(-400);
 return result;
}
export function readStory():StoryProgress{try{return validateStory(JSON.parse(localStorage.getItem(storyStorageKey())||'null'))||emptyStory();}catch{return emptyStory();}}
export function saveStory(s:StoryProgress){localStorage.setItem(storyStorageKey(),JSON.stringify(s));window.dispatchEvent(new Event('malaymate-story-update'));}
export function posterior(prior:number,correct:boolean,params=BKT){
 const likelihood=correct?prior*(1-params.slip):prior*params.slip;
 const alternative=correct?(1-prior)*params.guess:(1-prior)*(1-params.guess);
 const observed=likelihood/(likelihood+alternative);
 return Math.max(0,Math.min(1,observed+(1-observed)*params.learn));
}
export function recordAnswer(s:StoryProgress,skill:Skill,sceneId:string,correct:boolean,now=new Date().toISOString()){
 const old=s.skills[skill]||{pKnown:BKT.prior,attempts:0,correct:0,lastSeen:'',errors:[]};
 s.skills[skill]={pKnown:posterior(old.pKnown,correct),attempts:old.attempts+1,correct:old.correct+Number(correct),lastSeen:now,errors:correct?old.errors.filter(x=>x!==sceneId):[...old.errors.filter(x=>x!==sceneId),sceneId].slice(-30)};
 s.history.push({at:now,skill,sceneId,correct});s.history=s.history.slice(-400);
 return s;
}
export function finishChapter(s:StoryProgress,skill:Skill,score:number,now=new Date().toISOString()){
 const old=s.chapters[skill]||{completed:false,best:0,attempts:0,lastPlayed:''};
 s.chapters[skill]={completed:old.completed||score>=2,best:Math.max(old.best,score),attempts:old.attempts+1,lastPlayed:now};
 return s;
}
export function finishCampus(s:StoryProgress,id:string,correct:boolean,score?:number){
 // Legacy one-question progress remains valid; v6 tracks best of three conversation turns.
 const old=s.campus[id]||{completed:false,attempts:0,best:0};
 const safeScore=score===undefined?Number(correct):Math.max(0,Math.min(3,Math.round(score)));
 s.campus[id]={completed:old.completed||correct,attempts:old.attempts+1,best:Math.max(old.best,Number(correct)),bestScore:Math.max(old.bestScore??0,safeScore)};return s;
}
export function finishArcade(s:StoryProgress,mode:ArcadeMode,score:number,day:string,now=new Date().toISOString()){
 const points=Math.max(0,Math.min(100,Math.round(score))),old=s.arcade[mode]||{plays:0,best:0,lastPlayed:''};
 s.arcade[mode]={plays:old.plays+1,best:Math.max(old.best,points),lastPlayed:now};
 s.arcadeRuns.push({mode,score:points,day});s.arcadeRuns=s.arcadeRuns.slice(-120);return s;
}
export function arcadeDailyModes(s:StoryProgress,day:string):ArcadeMode[]{return (['memory','builder','listening'] as ArcadeMode[]).filter(mode=>s.arcadeRuns.some(r=>r.day===day&&r.mode===mode));}
export const chapterUnlocked=(s:StoryProgress,index:number)=>index===0||Boolean(s.chapters[CHAPTERS[index-1].id]?.completed);
export const recommendation=(s:StoryProgress)=>{
 const weak=CHAPTERS.filter((c,i)=>chapterUnlocked(s,i)&&(s.skills[c.id]?.attempts||0)>0).sort((a,b)=>(s.skills[a.id]?.pKnown||0)-(s.skills[b.id]?.pKnown||0));
 const needsReview=weak.find(c=>(s.skills[c.id]?.pKnown||0)<.72);
 if(needsReview)return {chapter:needsReview,reason:`Review ${needsReview.title}: estimated mastery ${Math.round((s.skills[needsReview.id]?.pKnown||0)*100)}%.`};
 const next=CHAPTERS.find((c,i)=>chapterUnlocked(s,i)&&!s.chapters[c.id]?.completed);
 return {chapter:next||CHAPTERS[CHAPTERS.length-1],reason:next?'Continue your next unlocked chapter.':'All chapters completed. Practise to strengthen fluency.'};
};
export function exportProgress(s:StoryProgress){return JSON.stringify({app:'MalayMate',type:'learning-progress',exportedAt:new Date().toISOString(),story:s},null,2);}

/** Prioritise recent mistakes and low-mastery skills, restricted to story chapters already unlocked. */
export function reviewQueue(s:StoryProgress,limit=5){
 const available=ALL_SCENES.filter(sc=>chapterUnlocked(s,CHAPTERS.findIndex(c=>c.id===sc.skill)));
 const errors=new Set(Object.values(s.skills).flatMap(r=>r?.errors||[]));
 // Rotate unseen questions so learners do not always receive the same first set.
 const offset=s.history.length%Math.max(available.length,1);
 const ordered=available.map((scene,i)=>({scene,priority:(errors.has(scene.id)?-10:0)+(s.skills[scene.skill]?.pKnown??BKT.prior),turn:(i-offset+available.length)%available.length}));
 ordered.sort((a,b)=>a.priority-b.priority||a.turn-b.turn);
 return ordered.slice(0,Math.min(limit,ordered.length)).map(x=>x.scene);
}
