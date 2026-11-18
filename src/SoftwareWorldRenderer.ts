import * as THREE from 'three';
/** CPU projection of the same Three.js scene for devices without WebGL. */
export class SoftwareWorldRenderer {
  domElement=document.createElement('canvas');
  shadowMap={enabled:false,type:THREE.PCFSoftShadowMap};
  outputColorSpace=THREE.SRGBColorSpace;
  private ctx=this.domElement.getContext('2d')!;
  private width=1; private height=1; private ratio=1; private frame=0; private active=true;
  setPixelRatio(n:number){this.ratio=Math.min(n,1.4);}
  setSize(w:number,h:number,_style=false){this.width=w;this.height=h;this.domElement.width=w*this.ratio;this.domElement.height=h*this.ratio;this.domElement.style.width=w+'px';this.domElement.style.height=h+'px';}
  setAnimationLoop(fn:(()=>void)|null){this.active=!!fn;if(!fn)return;let last=0;const loop=(time=0)=>{if(!this.active)return;this.frame=requestAnimationFrame(loop);if(time-last<90)return;last=time;fn();};loop();}
  dispose(){this.active=false;cancelAnimationFrame(this.frame);}
  render(scene:THREE.Scene,camera:THREE.PerspectiveCamera){
    scene.updateMatrixWorld();camera.updateMatrixWorld();camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
    const ctx=this.ctx,w=this.width,h=this.height;ctx.setTransform(this.ratio,0,0,this.ratio,0,0);
    const background=scene.background instanceof THREE.Color?scene.background:new THREE.Color('#e8eefb');ctx.fillStyle=background.getStyle();ctx.fillRect(0,0,w,h);
    type Face={points:THREE.Vector3[];depth:number;layer:number;color:string;texture?:CanvasImageSource;uv?:THREE.Vector2[]};
    const faces:Face[]=[],sprites:{x:number;y:number;w:number;h:number;image:CanvasImageSource;depth:number}[]=[];
    const light=new THREE.Vector3(-.4,.8,.3).normalize();
    scene.traverseVisible(object=>{
      if(object instanceof THREE.Sprite){const m=object.material as THREE.SpriteMaterial;if(!m.map)return;const p=new THREE.Vector3().setFromMatrixPosition(object.matrixWorld),depth=-p.clone().applyMatrix4(camera.matrixWorldInverse).z;if(depth<.1)return;const q=p.project(camera),scale=h/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*depth);sprites.push({x:(q.x+1)*w/2,y:(1-q.y)*h/2,w:object.scale.x*scale,h:object.scale.y*scale,image:m.map.image,depth});return;}
      if(!(object instanceof THREE.Mesh))return;const geo=object.geometry as THREE.BufferGeometry,pos=geo.attributes.position,idx=geo.index,uv=geo.attributes.uv;if(!pos)return;
      const count=idx?idx.count:pos.count;
      for(let i=0;i<count;i+=3){const indices=[0,1,2].map(k=>idx?idx.getX(i+k):i+k),world=indices.map(n=>new THREE.Vector3().fromBufferAttribute(pos,n).applyMatrix4(object.matrixWorld));
        const projected=world.map(p=>p.clone().project(camera));if(projected.some(p=>p.z<=-1||p.z>=1))continue;
        if(projected.every(p=>p.x<-1)||projected.every(p=>p.x>1)||projected.every(p=>p.y<-1)||projected.every(p=>p.y>1))continue;
        const group=geo.groups.find(g=>i>=g.start&&i<g.start+g.count),material=(Array.isArray(object.material)?object.material[group?.materialIndex||0]:object.material) as THREE.MeshStandardMaterial;
        const points=projected.map(p=>new THREE.Vector3((p.x+1)*w/2,(1-p.y)*h/2,p.z));const area=(points[1].x-points[0].x)*(points[2].y-points[0].y)-(points[1].y-points[0].y)*(points[2].x-points[0].x);if(material.side!==THREE.DoubleSide&&area>0)continue;
        const normal=world[1].clone().sub(world[0]).cross(world[2].clone().sub(world[0])).normalize();const depth=-world.reduce((n,p)=>n+p.clone().applyMatrix4(camera.matrixWorldInverse).z,0)/3;
        const color=(material.color||new THREE.Color('#fff')).clone().multiplyScalar(.68+Math.max(0,normal.dot(light))*.38);if(material.emissive)color.add(material.emissive.clone().multiplyScalar(.4));color.lerp(background,Math.max(0,Math.min(.65,(depth-40)/80)));
        faces.push({points,depth,layer:object.renderOrder,color:color.getStyle(),...(material.map&&uv?{texture:material.map.image as CanvasImageSource,uv:indices.map(n=>new THREE.Vector2(uv.getX(n),1-uv.getY(n)))}:{})});
      }
    });
    faces.sort((a,b)=>a.layer-b.layer||b.depth-a.depth);for(const face of faces){const[a,b,c]=face.points;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.closePath();ctx.fillStyle=face.color;ctx.fill();
      if(face.texture&&face.uv){const image=face.texture as HTMLCanvasElement,uv=face.uv.map(p=>new THREE.Vector2(p.x*image.width,p.y*image.height));const[u,v,z]=uv,den=u.x*(v.y-z.y)+v.x*(z.y-u.y)+z.x*(u.y-v.y);if(Math.abs(den)>.001){const affine=(aa:number,bb:number,cc:number)=>[(aa*(v.y-z.y)+bb*(z.y-u.y)+cc*(u.y-v.y))/den,(aa*(z.x-v.x)+bb*(u.x-z.x)+cc*(v.x-u.x))/den,(aa*(v.x*z.y-z.x*v.y)+bb*(z.x*u.y-u.x*z.y)+cc*(u.x*v.y-v.x*u.y))/den];const x=affine(a.x,b.x,c.x),y=affine(a.y,b.y,c.y);ctx.save();ctx.clip();ctx.transform(x[0],y[0],x[1],y[1],x[2],y[2]);ctx.drawImage(image,0,0);ctx.restore();}}
    }
    sprites.sort((a,b)=>b.depth-a.depth);for(const s of sprites)ctx.drawImage(s.image,s.x-s.w/2,s.y-s.h/2,s.w,s.h);
  }
}
