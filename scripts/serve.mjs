import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const option=name=>{const i=process.argv.indexOf(name);return i>=0?process.argv[i+1]:undefined;};
const port=Number(process.env.PORT||option('--port')||8000);
const host=process.env.HOST||option('--host')||'127.0.0.1';
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.zip':'application/zip'};
http.createServer((req,res)=>{let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end('Invalid path');return;}
 const file=path.resolve(root,'.'+(name.endsWith('/')?name+'index.html':name));
 if(!file.startsWith(root)){res.writeHead(403).end('Forbidden');return;}
 fs.stat(file,(err,stat)=>{if(err||!stat.isFile()){res.writeHead(404).end('File not found');return;}
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});fs.createReadStream(file).pipe(res);});
}).listen(port,host,()=>console.log(`MalayMate: http://localhost:${port}`));
