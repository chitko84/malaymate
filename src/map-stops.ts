import {LEVELS} from './adventure-data';
import type {LearningState} from './types';
import {progressOf} from './store';
/** Illustrated placement based on Natural Earth country outlines. */
export const MAP_STOPS = [
  {id:'greetings',city:'Langkawi',region:'Kedah',x:120,y:159,side:'right',landmark:'village'},
  {id:'campus',city:'George Town',region:'Penang',x:153,y:224,side:'right',landmark:'campus'},
  {id:'food',city:'Ipoh',region:'Perak',x:203,y:273,side:'right',landmark:'food'},
  {id:'shopping',city:'Kuala Lumpur',region:'Kuala Lumpur',x:242,y:368,side:'right',landmark:'city'},
  {id:'directions',city:'Melaka',region:'Melaka',x:279,y:430,side:'left',landmark:'market'},
  {id:'health',city:'Johor Bahru',region:'Johor',x:377,y:475,side:'right',landmark:'clinic'},
  {id:'social',city:'Kuching',region:'Sarawak',x:647,y:456,side:'right',landmark:'village'},
  {id:'community',city:'Miri',region:'Sarawak',x:847,y:285,side:'left',landmark:'village'},
  {id:'workplace',city:'Kota Kinabalu',region:'Sabah',x:961,y:212,side:'right',landmark:'mountain'},
] as const;
export function mapLevelState(state:LearningState,index:number){
  const level=LEVELS[index],progress=progressOf(state,level.id);
  const unlocked=index===0||progressOf(state,LEVELS[index-1].id).completed;
  return {level,progress,unlocked,status:progress.completed?'complete':unlocked?'ready':'locked'} as const;
}
export function nextMapStop(state:LearningState){
  const next=LEVELS.findIndex((_,i)=>{const s=mapLevelState(state,i);return s.unlocked&&!s.progress.completed;});
  return next<0?LEVELS.length-1:next;
}
