import type{Skill}from'./story-data';
export type CampusMissionId='library'|'cafe'|'student';
export interface CampusStep {prompt:string;choices:[string,string,string];correct:number;success:string;help:string;malay:string;english:string;tip:string}
export interface CampusMission {id:CampusMissionId;title:string;place:string;name:string;emoji:string;skill:Skill;color:string;objective:string;intro:string;steps:[CampusStep,CampusStep,CampusStep]}
/** Three progressively contextual turns per character; pass two to finish a mission. */
export const CAMPUS_MISSIONS:CampusMission[]=[
 {id:'library',title:'The Library Trail',place:'Campus Library',name:'Farid',emoji:'🧑🏽‍🏫',skill:'campus',color:'#a18bf0',objective:'Find the library, follow directions, and ask for help.',intro:'You meet Farid at the information point. You need to find a study space before your first class.',steps:[
  {prompt:'How do you ask “Where is the library?”',choices:['Di mana perpustakaan?','Berapa harganya?','Selamat pagi!'],correct:0,success:'Farid: “Perpustakaan di sebelah kiri.”',help:'“Di mana” asks where something is.',malay:'Di mana perpustakaan?',english:'Where is the library?',tip:'Di mana = where; perpustakaan = library.'},
  {prompt:'Farid says the library is on your left. Choose “Turn left.”',choices:['Terus ke hadapan','Belok kiri','Belok kanan'],correct:1,success:'Farid: “Bagus, di sebelah sana!”',help:'Kiri means left; kanan means right.',malay:'Belok kiri',english:'Turn left',tip:'Belok = turn; kiri = left.'},
  {prompt:'You want to ask the librarian another question. What is polite?',choices:['Saya mahu nasi','Jumpa lagi','Boleh saya bertanya?'],correct:2,success:'Farid: “Boleh, silakan bertanya.”',help:'“Boleh saya” starts a polite request.',malay:'Boleh saya bertanya?',english:'May I ask a question?',tip:'Boleh saya…? = May I…?'}
 ]},
 {id:'cafe',title:'Lunch-Time Challenge',place:'Campus Cafeteria',name:'Kak Mira',emoji:'👩🏽‍🍳',skill:'food',color:'#edb66b',objective:'Order lunch and drinks with confidence.',intro:'The cafeteria is busy. Kak Mira has time to serve you if you can place your order politely.',steps:[
  {prompt:'How do you say “May I have water?”',choices:['Saya sakit kepala','Boleh saya minta air?','Belok kanan'],correct:1,success:'Kak Mira: “Boleh, ini air awak.”',help:'“Boleh saya minta” means “May I ask for”.',malay:'Boleh saya minta air?',english:'May I have water?',tip:'Air = water; minta = request.'},
  {prompt:'You would like fried rice. What do you order?',choices:['Saya mahu nasi goreng','Saya mahu buku','Saya kurang sihat'],correct:0,success:'Kak Mira: “Baik, satu nasi goreng!”',help:'“Nasi goreng” means fried rice.',malay:'Saya mahu nasi goreng',english:'I would like fried rice',tip:'Saya mahu = I would like.'},
  {prompt:'You do not want spicy food. What should you say?',choices:['Lebih pedas','Sangat pedas','Tidak pedas'],correct:2,success:'Kak Mira: “Baik, tidak pedas.”',help:'Tidak means not; pedas means spicy.',malay:'Tidak pedas',english:'Not spicy',tip:'Tidak = not; pedas = spicy.'}
 ]},
 {id:'student',title:'A New Campus Friend',place:'Student Centre',name:'Aina',emoji:'👩🏽‍🎓',skill:'social',color:'#6cbbae',objective:'Invite Aina, reply politely, and say goodbye.',intro:'Aina is organising a friendly campus meetup. Start a conversation and join the group.',steps:[
  {prompt:'How do you say “Let’s eat together”?',choices:['Jumpa lagi','Terima kasih','Mari makan bersama'],correct:2,success:'Aina: “Jom! Saya pun lapar.”',help:'“Mari” means “let’s”; bersama means together.',malay:'Mari makan bersama',english:'Let’s eat together',tip:'Mari = let’s; bersama = together.'},
  {prompt:'Aina thanks you. What should you reply?',choices:['Sama-sama','Selamat pagi','Maaf'],correct:0,success:'Aina: “Awak baik hati!”',help:'This is the usual polite reply to “Terima kasih”.',malay:'Sama-sama',english:'You’re welcome',tip:'Sama-sama is a polite reply to thanks.'},
  {prompt:'It is time to leave. What do you say?',choices:['Saya lapar','Jumpa lagi','Berapa harganya?'],correct:1,success:'Aina: “Jumpa lagi! Selamat jalan.”',help:'“Jumpa lagi” means “see you again”.',malay:'Jumpa lagi',english:'See you again',tip:'Jumpa = meet; lagi = again.'}
 ]}
];
