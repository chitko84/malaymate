import {useMemo,useState} from 'react';
import {ArrowLeft,ArrowRight,BrainCircuit,Check,RotateCcw,Volume2} from 'lucide-react';
import {readStory,recordAnswer,reviewQueue,saveStory,type StoryProgress} from './adaptive';
import {reward,updateState} from './store';
import {dateKey} from './adventure-data';
import {CHAPTERS} from './story-data';
import './story.css';
function speak(text:string){if(!('speechSynthesis'in window))return;window.speechSynthesis.cancel();const phrase=new SpeechSynthesisUtterance(text);phrase.lang='ms-MY';phrase.rate=.85;window.speechSynthesis.speak(phrase);}
export default function AdaptiveReview({onStory,onBack}:{onStory:()=>void;onBack:()=>void}){
 const [seed,setSeed]=useState<StoryProgress>(readStory),[queue,setQueue]=useState(()=>reviewQueue(readStory())),[index,setIndex]=useState(0),[score,setScore]=useState(0),[choice,setChoice]=useState<number|null>(null),[done,setDone]=useState(false),[xp,setXP]=useState(0);
 const scene=queue[index],skill=scene?CHAPTERS.find(c=>c.id===scene.skill):undefined;
 const mastery=useMemo(()=>Math.round((seed.skills[scene?.skill||'greetings']?.pKnown||.22)*100),[seed,scene]);
 const mark=(value:number)=>{if(choice!==null||!scene)return;const correct=value===scene.correct;const next=structuredClone(seed);recordAnswer(next,scene.skill,scene.id,correct);saveStory(next);setSeed(next);setChoice(value);if(correct)setScore(n=>n+1);};
 const advance=()=>{if(index+1<queue.length){setIndex(index+1);setChoice(null);return;}setDone(true);if(score>=Math.ceil(queue.length*.8)){let amount=0;updateState(s=>{amount=reward(s,'adaptive-review:'+dateKey(),15,'Personalised practice completed');});setXP(amount);}};
 const again=()=>{const state=readStory();setSeed(state);setQueue(reviewQueue(state));setIndex(0);setScore(0);setChoice(null);setDone(false);setXP(0);};
 return <section className="adaptive-page"><div className="adaptive-top"><button className="story-back" onClick={onBack}><ArrowLeft size={16}/> Back</button><span className="story-kicker"><BrainCircuit size={15}/> PERSONALISED PRACTICE</span></div>
 {done?<div className="story-complete"><span className="story-complete-emoji">{score>=Math.ceil(queue.length*.8)?'🌟':'📚'}</span><p className="story-kicker">REVIEW COMPLETE</p><h1>{score>=Math.ceil(queue.length*.8)?'Your skills are getting stronger!':'Keep going — you are learning.'}</h1><p>{score} out of {queue.length} correct. The model has updated your skill estimates using your responses. {xp?`You earned ${xp} XP.`:'Daily review rewards can be earned once per day.'}</p><div className="story-actions"><button className="button secondary" onClick={again}><RotateCcw size={16}/> Start another review</button><button className="button primary" onClick={onStory}>See story progress <ArrowRight size={16}/></button></div></div>:
 <><div className="adaptive-hero"><div><p className="story-kicker">JUST RIGHT FOR YOUR LEARNING</p><h1>Strengthen what matters <em>most.</em></h1><p>Your question set prioritises earlier mistakes and topics with lower estimated mastery. Correct and incorrect answers both help the learner model adapt.</p></div><div className="adaptive-meter"><BrainCircuit size={30}/><b>{queue.length}<small> focused questions</small></b></div></div>
 <div className="adaptive-progress"><span>QUESTION {index+1} OF {queue.length}</span><span>{score} correct so far</span></div><div className="story-play-track">{queue.map((x,i)=><i key={x.id} className={i<=index?'filled':''}/>)}</div>
 {scene&&<div className="adaptive-question"><div className="adaptive-question-header"><span>{skill?.icon} {skill?.title}</span><span>Estimated skill mastery: {mastery}%</span></div><div className="adaptive-question-body"><span className="adaptive-npc">{scene.avatar}</span><p>{scene.situation}</p><h2>{scene.ask}</h2></div><div className="adaptive-choices">{scene.choices.map((option,i)=><button key={i} onClick={()=>mark(i)} disabled={choice!==null} className={(choice!==null&&i===scene.correct?'right':'')+(choice===i&&i!==scene.correct?' wrong':'')}><span>{String.fromCharCode(65+i)}</span><strong>{option.malay}</strong>{choice!==null&&i===scene.correct&&<Check size={18}/>}</button>)}</div>
 {choice!==null&&<div className="adaptive-feedback" role="status"><strong>{choice===scene.correct?'Correct!':'This one needs another look.'}</strong><p>{scene.tip}</p><p><b>{scene.choices[scene.correct].malay}</b> — {scene.choices[scene.correct].english}</p><div className="story-feedback-buttons"><button className="story-speak" onClick={()=>speak(scene.choices[scene.correct].malay)}><Volume2 size={15}/> Listen</button><button className="button primary" onClick={advance}>{index===queue.length-1?'See my results':'Next question'} <ArrowRight size={15}/></button></div></div>}
 </div>}
 </>}
 <p className="story-disclaimer">Knowledge estimates use Bayesian Knowledge Tracing with declared starting parameters. They are intended to guide practice and are not validated language-proficiency scores.</p>
 </section>;
}
