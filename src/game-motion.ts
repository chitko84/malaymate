export type Point={x:number;z:number};
export type Move={x:number;z:number};
export const checkpoint=(step:number)=>2-step*14;
/** Clamp free movement to the current section; diagonal movement has equal speed. */
export function advanceRunner(p:Point,input:Move,seconds:number,base:number):Point{
 const length=Math.hypot(input.x,input.z)||1,speed=6.4*Math.max(0,Math.min(seconds,.12));
 return {x:Math.max(-5.7,Math.min(5.7,p.x+input.x/Math.max(1,length)*speed)),z:Math.max(base-10,Math.min(base+3,p.z+input.z/Math.max(1,length)*speed))};
}
export function portalAt(p:Point,base:number):number|null{
 if(p.z>base-7.7)return null;
 const n=Math.round(p.x/4)+1;
 return n>=0&&n<3&&Math.abs(p.x-(n-1)*4)<1.2?n:null;
}
export function travelPosition(start:Point,gate:number,base:number,progress:number):Point{
 const t=Math.max(0,Math.min(1,progress)),ease=1-Math.pow(1-t,3);
 return {x:start.x+((gate-1)*4-start.x)*Math.min(1,ease*1.6),z:start.z+(base-9.8-start.z)*ease};
}
export function shortMission(prompt:string){return prompt.replace(/^Choose the Malay phrase for\s*/, '').replace(/^[“"]|[”"]$/g,'');}
