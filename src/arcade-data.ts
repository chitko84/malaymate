import {ALL_SCENES,CHAPTERS,type Skill} from './story-data';
import {chapterUnlocked,type StoryProgress,type ArcadeMode} from './adaptive';

export interface ArcadePhrase {id:string;skill:Skill;malay:string;english:string;tip:string}
/** Supplementary everyday Malay examples expand play beyond the 24 story answers.
 * Reviewed in source, but native-speaker/educator validation is required before formal FYP deployment. */
export const ARCADE_EXTRA:Record<Skill,[string,string][]>={
 greetings:[
  ['Apa khabar awak?','How are you?'],['Khabar baik, terima kasih.','I am well, thank you.'],['Saya pelajar baharu.','I am a new student.'],['Gembira berkenalan dengan awak.','Nice to meet you.'],['Selamat datang ke kampus.','Welcome to campus.'],['Saya berasal dari luar negara.','I come from abroad.'],['Boleh saya tahu nama awak?','May I know your name?'],['Jumpa awak esok.','See you tomorrow.']
 ],
 campus:[
  ['Di mana dewan kuliah?','Where is the lecture hall?'],['Boleh tunjukkan jalan?','Can you show me the way?'],['Makmal komputer di tingkat dua.','The computer lab is on the second floor.'],['Saya mencari bilik pensyarah.','I am looking for the lecturer’s office.'],['Kelas bermula pukul sembilan.','Class starts at nine.'],['Boleh saya pinjam buku ini?','May I borrow this book?'],['Perpustakaan buka hari ini.','The library is open today.'],['Saya terlupa kad pelajar.','I forgot my student card.']
 ],
 food:[
  ['Saya mahu teh ais.','I would like iced tea.'],['Boleh saya lihat menu?','May I see the menu?'],['Berapa harga nasi lemak?','How much is nasi lemak?'],['Saya tidak makan daging.','I do not eat meat.'],['Boleh bungkus makanan ini?','Could you pack this food to go?'],['Adakah makanan ini pedas?','Is this food spicy?'],['Saya mahu satu lagi.','I would like one more.'],['Terima kasih, makanan ini sedap.','Thank you, this food is delicious.']
 ],
 shopping:[
  ['Boleh kurang harga sedikit?','Can you lower the price a little?'],['Saya hanya mahu satu.','I only want one.'],['Ada saiz lain?','Do you have another size?'],['Saya bayar dengan wang tunai.','I will pay in cash.'],['Boleh saya dapatkan resit?','May I have a receipt?'],['Di mana kedai alat tulis?','Where is the stationery shop?'],['Boleh saya cuba kasut ini?','May I try these shoes on?'],['Berapa jumlah semuanya?','What is the total amount?']
 ],
 directions:[
  ['Bagaimana hendak ke stesen bas?','How do I get to the bus station?'],['Sila jalan terus.','Please go straight.'],['Belok kanan di simpang itu.','Turn right at that junction.'],['Tempat itu dekat sahaja.','That place is nearby.'],['Saya tersesat di sini.','I am lost here.'],['Adakah bas ini ke Alor Setar?','Does this bus go to Alor Setar?'],['Di mana perhentian seterusnya?','Where is the next stop?'],['Saya mahu turun di sini.','I want to get off here.']
 ],
 health:[
  ['Saya demam sejak semalam.','I have had a fever since yesterday.'],['Saya rasa pening sedikit.','I feel a little dizzy.'],['Saya perlu jumpa doktor.','I need to see a doctor.'],['Di mana farmasi terdekat?','Where is the nearest pharmacy?'],['Saya ada alahan makanan.','I have a food allergy.'],['Boleh saya dapatkan bantuan?','Can I get some help?'],['Perut saya sakit hari ini.','My stomach hurts today.'],['Saya mahu berehat sebentar.','I want to rest a while.']
 ],
 social:[
  ['Awak mahu ikut sekali?','Would you like to come along?'],['Jom pergi ke perpustakaan.','Let us go to the library.'],['Awak ada masa petang ini?','Do you have time this afternoon?'],['Kita boleh belajar bersama.','We can study together.'],['Terima kasih kerana menjemput saya.','Thank you for inviting me.'],['Maaf, saya tidak dapat datang.','Sorry, I cannot come.'],['Apakah hobi kegemaran awak?','What is your favourite hobby?'],['Semoga jumpa lagi nanti.','Hope to see you again later.']
 ],
 community:[
  ['Mari kita bantu mereka.','Let us help them.'],['Kita perlu menjaga kebersihan.','We need to maintain cleanliness.'],['Di mana tempat kitar semula?','Where is the recycling area?'],['Saya mahu menjadi sukarelawan.','I want to become a volunteer.'],['Jom tanam pokok bersama-sama.','Let us plant trees together.'],['Tolong ambilkan beg sampah.','Please get the rubbish bag.'],['Kita boleh berkongsi makanan.','We can share food.'],['Terima kasih atas kerjasama semua.','Thank you everyone for your cooperation.']
 ]
};
/** All arcade material comes from curated, unlocked story conversations. */
export function eligibleArcadePhrases(progress:StoryProgress):ArcadePhrase[]{
 const seenMS=new Set<string>(),seenEN=new Set<string>();
 const all:ArcadePhrase[]=[
  ...ALL_SCENES.map(scene=>{const choice=scene.choices[scene.correct];return {id:scene.id,skill:scene.skill,malay:choice.malay,english:choice.english,tip:scene.tip};}),
  ...CHAPTERS.flatMap(ch=>ARCADE_EXTRA[ch.id].map(([malay,english],i)=>({id:`arc-${ch.id}-${i+1}`,skill:ch.id,malay,english,tip:`Practice using “${malay}” in a real conversation.`})))
 ];
 return all.filter(p=>chapterUnlocked(progress,CHAPTERS.findIndex(ch=>ch.id===p.skill))).filter(p=>{
  const ms=p.malay.toLocaleLowerCase('ms-MY'),en=p.english.toLocaleLowerCase('en');
  if(!ms||!en||seenMS.has(ms)||seenEN.has(en))return false;seenMS.add(ms);seenEN.add(en);return true;
 });
}
/** Repeatable seeded shuffle for a session; never mutates curriculum data. */
export function arcadeShuffle<T>(items:readonly T[],seed:number):T[]{
 const out=[...items];let x=(seed>>>0)||1;
 for(let i=out.length-1;i>0;i--){x=(Math.imul(x,1664525)+1013904223)>>>0;const j=x%(i+1);[out[i],out[j]]=[out[j],out[i]];}
 return out;
}
export function selectArcadePhrases(progress:StoryProgress,mode:ArcadeMode,seed:number):ArcadePhrase[]{
 const pool=eligibleArcadePhrases(progress);const size=mode==='memory'?3:Math.min(4,pool.length);
 // Prioritise unseen and weaker skills, then randomise equally ranked items.
 const arranged=arcadeShuffle(pool,seed).sort((a,b)=>{
  const ma=progress.skills[a.skill]?.pKnown??.22,mb=progress.skills[b.skill]?.pKnown??.22;
  const errors=new Set(Object.values(progress.skills).flatMap(skill=>skill?.errors||[]));
  const ea=[...errors].some(id=>id.endsWith(':'+a.id)),eb=[...errors].some(id=>id.endsWith(':'+b.id));
  return Number(eb)-Number(ea)||Math.floor(ma*5)-Math.floor(mb*5);
 });return arranged.slice(0,size);
}
export function wordTiles(text:string,seed:number){
 const words=text.trim().split(/\s+/).map((word,id)=>({id,word}));
 let result=arcadeShuffle(words,seed);
 if(result.length>1&&result.every((word,i)=>word.id===i))result=[...result.slice(1),result[0]];
 return result;
}
export const wordsMatch=(answer:string,expected:string)=>answer.trim().replace(/\s+/g,' ').toLocaleLowerCase('ms-MY')===expected.trim().replace(/\s+/g,' ').toLocaleLowerCase('ms-MY');
